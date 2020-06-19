const { commonShare } = require('../../utils/common');
const { updateRecord } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { coursePosterView, othersImage } = require('../../utils/images');

Page({
  data: {
    activityType: null,
    activityId: null,
    styleImg: coursePosterView,
    othersImage: othersImage,
    selectedIndex: 0,
  },
  changeStyle (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectedIndex: index
    });
    this.selectComponent('#poster').changeBgImg();
  },
  postVisitRecord() {
    let params = {
      activityId: +this.data.activityId,
      openId: wx.getStorageSync('openId')
    };
    ajax(updateRecord, {data:params, method: 'POST', failToast: false}).then(() => {
      console.log('提交海报');
    });

  },
  onLoad(options) {
    console.log(options,'poster');
    this.setData({
      activityId: options.activityId || '',
      activityType: options.activityType || '',
      course_id: wx.getStorageSync('postData').course_id
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
  onShareAppMessage() {
    if (this.data.activityId) {
      this.postVisitRecord();
      let { course_id, name, pic } = wx.getStorageSync('postData');
      return commonShare(
        name,
        `/pages/courseDetail/courseDetail?id=${course_id}&activityId=${this.data.activityId}&activityType=${this.data.activityType}`,
        pic,
        true
      );
    } else {
      let { course_id, name, pic, isHelp} = wx.getStorageSync('postData');
      return commonShare(
        name,
        `/pages/courseDetail/courseDetail?id=${course_id}&isHelp=${isHelp}`,
        pic,
        true
      );
    }
    
    
    
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
