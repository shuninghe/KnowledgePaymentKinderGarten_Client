const sdk = require('./utils/sdk.js'); // eslint-disable-line
const appConfig = require('./app.config.js');

App({
  onLaunch() {
    Object.assign(this.globalData, appConfig); 

    // 获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    let _this = this;
    wx.getSystemInfo({
      success: (res) => {
        if (res.system.indexOf('iOS') > -1) {
          wx.setStorageSync('isIOS', true);
        } else {
          wx.setStorageSync('isIOS', false);
        }
        this.globalData.statusBarHeight = res.statusBarHeight;
        // 微信小程序 iPhone 11、iPhoneX 底部安全区域（底部小黑条）适配
        let iphoneArr = ['iPhone X', 'iPhone 11', 'iPhone 11 Pro Max'];
        iphoneArr.forEach(function (item) {
          if (res.model.search(item) != -1) {
            _this.globalData.isIphoneX = true;
          }
        });  
      }
    });

    // 更新版本提示
    const updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    }); 
    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
      wx.showToast({
        title: '新版本下载失败，请删除旧版本后重试',
        icon: 'none'
      });
    });
  },

  onShow() {
    
  },
  
  onHide() {
    // Do something when hide.
  },
  onError() {
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  },
  onPageNotFound() {
    // 当要打开的页面并不存在时，会回调这个监听器
  },
  globalData: {
    statusBarHeight: null,
  }
});
