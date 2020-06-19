Page({
  data: {
    imgs: []
  },
  showPicture () {
    // let animation = wx.createAnimation({
    //   duration: 500,
    //   timingFunction: 'ease-in',
    //   delay: 0
    // });
    // animation.opacity(1).step();
    // this.setData({
    //   animationData: animation.export()
    // });
    wx.hideLoading();
  },
  // 打开图片
  openPhoto(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.imgs // 需要预览的图片http链接列表
    });
  },
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: options.title || '广告'
    });
    this.setData({
      imgs:  wx.getStorageSync('adsPostImgs')
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    });
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
    wx.removeStorageSync('adsPostImgs');
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage() {
    // return custom share data when user share.
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
