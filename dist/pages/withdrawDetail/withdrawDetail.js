// 全局app实例
const { getWithdrawDetail } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { dealPrice, formatTimeTwo } = require('../../utils/common');
Page({
  data: {
    withdrawDetail: {} // 提现详情
  },
  // 获取提现详情
  getWithdrawDetail (id) {
    let data = {
      id: id // 提现id，前一页传过来的
    };
    ajax(getWithdrawDetail, {data: data}).then(res=>{
      if (res.code === 0) {
        res.data.money && (res.data.money = dealPrice(res.data.money));
        res.data.date && (res.data.date = formatTimeTwo(+res.data.date,'Y.M.D h:m:s'));
        this.setData({
          withdrawDetail: res.data
        });
      }
    });
  },
  onLoad(options) {
    console.log(options, 'options');
    this.getWithdrawDetail(+options.id);
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
