// 全局app实例
const { getBonusBankCardList, delBonusBankCardList } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    choiceBankDetail: {},
    cardList:[
    //   {
    //     id: 1,
    //     name: '中国建行',
    //     bank: '建行',
    //     card: '23874682376482634',
    //     logoUrl: 'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1040517460,1190879422&fm=26&gp=0.jpg'
    //   }
    ], // 银行卡列表
    showDelBtn: false // 是否显示删除按钮
  },
  // 获取用户银行卡列表
  getBonusBankCardList () {
    const data = {
      client_id: getApp().globalData.client_id //客户端唯一编号
    };
    ajax(getBonusBankCardList, {data}).then(res=>{
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
  delBonusBankCardList (event) {
    let data = {
      client_id: getApp().globalData.client_id, //客户端唯一编号
      id: event.currentTarget.dataset.id // 银行卡id
    };
    ajax(delBonusBankCardList, {data, method: 'DELETE'}).then(res => {
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
    this.getBonusBankCardList();
  },
  // 跳转添加银行卡页面
  toBundleBankCard () {
    wx.navigateTo({
      url: '/pages/Scholarship/bundleBankCard/bundleBankCard'
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
    this.getBonusBankCardList();
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
