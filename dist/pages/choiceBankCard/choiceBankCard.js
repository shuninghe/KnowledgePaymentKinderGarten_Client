// 全局app实例
const { getBankCardList } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    cardId: null, // 银行卡id
    cardList:[]  // 银行卡列表
  },
  // 获取用户银行卡列表
  getBankCardList () {
    ajax(getBankCardList, {data: {}, methods: 'GET'}).then(res=>{
      if (res.code === 0) {
        this.setData({
          cardList: res.data.list
        });
      }
    });
  },
  // 选择银行卡
  choiceBank (e) {
    this.setData({
      cardId: e.currentTarget.dataset.item.id
    });
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];  //上一个页面栈
    prevPage.setData({ // 上一个页面在onshow里接收
      cashInfo: e.currentTarget.dataset.item // 所选择银行卡的详情
    });
  },
  // 跳转绑定银行卡页面
  toBundleBankCard () {
    wx.navigateTo({
      url: '/pages/bundleBankCard/bundleBankCard'
    });
  },
  onLoad(options) {
    this.setData({
      cardId: +options.cardId
    });
  },
  onReady() {
  },
  onShow() {
    this.getBankCardList();
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
