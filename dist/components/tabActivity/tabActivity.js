const { getActivityGood } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { jiGouHomeIcon } = require('../../utils/images');

Component({

  behaviors: [],

  properties: {},
  data: {
    jiGouHomeIcon: jiGouHomeIcon,
    pintuan: [],
    miaosha: [],
    zhulike: []
  },
  
  // 生命周期函数
  created() {},
  attached() {
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
  ready() {},
  moved() {},
  detached() {},

  methods: {
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
    }
  }

});