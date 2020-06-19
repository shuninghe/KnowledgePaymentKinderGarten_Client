const { getAllClassify, getClassifyCourse } = require('../../api.config');
const { ajax } = require('../../utils/util');
Component({

  behaviors: [],

  properties: {},
  data: {
    classifyData: [],
    courseData: [],
    conHeight: null,
    classifyActive: 0,
    classifyId: null,
    contentActive: null,
    curPage: 1
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      bottom: getApp().globalData.isIphoneX?'68rpx':''
    });
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        _this.setData({
          conHeight: windowHeight - 97,
        });
      }
    });
    this.getAllClassify();
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 获取课程分类
    getAllClassify () {
      let params = {
        type: 2 // 1树结构 2平级结构
      };
      ajax(getAllClassify, {data: params, failToast: false}).then(res=>{
        if (res.code === 0) {
          this.setData({ 
            classifyData: res.data,
            classifyId: res.data.length ? res.data[0]._id : null
          });
          if (this.data.classifyId) {
            this.getClassifyCourse();
          }
        }
      });
    },
    // 分类选择
    chooseType (e) { 
      let dataSet = e.currentTarget.dataset;
      this.setData({
        classifyActive: +dataSet.index,
        classifyId: +dataSet.id, 
        curPage: 1
      });
      this.getClassifyCourse();
    },
    // 获取分类下所有课程
    getClassifyCourse (offset = 0) {
      let params = {
        limit: 24,
        skip: offset || 0,
        category_id: this.data.classifyId
      };
      ajax(getClassifyCourse, { data: params, failToast: false }).then(res=>{
        if (res.code === 0) {
          if (offset) {
            let courseData = this.data.courseData.concat(res.data.courses);
            this.setData({
              courseData: courseData
            });
          } else {
            this.setData({
              courseData: res.data.courses
            });
          }
        }
      });
    },
    toCourseDetail (e) {
      let id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${id}`,
      });
    },
  }

});