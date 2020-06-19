const Enums = require('../../utils/enum.js');
Component({

  behaviors: [],

  properties: {
    isForceEnroll: {
      type: Boolean,
      value: false
    }, 
    bannerList: {
      type: Array,
      value: []
    }, // banner图数据
    meunShowType: {
      type: Number,
      value: null
    }, // 菜单导航布局
    classifyList: {
      type: Array,
      value: []
    }, // 菜单导航数据
    newList: {
      type: Array,
      value: []
    }, // 最新更新数据
    classAreasData: {
      type: Array,
      value: []
    }, // 课程配置数据
    helpCourseList: {
      type: Array,
      value: []
    } // 限时优惠课程列表
  },
  data: {
    skipTypeList: Enums.skipTypeList,
    colorList: ['#cee9fd'],
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      isShowEnter: wx.getStorageSync('functionConfig').isShowEnter
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: this.data.colorList[0]
    });
  },
  ready() {},
  moved() {},
  detached() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
  },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: this.data.colorList[0]
      });
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    // changeBanner (e) {
    //   let index = e.detail.current;
    //   wx.setNavigationBarColor({
    //     frontColor: '#000000',
    //     backgroundColor: this.data.colorList[index],
    //   });
    //   console.log(index);
    // },
    // skipType配置跳转 - 首页
    toPage (e) {
      let item = e.currentTarget.dataset.item;
      if (+item.skipType===4) { // H5
        wx.navigateTo({
          url: `/pages/outHtml/outHtml?url=${item.url}`,
        });
      } else if (+item.skipType===5) { // 小程序
        wx.navigateToMiniProgram({
          appId: item.appid || '',
          path: item.url || '',
          extraData: {},
          envVersion: 'release',
        });
      } else if (+item.skipType===8) { // 广告海报
        wx.setStorageSync('adsPostImgs', item.content);
        wx.navigateTo({
          url: `${item.url}?title=${item.name}` || '',
        });
      } else {
        wx.navigateTo({
          url: item.url || '',
        });
      }
    },
    toAllGame () {
      this.triggerEvent('changeTab', {
        selected: 8
      });
    }
  }

});