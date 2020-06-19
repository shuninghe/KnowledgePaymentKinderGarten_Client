const { getStudyCircle } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Component({

  behaviors: [],

  properties: {
    conHeight: Number,
    curRoleInfo: Object
  },
  data: {
    activeTab: 0,
    range: 1,
    type: ['日', '周', '月', '总'],
    total_time: 0, // 总时长
    total_num: 0, // 学习总人数
    userInfo: [] // 所有用户学习信息
  },

  // 生命周期函数
  created() {},
  attached() {
    this.getStudyCircle();
  },
  ready() {},
  moved() {},
  detached() {},
  pageLifetimes: {
    show: function () {
      this.getStudyCircle();
    },
  },
  methods: {
    // 切换tab
    changeTab (e) {
      this.setData({
        activeTab: e.currentTarget.dataset.index,
        range: e.currentTarget.dataset.index + 1
      });
      this.getStudyCircle();
    },
    // 获取学习圈
    getStudyCircle () {
      let params = {
        class_id: this.data.curRoleInfo.class_id, // 班级id     暂时没有获取到
        range: this.data.range, // 1日 2周 3月 4总
        class_user_id: this.data.curRoleInfo.class_user_id // 班级用户id   暂时没有获取到
      };
      ajax(getStudyCircle, {data: params}).then(res => {
        if (res.code === 0) {
          this.setData({
            total_time: res.data.total_time,
            total_num: res.data.total_num,
            userInfo: res.data.user_info
          });
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    },
    // 查看详情
    toDetail (e) {
      let class_user_id = +e.currentTarget.dataset.classuserid;
      let curRoleInfo = this.data.curRoleInfo;
      if (curRoleInfo.type === 1 || curRoleInfo.type===2 && class_user_id === +curRoleInfo.class_user_id) {
        wx.navigateTo({
          url: '/pages/ClassModule/studyDetail/studyDetail?userid=' + e.currentTarget.dataset.userid + '&courses=' + e.currentTarget.dataset.courses.join(',') + '&range=' + this.data.range
        });
      }
    }
  }

});