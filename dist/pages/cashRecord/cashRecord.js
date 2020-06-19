// var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const { cashRecord } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { formatTimeTwo } = require('../../utils/common');
Page({
  data: {
    cashList: [] // 提现记录
  },
  onLoad(options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...'
    });
    this.getCashRecord();
  },
  // 获取提现记录
  getCashRecord() {
    ajax(cashRecord, {failToast: false}).then(res=>{
      if (res.code === 0) {
        let data = res.data.list;
        data.forEach(item => {
          item.money = (item.money / 100).toFixed(2);
          item.date = formatTimeTwo(+item.date,'M.D h:m');
        });
        this.setData({
          cashList: data
        });
        wx.hideLoading();
      }
    });
  },
  // 跳转提现详情
  goApplyDetail(e) {
    let id = +e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/withdrawDetail/withdrawDetail?id=${id}`,
    });
  },
  onReady() {
  },
  onShow() {

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
