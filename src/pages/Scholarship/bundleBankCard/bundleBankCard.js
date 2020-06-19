// 全局app实例
const { getOpenBank, postBonusSaveBankCard } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    userName: '', // 用户名
    bankNumber: '', // 银行卡号
    openBankName: '', // 开户行名字
    openAccount: '', // 开户网点
    openBankDetail: {}, // 开户行详情
    disabled: true     // 绑定按钮禁用状态
  },
  // input输入
  inputText (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    });
    console.log(name + this.data[name]);
    this.activeButton();
  },
  // 按钮
  activeButton () {
    let {userName, bankNumber, openBankName, openAccount } = this.data;
    this.setData({
      disabled: !(userName && bankNumber && bankNumber.length>=16  && openBankName && openAccount)
    });
  },
  // 获取开户行
  openBank () {
    let params = {
      card: this.data.bankNumber
    };
    ajax(getOpenBank, {data:params, methods:'GET', falseToast: false}).then(res => {
      if (res.code === 0) {
        this.setData({
          openBankDetail: res.data,
          openBankName: res.data.name
        });
        this.activeButton();
      }
    }).catch(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
    });
  },
  // 保存银行卡
  saveBankCard () {
    let { bankNumber, openAccount } = this.data;
    let { name, bank, logoUrl } = this.data.openBankDetail;
    if (!(bankNumber && openAccount && name && bank && logoUrl)) {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 1500
      });
      return;
    } 
    let params = {
      name: this.data.openBankDetail.name,
      bank: this.data.openBankDetail.bank,
      card: this.data.bankNumber,
      logoUrl: this.data.openBankDetail.logoUrl,
      openBank: this.data.openAccount
    };
    ajax(postBonusSaveBankCard, {data: params, method: 'POST'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          duration: 1500
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
      } else {
        wx.showToast({
          title: '绑定失败',
          icon: 'none'
        });
      }
    }).catch(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
    });
  },
  onLoad() {
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
