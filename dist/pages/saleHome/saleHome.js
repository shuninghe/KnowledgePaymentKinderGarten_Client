const { saleHomeStatis } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    saleHome: {
      level_name: '园长'
    }, // 首页数据
    showMask: false
  },
  onLoad(options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...'
    });
  },
  // 获取首页数据
  getHomeData () {
    ajax(saleHomeStatis, {failToast: false}).then(res=>{
      if (res.code === 0) {
        wx.hideLoading();
        this.setData({
          saleHome: res.data
        });
        wx.setStorageSync('saleManInfo', res.data);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        mask: true,
        duration: 2000,
        success: ()=>{
          wx.removeStorageSync('__saleToken__');
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            });
          }, 2000);
        },
      });
    });
  },
  // 
  showMask() {
    this.setData({
      showMask: !this.data.showMask
    });
  },
  // 跳转提现页面
  goCash() {
    wx.navigateTo({
      url: '/pages/cashOut/cashOut',
    });
  },
  // 跳转页面
  goJump(e) {
    if(e.currentTarget.dataset.type - 0 === 1) {
      wx.navigateTo({
        url: '/pages/myInvite/myInvite',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 2) {
      wx.navigateTo({
        url: '/pages/tradeDetail/tradeDetail',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 3) {
      wx.navigateTo({
        url: `/pages/shareCodePost/shareCodePost?level_name=${this.data.saleHome.level_name}`,
      });
    }
    if(e.currentTarget.dataset.type - 0 === 4) {
      wx.navigateTo({
        url: '/pages/myBankCard/myBankCard',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 5) {
      wx.navigateTo({
        url: '/pages/saleLogin/saleLogin?mode=3',
      });
    }
  },
  onReady() {
  },
  onShow() {
    this.getHomeData();   
  },
  onHide() {
  },
  onUnload() {
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
    