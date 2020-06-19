const { courseDetail } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    course_id: null,  // 课程id
    firstId: null,    // 一级id
    secondId: null,   // 二级id
    showSelect: false,
    selectContent: [{ageId: 1, name: '3~4岁'}, {ageId: 1, name: '4~5岁'}, {ageId: 1, name: '5~6岁'}],
    selectValue: '3~4岁',
    fieldTitle: '健康',
    list: [],
    itemIndex: 0,
    selectedData: [],
    courseId: 1299
  },
  // 打开、关闭下拉选择器
  switchSelect () {
    this.setData({
      showSelect: !this.data.showSelect
    });
  },
  // 更改选择项 
  changeValue (e) {
    let index = e.currentTarget.dataset.index;
    this.setData({
      selectValue: this.data.selectContent[index].name
    });
    this.switchSelect();
  },
  // 跳转至知识图谱目标页
  toGraphTarget (e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      itemIndex: index
    });
    wx.navigateTo({
      url: `/pages/graphTarget/graphTarget?id=${this.data.course_id}&fieldId=${id}&typeId=${this.data.firstId}&age=${this.data.selectValue}`
    });
  },
  // 获取课程详情
  getCourseDetail() {
    const data = {
      course_id: this.data.course_id,
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        let newArr = []; 
        res.data.trees.forEach((v, i) => {
          if (+v.section_id === +this.data.firstId) {
            if (v.child_trees.length) { 
              res.data.trees[i].child_trees.forEach((a) => { 
                newArr.push({
                  secondId: a.section_id,
                  name: a.section_name
                });
              });
              this.setData({
                list: newArr
              });
            }
          }
        });
      }
    });
  },

  onLoad(options) {
    this.setData({
      course_id: parseInt(options.id),
      fieldTitle: options.title,
      firstId: parseInt(options.firstId)
    });
    wx.setNavigationBarTitle({
      title: this.data.fieldTitle + '领域'
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getCourseDetail();
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
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
