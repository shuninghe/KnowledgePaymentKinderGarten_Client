// 全局app实例
const { gardenInformation } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');
Page({
  data: {
    activityInfo: [],
    isShowPage: false
  },
  // 获取园所信息
  getGardenInfo() {
    let params = {
      id: this.data.gardenId
    };
    ajax(gardenInformation, {data: params, failToast: false}).then(res => {
      if (res.code === 0) {
        if (res.data.works.length) {
          this.setData({
            isShowPage: true,
            activityInfo: res.data.works,
            name: res.data.name
          });
        }
      } else {
        wx.showToast({
          title: res,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.Msg,
        icon: 'none'
      });
    });
  },
  onLoad(options) {
    this.setData({
      gardenId: +options.gardenId
    });
    this.getGardenInfo();
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
