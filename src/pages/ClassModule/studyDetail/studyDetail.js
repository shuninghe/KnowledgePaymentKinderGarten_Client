const { getStudyInfo } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    user_id: null, // 家长id
    courses: [], // 课程id
    studyInfo: [], // 学习详情
    active: 0,
    range: null
  },
  onLoad(option) {
    // courses转为数组
    let coursesList = [];
    for (var item of option.courses.split(',')) {
      coursesList.push(Number(item));
    }
    this.setData({
      user_id: +option.userid,
      courses: coursesList,
      range: +option.range
    });
    this.getStudyInfo();
  },
  // 获取学习详情
  getStudyInfo () {
    let params = {
      user_id: this.data.user_id, // 家长id
      courses: this.data.courses, // 课程id
      range: this.data.range
    };
    console.log(params);
    ajax(getStudyInfo, {data: params, method: 'post'}).then(res => {
      console.log(res);
      if (res.code === 0) {
        res.data.courses.forEach((value, index) => {
          if (index ===0) {
            value.status = true;
          } else {
            value.status = false;
          }
        });
        this.setData({
          studyInfo: res.data.courses
        });
      }
    });
  },
  // 查看课程详情
  showDetail (e) {
    let obj = this.data.studyInfo;
    obj[e.currentTarget.dataset.index].status = !obj[e.currentTarget.dataset.index].status;
    this.setData({
      active: e.currentTarget.dataset.index,
      studyInfo: obj
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
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
