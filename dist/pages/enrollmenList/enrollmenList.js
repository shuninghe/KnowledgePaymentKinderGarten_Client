const { getDynamicList } = require('../../api.config.js');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    list: [], // 信息列表
  },
  // 跳转到详情
  handleDetail (e) {
    if (+e.currentTarget.dataset.type === 2) {
      wx.navigateTo({
        url: `../outHtml/outHtml?url=${e.currentTarget.dataset.content}`
      });
    } else {
      wx.navigateTo({
        url: `../dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}&type=1&gardenId=${this.data.gardenId}`
      });
    }
  },
  // 获取列表
  getEnrollmenList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    const data = {
      id: this.data.gardenId,
      type: 1
    };
    ajax(getDynamicList, {data}).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        if (res.data.dynamics.length) {
          this.setData({
            list: res.data.dynamics
          });
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.hideLoading();
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  onLoad(options) {
    this.setData({
      gardenId: +options.gardenId,
      name: wx.getStorageSync('gardenName')
    });
    this.getEnrollmenList();
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
  onShareAppMessage() {
    return commonShare(
      this.data.name,
      `/pages/kindergarten/kindergarten?id=${this.data.gardenId}&from=2`,
      '',
      true
    );
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
