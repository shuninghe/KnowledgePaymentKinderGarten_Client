const { commonShare } = require('../../../utils/common.js');
const { userinfo } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { commonPosterView } = require('../../../utils/images');

Page({
  data: {
    mode: 0, // 0奖学金（默认）、1加盟商
    styleImg: commonPosterView,
    selectedIndex: 0,
    showUserPopup: false,
    showPoster: false
  },
  changeStyle (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
    this.selectComponent('#scholarshipPoster').changeBgImg();
  },
  getUserInfo () {
    ajax(userinfo, {failToast: false}).then(res => { 
      if (res.code === 0) {
        wx.setStorageSync('userinfo', res.data);
        this.setData({
          showUserPopup: false,
          showPoster: true
        });
      }
    });
  },
  returnLast () {
    wx.navigateBack({
      delta: 1
    });
  },
  onLoad(options) {
    this.setData({
      mode: +options.mode || 0
    });
    if (JSON.stringify(wx.getStorageSync('userinfo'))==='{}' || !wx.getStorageSync('userinfo').wx_nick_name) {
      this.setData({
        showUserPopup: true
      });
    } else {
      this.setData({
        showPoster: true
      });
    }
  },

  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage() {
    let title;
    this.data.mode === 0 && (title = '这里的亲子游戏真不错！');
    this.data.mode === 1 && (title = '一起遨游知识的海洋');
    return commonShare(
      title,
      '',
      getApp().globalData.sharePic,
      true
    );
    
    
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
