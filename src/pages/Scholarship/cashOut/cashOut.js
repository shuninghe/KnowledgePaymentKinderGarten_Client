const { getBonusWithdrawInfo, applyBonusWithdrawInfo } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    money: null,
    cashInfo: {}, // 当前银行卡信息
    balanceMoney: null, // 可用余额
  },
  onLoad() {

  },
  // 获取提现信息
  getCashInfo() {
    ajax(getBonusWithdrawInfo, {failToast: false}).then(res=>{
      if (res.code === 0) {
        this.setData({
          cashInfo: res.data,
          balanceMoney: res.data.balanceMoney
        });
        wx.hideLoading();
      }
    });
  },
  // 输入金额失去焦点时触发
  bindblurNum: function (e) {
    this.setData({
      money: e.detail.value
    });
  },
  // 全部提现
  allCash(e) {
    this.setData({
      money: +e.currentTarget.dataset.money
    });
  },
  // 提现
  succesCash() {
    if(!this.data.cashInfo.name) {
      wx.showToast({
        title: '请先添加选择银行卡',
        icon: 'none',
      });
      return false;
    }
    if(!this.data.money) {
      wx.showToast({
        title: '请输入提现金额',
        icon: 'none',
      });
      return false;
    }
    if(+this.data.money > +this.data.balanceMoney) {
      wx.showToast({
        title: '当前余额不足',
        icon: 'none',
      });
      return false;
    }
    if(+this.data.money < 1) {
      wx.showToast({
        title: '最少提现金额为1元',
        icon: 'none',
      });
      return false;
    }
    const data = {
      id: this.data.cashInfo.id,
      money: this.data.money * 100
    };
    ajax(applyBonusWithdrawInfo, {data, method: 'post', failToast:false}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '提现成功',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/Scholarship/cashRecord/cashRecord',
          });
        }, 1500);
      }
    }).catch((res) => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
    });
  },
  // 选择银行卡
  selectBank() {
    wx.navigateTo({
      url: `/pages/Scholarship/choiceBankCard/choiceBankCard?cardId=${this.data.cashInfo.id}`,
    });
  },
  // 添加银行卡
  addBank() {
    wx.navigateTo({
      url: '/pages/Scholarship/bundleBankCard/bundleBankCard',
    });
  },
  // 跳转提现记录页面
  goCashRecord() {
    wx.navigateTo({
      url: '/pages/Scholarship/cashRecord/cashRecord',
    });
  },
  onReady() {
  },
  onShow() {
    wx.showLoading({
      title: '加载中...'
    }); 
    this.getCashInfo(); 
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
  