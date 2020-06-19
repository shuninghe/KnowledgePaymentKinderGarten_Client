// 全局app实例
const { getBankCardList, delBankCard } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    choiceBankDetail: {},
    cardList:[], // 银行卡列表
    showDelBtn: false // 是否显示删除按钮
  },
  // 获取用户银行卡列表
  getBankCardList () {
    ajax(getBankCardList, {}).then(res=>{
      if (res.code === 0) {
        this.setData({
          cardList: res.data.list
        });
      }
    });
  },
  // 显示删除按钮
  showDeleteBtn () {
    this.setData({
      showDelBtn: !this.data.showDelBtn
    });
  },
  // 删除银行卡
  delBankCard (event) {
    let data = {
      id: event.currentTarget.dataset.id // 银行卡id
    };
    ajax(delBankCard, {data, method: 'DELETE'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    });
    this.getBankCardList();
  },
  // 跳转添加银行卡页面
  toBundleBankCard () {
    wx.navigateTo({
      url: '/pages/bundleBankCard/bundleBankCard'
    });
  },
  onLoad() {

  },
  onReady() {
  },
  onShow() {
    this.setData({
      showDelBtn: false
    });
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
