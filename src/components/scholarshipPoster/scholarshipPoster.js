const { getBonusInviteCode } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { canvasDrawText } = require('../../utils/common.js');
const { commonPosterBg } = require('../../utils/images');

Component({

  behaviors: [],

  properties: {
    mode: Number,
    postBgIndex: { // 海报背景图index
      type: Number,
      value: 0
    },
  },
  data: {
    windowWidth: null, // 物理宽度
    windowHeight: null, // 物理高度
    ratio: null,  // 相对比例
    bgImg: '', // 生成的背景图片
    headPic: '', // 头像
    userName: '', // 昵称或真实姓名
    codeImg: '',
    postBgPicList: commonPosterBg,
    downBgPicList: [[],[]],
    postBgImg: '',
  },

  // 生命周期函数
  created() {

  },
  attached() {
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
        let url = '/pages/index/index';
        let logId = wx.getStorageSync('shareLogId');
        let params = {
          path: `/pages/authorized/authorized?logId=${logId}&realUrl=${encodeURIComponent(url)}`
          // path: '/pages/index/index'     // 二维码跳转页面
        };
        ajax(getBonusInviteCode, {data: params, method: 'post'}).then(res => {
          if (res.code === 0) {
            this.setData({
              codeImg: res.data.pic
            });
            resolve();
          }
        }).catch(res => {
          console.log(res.msg);
        });
      });
    },
    // 绘制海报
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
      // 标题
      canvasDrawText(ctx, {
        x: 42 / this.data.ratio,
        y: 686 / this.data.ratio,
        color: '#333333',
        size: 24 / this.data.ratio,
        align: 'left',
        baseline: 'top',
        text: '沃家园通，实现家园美好共育！',
        bold: 0.1 / this.data.ratio
      });
      // 画头像
      ctx.beginPath();
      ctx.save();
      ctx.arc( 
        74 / this.data.ratio,
        812 / this.data.ratio, 
        40 / this.data.ratio, 
        0, 
        2 * Math.PI
      );
      ctx.clip();
      ctx.drawImage( 
        this.data.headPic,
        34 / this.data.ratio,
        772 / this.data.ratio, 
        80 / this.data.ratio,
        80 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      // 昵称 
      let newName = this.data.userName;
      let nameLength = ctx.measureText(newName).width;
      console.log(nameLength);
      if (nameLength > 60) {
        newName = newName.substring(0, newName.length - 2) + '...';
        console.log(newName);
      }
      canvasDrawText(ctx, {
        x: 138 / this.data.ratio,
        y: 786 / this.data.ratio,
        color: '#333333',
        size: 22 / this.data.ratio,
        align: 'left',
        baseline: 'top',
        text: 'Hi, 我是' + newName,
        bold: 0.05 / this.data.ratio
      });
      // 文案
      ctx.setFontSize(18 / this.data.ratio);
      ctx.setFillStyle('#333');
      ctx.fillText(
        '我为沃家园通代言！',
        138 / this.data.ratio,
        820 / this.data.ratio
      );
      // 画小程序码
      ctx.drawImage( 
        this.data.codeImg,
        350 / this.data.ratio,
        744 / this.data.ratio,
        136 / this.data.ratio,
        136 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      this.drawAgain(ctx, new Date().getTime());
    },
    // 绘制海报
    createdBgCanvas2 () {
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
        260 / this.data.ratio,
        394 / this.data.ratio, 
        40 / this.data.ratio, 
        0, 
        2 * Math.PI
      );
      ctx.clip();
      ctx.drawImage( 
        this.data.headPic,
        220 / this.data.ratio,
        354 / this.data.ratio, 
        80 / this.data.ratio,
        80 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      // 昵称 
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 460 / this.data.ratio,
        color: '#2c2c2c',
        size: 14 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: `我是${this.data.userName}`,
        bold: 0
      });
      let shopName = wx.getStorageSync('shopInfo').abbreviation || wx.getStorageSync('shopInfo').name || getApp().globalData.appName;
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 490 / this.data.ratio,
        color: '#292929',
        size: 18 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: `我为${shopName}代言!`,
        bold: 0.1 / this.data.ratio
      });
      // 画小程序码
      ctx.drawImage( 
        this.data.codeImg,
        190/ this.data.ratio,
        528 / this.data.ratio,
        138 / this.data.ratio,
        138 / this.data.ratio
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
      if (this.data.downBgPicList[this.data.mode][this.data.postBgIndex]) {
        this.getFinalImg();
      } else {
        this.downLoadPic(this.data.postBgPicList[this.data.mode][this.data.postBgIndex],`downBgPicList[${this.data.mode}][${this.data.postBgIndex}]`,'',`bg_${this.data.postBgIndex}`).then(res => {
          console.log(res,'下载完成');
          this.getFinalImg();
        });
      }
    },
    // 生成一张图片
    getFinalImg () {
      console.log(this.data);
      this.setData({
        postBgImg: this.data.downBgPicList[this.data.mode][this.data.postBgIndex]
      });
      if (this.data.mode === 1) {
        this.createdBgCanvas2();
      } else {
        this.createdBgCanvas();
      }
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
        },
        fail: err => {
          console.log(err);
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
        this.setData({
          userName: this.getByteLen(wx.getStorageSync('userinfo').wx_nick_name || '未知用户'),
          headPic: wx.getStorageSync('userinfo').pic
        });
        // 提前下载所有网络图片
        let that = this;
        let { postBgPicList, mode, postBgIndex } = this.data;
        Promise.all([
          that.downLoadPic(that.data.headPic,'headPic','../../images/default_head.png',1),
          that.downLoadPic(that.data.codeImg,'codeImg','',2), 
          that.downLoadPic(postBgPicList[mode][postBgIndex],`downBgPicList[${mode}][${postBgIndex}]`,'',`bg_${postBgIndex}`)
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
      
    },
    // 截取一定字符长度的字符串
    getByteLen (str) {  
      var len = 0;  
      for (var i=0; i<str.length; i++) {
        let reg = /[\u4e00-\u9fa5]/;
        let flag = reg.test(str[i]);
        if (flag) {
          len = len + 2;
        } else {
          len++;
        }
        if (len > 10) {
          return str.substring(0, i)+'...';
        } else {
          return str;
        }
      }  
    }
  }

});