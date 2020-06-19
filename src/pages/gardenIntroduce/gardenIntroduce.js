const { gardenInformation } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    imgUrls: [], //轮播图片
    intro: '', // 简介
    name: '', // 园所名称
    isShowPage: false
  },
  // 获取园所信息
  getGardenInfo() {
    this.setData({
      isEdit: true
    });
    let params = {
      id: this.data.gardenId
    };
    ajax(gardenInformation, {data: params, method:'GET',failToast: false}).then(res => {
      if (res.code === 0) {
        if (res.data.pics.length || res.data.intro.length) {
          this.setData({
            isShowPage: true
          });
        }
        let str = this.replaceTxt(res.data.intro);
        this.setData({
          imgUrls: res.data.pics,
          intro: str,
          name: res.data.name
        });
      } else {
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 1500
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.Msg,
        icon: 'none',
        duration: 1500
      });
    });
  },
  replaceTxt(str) {
    str = str.replace(/\u0020/g,'&emsp;');
    return str;
  },
  onLoad(options) {
    this.setData({
      gardenId: +options.gardenId
    });
    wx.setNavigationBarTitle({
      title: this.data.type_name + '介绍'
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
