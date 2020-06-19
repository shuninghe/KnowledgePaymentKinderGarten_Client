const { getActivityGood } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { jiGouHomeIcon } = require('../../../utils/util');

Page({
  data: {
    jiGouHomeIcon: jiGouHomeIcon,
    pintuan: [],
    miaosha: [],
    zhulike: []
  },
  // 获取营销活动课程
  getActivityGood (type) {
    return new Promise((resolve, reject) => {
      ajax(getActivityGood, {
        data: {
          // ids: [int],                     //【可选】商品编号
          type: type                      //【可选】活动类型，如果没有ids的时候必填
        },
        method: 'POST'
      }).then(res => {
        if (res.code === 0) {
          let arr = [];
          for (let k in res.data) {
            let item = res.data[k];
            item.id = k;
            arr.push(item);
          }
          type === 1 && this.setData({ pintuan: arr });
          type === 2 && this.setData({ miaosha: arr });
          type === 3 && this.setData({ zhulike: arr });   
          resolve();
        } else {
          reject();
        }
      }).catch(err => {
        reject(err);
      });
    });
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    Promise.all([
      this.getActivityGood(1),
      this.getActivityGood(2),
      this.getActivityGood(3)
    ]).then(() => {
      wx.hideLoading();
    });
    let shopInfo = wx.getStorageSync('shopInfo');
    this.setData({
      phone: shopInfo.phone,
      weiXin: shopInfo.wx_mark,
      bottom: getApp().globalData.isIphoneX?'68rpx':''
    });
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
    // Do something when page close.
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  // onShareAppMessage() {
  //   // return custom share data when user share.
  // },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
