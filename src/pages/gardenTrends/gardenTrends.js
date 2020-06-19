// 全局app实例
const { getDynamicList, userinfo} = require('../../api.config.js');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    list: [], // 活动列表
  },
  handleDetail(e) {
    if (+e.currentTarget.dataset.type === 2) {
      wx.navigateTo({
        url: `../outHtml/outHtml?url=${e.currentTarget.dataset.content}`
      });
    } else {

      wx.navigateTo({
        url: `../dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}&type=2&gardenId=${this.data.gardenId}`
      });
    }
  },
  // 获取园所活动列表
  getDynamicList() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    const data = {
      id: this.data.gardenId,
      type: 2
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
          icon: 'none',
          duration: 1500
        });
      }
    }).catch(rep => {
      wx.hideLoading();
      wx.showToast({
        title: rep.msg,
        icon: 'none',
        duration: 1500
      });
    });
  },
  // 获取个人信息
  getUserInfo() {
    return new Promise((resolve,reject) => {
      ajax(userinfo, {}).then(res => {
        if (res.code === 0) {
          if (res.data.is_liable === 1) {
            this.setData({
              gardenId: res.data.liable_kindergarten
            });
            resolve();
          } else {
            this.setData({
              gardenId: res.data.kindergarten_id
            });
            resolve();
          }
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
        reject();
      });
    });
  },
  onLoad(options) {
    this.setData({
      gardenId: +options.gardenId,
      name: wx.getStorageSync('gardenName')
    });
    wx.setNavigationBarTitle({
      title: this.data.type_name + '动态'
    });
    this.getDynamicList();
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
