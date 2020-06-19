const { getInviteCode } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { codePosterBg } = require('../../utils/images');

Component({

  behaviors: [],

  properties: {
    type: Number, // 类型 0代理 1园长
    postBgIndex: { // 海报背景图index
      type: Number,
      value: 0
    },
  },
  data: {
    log: null,
    windowWidth: null, // 物理宽度
    windowHeight: null, // 物理高度
    ratio: null,  // 相对比例
    bgImg: '', // 生成的背景图片
    headPic: '', // 头像
    userName: '', // 昵称或真实姓名
    codeImg: '',
    postBgPicList: codePosterBg,
    downBgPicList: [[],[]],
    postBgImg: '',
  },

  // 生命周期函数
  created() {

  },
  attached() {
    this.setData({
      log: new Date().getTime() + '' + Math.floor(Math.random()*10000),
    });
    this.getWindowInfo();
    console.log(this.data, 'data');
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 生成邀请二维码
    getInviteCode () {
      return new Promise(resolve => {
        let pid = wx.getStorageSync('functionConfig').packageId;
        let url = `pages/saleEntrance/saleEntrance?type=${this.data.type+1}&pid=${pid}`;
        let logId = wx.getStorageSync('shareLogId');
        let params = {
          path: `/pages/authorized/authorized?logId=${logId}&realUrl=${encodeURIComponent(url)}`
          // path: `pages/saleEntrance/saleEntrance?type=${this.data.type+1}&pid=${pid}`     // 二维码跳转页面
        };
        ajax(getInviteCode, {data: params, method: 'post'}).then(res => {
          if (res.code === 0) {
            this.setData({
              codeImg: res.data.pic
            });
            wx.setStorageSync('codeLogId', res.data.log_id);
            resolve();
          }
        }).catch(res => {
          console.log(res.msg);
        });
      });
    },
    // 绘制背景海报
    createdBgCanvas () {
      let canvasWidthPx = 518 / this.data.ratio;
      let canvasHeightPx = 920 / this.data.ratio;
      let ctx = wx.createCanvasContext('posterCanvas', this);
      // 背景图
      ctx.save();
      ctx.drawImage(
        this.data.postBgImg, 
        0, 
        0, 
        canvasWidthPx, 
        canvasHeightPx
      );
      ctx.restore();
      // 画头像
      ctx.beginPath();
      ctx.save();
      ctx.arc( 
        this.data.type ? 261 / this.data.ratio : 259 / this.data.ratio,
        this.data.type ? 429 / this.data.ratio : 394 / this.data.ratio,
        // 259 / this.data.ratio,
        // 394 / this.data.ratio, 
        40 / this.data.ratio, 
        0, 
        2 * Math.PI
      );
      ctx.clip();
      ctx.drawImage( 
        this.data.headPic,
        this.data.type ? 221 / this.data.ratio : 219 / this.data.ratio,
        this.data.type ? 389 / this.data.ratio : 354 / this.data.ratio,
        80 / this.data.ratio,
        80 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      // 昵称 
      ctx.setFontSize(14 / this.data.ratio);
      ctx.setFillStyle('#333');
      ctx.setFillStyle(this.data.postBgIndex === 2 ? '#fff' : '#333');
      ctx.fillText(
        '我是' + this.data.userName,
        (canvasWidthPx - ctx.measureText('我是'+this.data.userName).width) / 2,
        this.data.type ? 490 / this.data.ratio : 460 / this.data.ratio
      );
      // 画小程序码
      ctx.drawImage( 
        this.data.codeImg,
        191 / this.data.ratio,
        this.data.type ? 555 / this.data.ratio : 528 / this.data.ratio,
        136 / this.data.ratio,
        136 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      this.drawAgain(ctx, new Date().getTime());
    },
    drawAgain (ctx, time) {
      let now_time = new Date().getTime();
      if (now_time - time > 1000 * 20) {
        wx.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none'
        });
        console.log('网络错误，请稍后再试');
        return;
      }
      let _this = this;
      ctx.draw(true, () => {
        wx.canvasToTempFilePath({
          canvasId: 'posterCanvas',
          width: 518,
          height: 920,
          destWidth: 750,
          destHeight: 1332,
          fileType: 'jpg',
          quality: 1,
          success: res => {
            wx.hideLoading();
            _this.setData({
              bgImg: res.tempFilePath
            });
            console.log(this.data.bgImg,'bgImg');
          },
          fail: resp => {
            console.log(resp,'背景海报失败');
            _this.drawAgain(ctx, time);
          }
        }, this);
      });
    },
    changeBgImg () {
      wx.showLoading({
        title: '海报生成中',
        mask: false
      });
      this.setData({
        bgImg: ''
      });
      if (this.data.downBgPicList[this.data.type][this.data.postBgIndex]) {
        this.getFinalImg();
      } else {
        this.downLoadPic(this.data.postBgPicList[this.data.type][this.data.postBgIndex],`downBgPicList[${this.data.type}][${this.data.postBgIndex}]`,'',`bg_${this.data.postBgIndex}`).then(res => {
          console.log(res,'下载完成');
          this.getFinalImg();
        });
      }
    },
    // 生成一张图片
    getFinalImg () {
      this.setData({
        postBgImg: this.data.downBgPicList[this.data.type][this.data.postBgIndex]
      });
      this.createdBgCanvas();
    },
    // 长按保存图片
    savePostImg (e) {
      let url = e.currentTarget.dataset.url;
      wx.saveImageToPhotosAlbum({
        filePath: url,
        success: (res) => { 
          console.log(res, 'res');
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          });
        },
        fail: (err) => {
          console.log(err, 'err');
          if (err.errMsg === 'saveImageToPhotosAlbum:fail:auth denied' || err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
            // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
            wx.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              showCancel: false,
              success: () => {
                wx.openSetting({
                  success(settingdata) {
                    console.log('settingdata', settingdata);
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限成功,再次点击图片即可保存',
                        showCancel: false,
                      });
                    } else {
                      wx.showModal({
                        title: '提示',
                        content: '获取权限失败，将无法保存到相册哦~',
                        showCancel: false,
                      });
                    }
                  },
                  fail(failData) {
                    console.log('failData',failData);
                  },
                  complete(finishData) {
                    console.log('finishData', finishData);
                  }
                });
              }
            });
          }
        }
      });
    },
    // 获取设备信息
    getWindowInfo () {
      wx.getSystemInfo({
        success: res => {
          this.setData({
            windowWidth: res.windowWidth,
            windowHeight: res.windowHeight
          });
          this.setData({
            ratio: (750 / this.data.windowWidth).toFixed(2)
          });
          this.getPosterInfo();
        }
      });
    },
    // 获取头像
    getPosterInfo () {
      this.setData({
        bgImg: ''
      });
      wx.showLoading({
        title: '海报生成中',
        mask: false
      });
      this.getInviteCode().then(() => {
        console.log(this.data.codeImg);
        this.setData({
          userName: wx.getStorageSync('userinfo').wx_nick_name || '未知用户',
          headPic: wx.getStorageSync('userinfo').pic || '../../images/default_head.png' 
        });
        // 提前下载所有网络图片
        let that = this;
        Promise.all([
          that.downLoadPic(that.data.headPic,'headPic','/images/default_head.png',1),
          that.downLoadPic(that.data.codeImg,'codeImg','',2),
          that.downLoadPic(that.data.postBgPicList[that.data.type][that.data.postBgIndex],`downBgPicList[${that.data.type}][${that.data.postBgIndex}]`,'',`bg_${that.data.type}_${that.data.postBgIndex}`)
        ]).then(res => {
          console.log(res,'全部下载完成');
          that.getFinalImg();
        });
      });
    },
    // 下载网络图片
    downLoadPic (url, data, defaultPic, val) {
      let that = this;
      return new Promise((resolve) => {
        wx.downloadFile({
          url: url,
          success: res => {
            if(res.statusCode === 200){
              that.setData({
                [data] : res.tempFilePath
              });
              resolve(val);
            }
          },
          fail: () => {
            that.setData({
              [data]: defaultPic || null 
            });
            // wx.showToast({
            //   title: '网路错误，请稍后再试',
            //   icon: 'none'
            // });
            console.log('单个图片失败',val,url);
            resolve(val);
          }
        });
      });
      
    }
  }

});