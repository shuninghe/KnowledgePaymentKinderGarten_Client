const { getBonusHome } = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
const { commonShare } = require('../../../utils/common.js');
Page({
  data: {
    saleHome: {}, // 首页数据
    showMask: false,
    showModal: false, // 规则弹框
  },
  onLoad(options) {
    console.log(options);
  },
  // 获取首页数据
  getHomeData () {
    wx.showLoading({
      title: '加载中...'
    });
    ajax(getBonusHome, {failToast: false}).then(res=>{
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
      url: '/pages/Scholarship/cashOut/cashOut',
    });
  },
  // 跳转页面
  goJump(e) {
    if(e.currentTarget.dataset.type - 0 === 1) {
      wx.navigateTo({
        url: '/pages/Scholarship/myInvite/myInvite',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 2) {
      wx.navigateTo({
        url: '/pages/Scholarship/tradeDetail/tradeDetail',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 3) {
      wx.navigateTo({
        url: '/pages/Scholarship/shareCodePost/shareCodePost',
      });
    }
    if(e.currentTarget.dataset.type - 0 === 4) {
      wx.navigateTo({
        url: '/pages/Scholarship/myBankCard/myBankCard',
      });
    }
  },
  // 规则
  toRule () {
    this.setData({
      showModal: true
    });
  },
  // 关闭规则弹框
  closeMask() {
    this.setData({
      showModal: false
    });
  },
  // 阻止规则冒泡点击
  stopClick:function(){
    return false;
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
  onShareAppMessage() {
    return commonShare(
      '',
      `/${getApp().globalData.homePageUrl}`,
      '',
      true
    );
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
    