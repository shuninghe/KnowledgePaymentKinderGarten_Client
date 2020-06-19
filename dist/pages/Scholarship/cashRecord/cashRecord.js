const { getBonusList } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { formatTimeTwo } = require('../../../utils/common');
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
    // let data = [
    //   {
    //     id:1,         // 提现记录id
    //     money:9000,      // 提现金额
    //     date:1585213919000,       // 提现时间
    //     status: 0,    // 0 提现失败 1审核中 2提现成功
    //   },{
    //     id:2,         // 提现记录id
    //     money:7500,      // 提现金额
    //     date:1585213919000,       // 提现时间
    //     status: 1,    // 0 提现失败 1审核中 2提现成功
    //   },{
    //     id:3,         // 提现记录id
    //     money:9000,      // 提现金额
    //     date:1585213919000,       // 提现时间
    //     status: 2,    // 0 提现失败 1审核中 2提现成功
    //   }
    // ];
    // data.forEach(item => {
    //   item.money = (item.money / 100).toFixed(2);
    //   item.date = formatTimeTwo(+item.date,'M.D h:m');
    // });
    // this.setData({
    //   cashList: data
    // });
  },
  // 获取提现记录
  getCashRecord() {
    ajax(getBonusList, {failToast: false}).then(res=>{
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
      url: `/pages/Scholarship/withdrawDetail/withdrawDetail?id=${id}`,
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
