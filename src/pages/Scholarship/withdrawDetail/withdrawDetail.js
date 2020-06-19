// 全局app实例
const { getBonusWithdrawDetails } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { dealPrice, formatTimeTwo } = require('../../../utils/common');
Page({
  data: {
    withdrawDetail: {} // 提现详情
  },
  // 获取提现详情
  getBonusWithdrawDetails (id) {
    let data = {
      client_id: getApp().globalData.client_id, //客户端唯一编号
      id: id // 提现id，前一页传过来的
    };
    ajax(getBonusWithdrawDetails, {data: data}).then(res=>{
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
    this.getBonusWithdrawDetails(+options.id);
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
