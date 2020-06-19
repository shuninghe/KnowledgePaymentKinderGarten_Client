const { gardenInformation } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    latitude: 39.85831, // 纬度
    longitude: 116.29272, // 经度
    name: '', //园所名称
    teacher: '', // 联系人
    phone: '', // 联系电话
    address: '', // 联系地址
    markers: [{
      iconPath: '../../images/location.png',
      id: 0,
      latitude: 39.85831,
      longitude: 116.29272,
      width: 30,
      height: 30
    }]
  },
  clickMap() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude;
        const longitude = res.longitude;
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        });
      },
      fail: (rep) => {
        wx.showToast({
          title: rep.msg,
          icon: 'none',
          duration: 1500
        });
      }
    });
  
  
  },
  // 获取园所信息
  gardenInformation() {
    const data = {
      id: this.data.gardenId
    };
    ajax(gardenInformation, {data}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        this.setData({
          name: res.data.name,
          teacher: res.data.liable,
          phone: res.data.phone,
          address: res.data.region + res.data.address
        });
        if (res.data.longitude_latitude) {
          this.setData({
            longitude: res.data.longitude_latitude[0],
            latitude: res.data.longitude_latitude[1],
            markers: [{
              iconPath: '../../images/location.png',
              id: 0,
              latitude: res.data.longitude_latitude[1],
              longitude: res.data.longitude_latitude[0],
              width: 30,
              height: 30
            }]
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
      gardenId: +options.gardenId
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.gardenInformation();
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
