const { getShopInformation } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    mode: 1, // 1品牌介绍 2师资力量 3企业荣誉 4学员风采 5联系我们
    pageTitle: ['品牌介绍', '师资力量', '企业荣誉', '学员风采', '联系我们'],
    bannerList: [],
    title: '',
    intro: '',
    video: '',
    photoList: [],
    teachers: [],
    phone: '',              // 手机号(可选)
    address: '',            // 地址(可选)
    official_website: '',   // 官网(可选)
    latitude: 39.85831,     // 纬度
    longitude: 116.29272,   // 经度
    markers: [{
      iconPath: '../../../images/location.png',
      id: 0,
      latitude: 39.85831,
      longitude: 116.29272,
      width: 30,
      height: 30
    }]
  },
  clickMap () {
    const latitude = this.markers[0].latitude;
    const longitude = this.markers[0].longitude;
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
    });
    // wx.getLocation({
    //   type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    //   success (res) {
    //     const latitude = res.latitude;
    //     const longitude = res.longitude;
    //     wx.openLocation({
    //       latitude,
    //       longitude,
    //       scale: 18
    //     });
    //   },
    //   fail: (rep) => {
    //     wx.showToast({
    //       title: rep.msg,
    //       icon: 'none',
    //     });
    //   }
    // });
  },
  // 获取店铺宣传信息
  getShopInformation () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    ajax(getShopInformation, {
      data:{
        client_id: getApp().globalData.client_id,      // (可选)客户端id     小程序使用传递
      }
    }).then(res => {
      wx.hideLoading();
      if (res.Code === 0) {
        this.setData({
          title: res.Data.name,
          phone: res.Data.service_phone,
          weiXin: res.Data.wx_mark || '',
          address: res.Data.address,
          latitude: res.Data.latitude || 39.85831,     // 纬度
          longitude: res.Data.longitude || 116.29272,   // 经度
          ['markers[0].latitude']: res.Data.latitude || 39.85831,
          ['markers[0].longitude']: res.Data.longitude || 116.29272
        });
        switch (this.data.mode) {
        case 1: // 品牌介绍
          this.setData({
            bannerList: res.Data.brand_banner,
            intro: res.Data.intro,
            video: res.Data.video,
            photoList: res.Data.pics
          });
          break;
        case 2: // 师资力量
          this.setData({
            bannerList: res.Data.teacher_banner,
            intro: res.Data.intro,
            teachers: res.Data.teachers
          });
          break;
        case 3: // 企业荣誉
          this.setData({
            bannerList: res.Data.honor_banner,
            honor: res.Data.honor,
          });
          break;
        case 4: // 学员风采
          this.setData({
            bannerList: res.Data.student_banner,
            students: res.Data.students,
          });
          break;
        default:
        case 5: // 联系我们
          this.setData({
            bannerList: res.Data.relation_banner,
            phone: res.Data.service_phone,
            official_website: res.Data.official_website,
            address: res.Data.address
          });
          break;
        }
      }
    });
  },
  onLoad(option) {
    this.setData({
      mode: +option.mode,
      honor: this.data.photoList,
      students: this.data.photoList,
      bottom: getApp().globalData.isIphoneX?'68rpx':''
    });
    wx.setNavigationBarTitle({
      title: this.data.pageTitle[this.data.mode-1]
    });
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    this.getShopInformation();
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
