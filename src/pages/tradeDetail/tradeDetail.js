const { tradeDetail } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { formatTimeTwo } = require('../../utils/common');
Page({
  data: {
    type: 1, // 1全部 2收入 3提现
    tabs: false, // tabs是否显示
    statusBarHeight: getApp().globalData.statusBarHeight + 'px',
    navigationBarHeight: (getApp().globalData.statusBarHeight + 44) + 'px',
    cashList: [],
    fromShare: false,
  },
  onLoad(options) {
    if (getCurrentPages().length >= 2) {
      this.setData({ fromShare: true });
    }
    console.log(options);
    this.getTradeDetail();
  },
  // 显示tabs
  showTabs() {
    this.setData({
      tabs: !this.data.tabs
    });
  },
  // 更改tabs
  changeType(e) {
    this.setData({
      type: e.currentTarget.dataset.type - 0,
      tabs: !this.data.tabs
    });
    this.getTradeDetail();
  },
  // 获取交易明细
  getTradeDetail() {
    wx.showLoading({
      title: '加载中...'
    }); 
    const data = {
      type: this.data.type
    };
    ajax(tradeDetail, {data, method: 'get'}).then(res => {
      if (res.code === 0) {
        let data = res.data.list;
        data.forEach(item => {
          item.money = (item.money / 100).toFixed(2);
          item.date = formatTimeTwo(+item.date,'M.D h:m');
        });
        wx.hideLoading();
        this.setData({
          cashList: data
        });
      }
    });
  },
  // 跳转收益统计页面
  goProgit() {
    wx.navigateTo({
      url: '/pages/profitStatis/profitStatis',
    });
  },
  // 返回
  goBack() {
    wx.navigateBack({ delta: 1 });
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
  