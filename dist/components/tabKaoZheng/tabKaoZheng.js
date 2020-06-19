const { getRecommendList, getcourseList } = require('../../api.config');
const { ajax } = require('../../utils/util');

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
    classifyList: {
      type: Array,
      value: []
    }, // 分类数据
    meunShowType: {
      type: Number,
      value: 1
    },
    recommended: {
      type: Object,
      value: {}
    }, // 最新推荐
    courseCategory: {
      type: Object,
      value: {}
    } // 认证项目
  },
  data: {
    recommendList: [], // 最新推荐列表
    courseList: [] // 认证项目列表
  },

  // 生命周期函数
  created() { },
  attached() { },
  ready() { 
    console.log(this.data.recommended, this.data.courseCategory);
    if (this.data.recommended && JSON.stringify(this.data.recommended)!=='{}') {
      this.getRecommendList();
    }
    if (this.data.courseCategory && JSON.stringify(this.data.courseCategory)!=='{}') {
      this.getcourseList();
    } 
  },
  moved() { },
  detached() { },

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
    },
    // 获取最新推荐列表
    getRecommendList() {
      let params= {
        id: this.data.recommended.category,  // 图文分类id
        type: this.data.recommended.type     // 是否显示子分类图文   0不显示 1显示
      };
      ajax(getRecommendList, {data: params}).then(res => {
        if (res.code === 0) {
          this.setData({
            recommendList: res.data.list
          });
        }
      });
    },
    // 获取认证课程列表
    getcourseList() {
      let params = {
        id: this.data.courseCategory.id,      // 课程分类id
        type: this.data.courseCategory.type   // 是否显示子分类课程  0不显示 1显示
      };
      ajax(getcourseList, {data: params}).then(res => {
        if (res.code === 0) {
          this.setData({
            courseList: res.data.list
          });
        }
      });
    },
    // 最新推荐跳转
    toContent (e) {
      let item = +e.currentTarget.dataset.item;
      if (+item.content_type === 1) {
        wx.navigateTo({
          url: `/pages/dynamicDetail/dynamicDetail?id=${item.id}`
        });
      }
      if (+item.content_type === 2) {
        wx.navigateTo({
          url: `/pages/outHtml/outHtml?url=${item.content}`,
        });
      }
    },
    // 认证项目跳转
    toCourseDetail (e) {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${e.currentTarget.dataset.id}`
      });
    }
  }

});