const { coursesList } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    category_id: null,    // 分类id
    activeTab: 0,
    tabsData: null
  },
  // 获取设备宽度
  getSystemWidth () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        });
      }
    });
  },
  scroll (e) {
    if (e.detail.scrollLeft > 10) {
      this.setData({ showLeftTip: true });
    } else {
      this.setData({ showLeftTip: false });
    }
    if (e.detail.scrollWidth-this.data.windowWidth-e.detail.scrollLeft <= 10) {
      this.setData({ showRightTip: false });
    } else {
      this.setData({ showRightTip: true });
    }
  },

  // 切换tab
  changeTab (e) {
    this.setData({
      activeTab: e.currentTarget.dataset.index
    });
  },

  // 跳转至课程详情页
  toCourseDetail (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?id=${id}`
    });
  },
  
  // 获取分类课程列表
  getCourseList (id) {
    let data = {
      category_id: id   //分类id
    };
    ajax(coursesList, {data}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (!res.data.child_category){
          this.setData({
            tabsData: res.data['child_category'] = [{
              category_name: res.data.category_name,
              courses: res.data.courses
            }] 
          });
        } else {
          this.setData({
            tabsData: res.data.child_category
          });
        }
        wx.setNavigationBarTitle({
          title: res.data.category_name
        });
        if (this.data.tabsData.length > 4) {
          this.setData({
            showRightTip: true
          });
        }
      }
    });
  },
  
  onLoad(option) {
    console.log('option', option);
    this.setData({ 
      category_id: parseInt(option.id) 
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getCourseList(option.id);
    this.getSystemWidth();
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
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
