const { myStudyRecords } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    activeTab: 0,
    type: ['日', '周', '月', '总'],
    duration: 0,
    courses: null,
    coursesTotal: 0
  },

  // 切换tab
  changeTab (e) {
    this.setData({
      activeTab: e.currentTarget.dataset.index
    });
    this.getStudyRecords();
  },

  // 跳转至课程详情页
  toCourseDetail (e) {
    let id = e.currentTarget.dataset.id;
    let ismap = e.currentTarget.dataset.ismap;
    let validity = e.currentTarget.dataset.validity;
    if (validity < Date.parse(new Date())) {
      wx.showToast({
        title: '课程已过期，请重新购买',
        icon: 'none',
      });
      return;
    }
    if (ismap) {
      wx.navigateTo({
        url: `/pages/knowledgeGraph/knowledgeGraph?id=${id}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${id}`
      });
    }
  },
  
  // 获取用户学习记录
  getStudyRecords () {
    let params = {
      type: this.data.activeTab + 1,    // 1日 2周 3月 4总
    };
    ajax(myStudyRecords, {data: params}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        this.setData({
          duration: res.data.duration,
          courses: res.data.courses,
          coursesTotal: res.data.courses.length
        });
      }
    });
  },

  onLoad() {
    wx.showLoading({
      title: '加载中...',
      icon: 'none'
    });
    this.getStudyRecords();
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

  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
