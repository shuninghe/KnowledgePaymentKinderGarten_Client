const QR = require('../../utils/qrcode.js');
const { canvasDrawText } = require('../../utils/common');
const { postShareData, saveShareData } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { coursePosterBg } = require('../../utils/images');

Component({

  behaviors: [],

  properties: {
    postBgIndex: { // 海报背景图index
      type: Number,
      value: 0
    },
    activityId: {
      type: Number,
      value: 0
    },
    activityType: {
      type: Number,
      value: 0
    }
  },
  data: {
    log: null,
    courseId: null,
    isHelp: null,
    pic: '',
    name: '',
    windowWidth: null, // 物理宽度
    windowHeight: null, // 物理高度
    ratio: null,  // 相对比例
    bgImg: '', // 生成的背景图片
    headPic: '', // 头像
    userName: '', // 昵称或真实姓名
    postBgPicList: coursePosterBg,
    downBgPicList: [],
    postBgImg: '',
  },

  // 生命周期函数
  created() {

  },
  attached() {
    this.setData({
      log: new Date().getTime() + '' + Math.floor(Math.random()*10000),
      courseId: wx.getStorageSync('postData').course_id,
      isHelp: wx.getStorageSync('postData').isHelp,
      pic: wx.getStorageSync('postData').pic,
      name: wx.getStorageSync('postData').name,
    });
    this.getWindowInfo();
    this.postShareData();
    console.log(this.data, 'data');
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 提交分享数据
    postShareData () {
      let params = {
        id: this.data.log, // 分享记录编号，时间戳+4位随机数
        data: {
          course_id: this.data.courseId,
          isHelp: this.data.isHelp
        }
      };
      ajax(postShareData, {data: params, method: 'post'}).then(res => {
        if (res.code === 0) {
          console.log('提交分享数据');
        }
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
      // 画头像边框
      ctx.beginPath();
      ctx.arc(
        259 / this.data.ratio, 
        166 / this.data.ratio, 
        32 / this.data.ratio, 
        0, 
        2 * Math.PI
      );
      ctx.setFillStyle('#fff');
      ctx.fill();
      ctx.restore();
      // 画头像
      ctx.beginPath();
      ctx.save();
      ctx.arc(
        259 / this.data.ratio, 
        166 / this.data.ratio, 
        28 / this.data.ratio, 
        0, 
        2 * Math.PI
      );
      ctx.clip();
      ctx.drawImage(
        this.data.headPic,
        231 / this.data.ratio,
        138 / this.data.ratio,
        56 / this.data.ratio,
        56 / this.data.ratio
      );
      ctx.closePath();
      ctx.restore();
      // 昵称 
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 228 / this.data.ratio,
        color: this.data.postBgIndex === 2 ? '#fff' : '#333',
        size: 22 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: `${this.data.userName}`,
        bold: 0
      });
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 256 / this.data.ratio,
        color: this.data.postBgIndex === 2 ? '#fff' : '#333',
        size: 18 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: '邀你一起学以下课程',
        bold: 0
      });
      // 课程名称
      // ctx.setFontSize(32 / this.data.ratio);
      // canvasTextAutoLine(
      //   this.data.name, 
      //   ctx, 
      //   canvasWidthPx,
      //   312 / this.data.ratio, 
      //   348 / this.data.ratio, 
      //   36 / this.data.ratio, 
      //   32 / this.data.ratio, 
      //   this.data.postBgIndex === 2 ? '#fff' : '#333', 
      //   1,
      //   true
      // ); 
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 312 / this.data.ratio,
        color: this.data.postBgIndex === 2 ? '#fff' : '#333',
        size: 32 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: this.data.name,
        bold: 0
      });
      // 扫码文本
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 616 / this.data.ratio,
        color: this.data.postBgIndex === 2 ? '#fff' : '#333',
        size: 20 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: '扫码查看此课程',
        bold: 0
      });
      canvasDrawText(ctx, {
        x: canvasWidthPx / 2,
        y: 785 / this.data.ratio,
        color: this.data.postBgIndex === 2 ? '#fff' : '#333',
        size: 20 / this.data.ratio,
        align: 'center',
        baseline: 'middle',
        text: `微信搜索“ ${getApp().globalData.appName} ”小程序查看更多`,
        bold: 0
      });
      // 课程图片
      ctx.save();
      ctx.drawImage(
        this.data.pic,
        86 / this.data.ratio,
        342 / this.data.ratio,
        348 / this.data.ratio,
        236 / this.data.ratio
      );
      ctx.restore();
      let obj = {};  
      if (this.data.activityId) {
        obj = {
          activityType: this.data.activityType,
          activityId: this.data.activityId,
          id: this.data.courseId
        };
      } else {
        obj = {
          id: this.data.courseId
        };
      }
      let logId = wx.getStorageSync('shareLogId');
      let path;
      this.getShortUrl(obj).then((res) => {
        let url = `/pages/courseDetail/courseDetail?qrId=${res}&log=${this.data.log}`;
        path = `${getApp().globalData.shareUrl}?logId=${logId}&realUrl=${encodeURIComponent(url)}`;
        console.log('分享地址',path);
        QR.api.draw(
          path, 
          ctx, 
          110 / this.data.ratio,
          110 / this.data.ratio, 
          this, 
          false,
          204 / this.data.ratio,
          640 / this.data.ratio 
        );
        // ctx.save();
        // ctx.drawImage(
        //   this.drawQRCode(path, true),
        //   204 / this.data.ratio,
        //   630 / this.data.ratio,
        //   110 / this.data.ratio,
        //   110 / this.data.ratio
        // );
        // ctx.restore();
        // console.log(this.drawQRCode(path, true))
        this.drawAgain(ctx, new Date().getTime());
      });
    },
    getShortUrl(obj) {
      return new Promise((resolve, reject) => {
        let params = {
          info: obj
        };
        ajax(saveShareData, { data: params, method: 'POST',failToast: false }).then(res => {
          if (res.code === 0) {
            resolve(res.data.id);
          }
        }).catch(() => {
          reject();
        });
      });
      
    },
    drawAgain (ctx, time) {
      let now_time = new Date().getTime();
      if (now_time - time > 1000 * 20) {
        wx.showToast({
          title: '网络错误，请稍后再试吧',
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
      if (this.data.downBgPicList[this.data.postBgIndex]) {
        this.getFinalImg();
      } else {
        this.downLoadPic(this.data.postBgPicList[this.data.postBgIndex],`downBgPicList[${this.data.postBgIndex}]`,'',`bg_${this.data.postBgIndex}`).then(res => {
          console.log(res,'下载完成');
          this.getFinalImg();
        });
      }
    },
    // 生成一张图片
    getFinalImg () {
      this.setData({
        postBgImg: this.data.downBgPicList[this.data.postBgIndex]
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
      wx.showLoading({
        title: '海报生成中',
        mask: false
      });
      this.setData({
        userName: wx.getStorageSync('userinfo').wx_nick_name || '未知用户',
        headPic: wx.getStorageSync('userinfo').pic || '../../images/default_head.png' 
      });
      // 提前下载所有网络图片
      let that = this;
      Promise.all([
        that.downLoadPic(that.data.headPic,'headPic','../../images/default_head.png',1),
        that.downLoadPic(that.data.pic,'pic','',2),
        that.downLoadPic(that.data.postBgPicList[that.data.postBgIndex],`downBgPicList[${that.data.postBgIndex}]`,'',`bg_${that.data.postBgIndex}`)
      ]).then(res => {
        console.log(res,'全部下载完成');
        that.getFinalImg();
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