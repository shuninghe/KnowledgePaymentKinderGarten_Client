
const { commonShare } = require('../../utils/common.js');
const { codePosterView } = require('../../utils/images');

Page({
  data: {
    styleImg: codePosterView,
    type: 0,
    selectedIndex: 0,
    level_name: ''
  },
  changeType (e) {
    let type = +e.currentTarget.dataset.type;
    if (type === this.data.type) return;
    this.setData({
      type: type,
      selectedIndex: 0
    });
    this.selectComponent('#codePoster').getPosterInfo();
  },
  changeStyle (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
    this.selectComponent('#codePoster').changeBgImg();
  },
  onLoad() {
    // if (options.level_name === '业务员') {
    //   this.setData({
    //     level_name: options.level_name,
    //     type: 1
    //   });
    // } 
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
    wx.removeStorageSync('codeLogId');
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage() {
    let pid = wx.getStorageSync('functionConfig').packageId;
    let logId = wx.getStorageSync('codeLogId');
    let shareImg1 = 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193267370.3545xj_share.jpg';
    let shareImg2 = 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193272906.1018yz_share.jpg';
    return commonShare(
      this.data.type ? '欢迎入驻沃家园通，解决园所现实难题' : '欢迎加盟沃家园通，合作共赢、轻松赚钱',
      `/pages/saleEntrance/saleEntrance?type=${this.data.type+1}&pid=${pid}&log_id=${logId}`,
      this.data.type ? shareImg2 : shareImg1,
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
