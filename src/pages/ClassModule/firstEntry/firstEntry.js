Page({
  data: {
    mode: 0, // 0家园通
    allData: [
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589600737560.0845wjyt_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589601221176.226wjyt_mid.jpg',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589600952503.6394wjyt_bt.jpg',
        'textList': [
          '班级通知、班级相册、学习圈...',
          '你想要的都在这里！'
        ],
        'subtitle': '沃家园通—实现家园美好共育！',
        'color': '#107e7d'
      },
    ],
  },
  // 选择身份
  choiseRole (e) {
    let role = +e.currentTarget.dataset.role;
    if (role === 1) {
      wx.navigateTo({
        url: '/pages/ClassModule/editClassInfo/editClassInfo?mode=2',
      });
    } else if (role === 2) {
      wx.navigateTo({
        url: '/pages/ClassModule/editRoleInfo/editRoleInfo?mode=3&role=2'
      });
    }
  },
  // 下次再选
  choiseNext () {
    wx.reLaunch({
      url: '/pages/index/index?next=true'
    });
  },
  onLoad() {

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
    // Do something when page close.
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
