Component({

  behaviors: [],

  properties: {
    isForceEnroll: {
      type: Boolean,
      value: false
    }, 
    classAreasData: {
      type: Array,
      value: []
    }, // 首页分类数据
    bannerList: {
      type: Array,
      value: []
    }, // banner图数据
    classifyList: {
      type: Array,
      value: []
    }, // 分类数据
    meunShowType: {
      type: Number,
      value: 1
    },
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
    
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // skipType配置跳转 - 首页
    toPage (e) {
      let item = e.currentTarget.dataset.item;
      if (+item.skipType===4 || +item.type===2) { // H5
        wx.navigateTo({
          url: `/pages/outHtml/outHtml?url=${item.url}`,
        });
      } else if (+item.skipType===5 || +item.type===1) { // 小程序
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
    }
  }

});