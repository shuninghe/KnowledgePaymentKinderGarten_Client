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
    classAreasData: {
      type: Array,
      value: []
    }, // 课程配置数据
    helpCourseList: {
      type: Array,
      value: []
    }, // 限时优惠课程列表

  },
  data: {
    
  },

  // 生命周期函数
  created() {},
  attached() {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#feb218'
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
        backgroundColor: '#feb218'
      });
    },
    hide: function () { },
    resize: function () { },
  },

  methods: {
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
          fail: (err) => {
            console.log(err);
          }
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
  }

});