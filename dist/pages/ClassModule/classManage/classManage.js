const { handleClassInfo } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { objToParam, commonShare } = require('../../../utils/common.js');

Page({
  data: {
    role: null,             // 1老师 2家长
    class_user_id: null,    // 当前身份的class_user_id
    class_id: null,         // 班级id
    name: '',               // 班级名字
    type_id: null,          // 班级类型id
    teachers: [],           // 老师列表
    babys: [],              // 宝宝列表
    teacher_num: 0,         // 老师人数
    baby_num: 0,            // 宝宝人数
    invitationList: [{
      role: 1,
      name: '老师'
    },{
      role: 2,
      name: '家长'
    }],
    pickerRole: null,
    showModal: false
  },
  // 邀请老师或家长
  chooseRole (e) {
    this.setData({
      showModal: false,
      pickerRole: +e.target.dataset.role
    });
  },
  openMask () {
    this.setData({
      showModal: true
    });
  },
  // 关闭弹窗
  closeMask: function() {
    this.setData({
      showModal: false
    });
  },
  // 阻止冒泡点击
  stopClick: function(){
    return false;
  },

  // 跳转编辑班级信息页面
  toEditClassInfo () {
    if (this.data.role === 2) return;
    let { class_id, name, type_id } = this.data;
    let obj = { 
      mode: 1,
      class_id,
      name, 
      type_id 
    };
    wx.navigateTo({
      url: `/pages/ClassModule/editClassInfo/editClassInfo?${objToParam(obj)}`
    });
  },
  // 跳转编辑身份信息页面
  toEditRoleInfo (e) {
    let type = +e.currentTarget.dataset.type;
    let item = e.currentTarget.dataset.item;
    if (this.data.role === 2) {
      if (!(type === 2 && item.class_user_id === this.data.class_user_id)) {
        return;
      }
    }
    let obj;
    if (type === 1) { // 修改老师
      obj = {
        role: 1,
        mode: 2,
        uid: item.teacher_id,
        uname: item.name,
        cid: this.data.class_id,
        cname: this.data.name,
        cuId: this.data.class_user_id
      };
    } else if (type === 2) { // 修改家长
      obj = {
        role: 2,
        mode: 2,
        uid: item.class_user_id,
        uname: item.name,
        cid: this.data.class_id,
        cname: this.data.name,
        baby_id: item.baby_id,
        rid: item.relation_id,
        cuId: this.data.class_user_id
      };
    }
    wx.navigateTo({
      url: `/pages/ClassModule/editRoleInfo/editRoleInfo?${objToParam(obj)}`
    });
  },
  // 获取班级信息
  getClassInfo () {
    let params = {
      class_user_id: this.data.class_user_id   // 班级用户id[可选]不传此参数返回空
    };
    ajax(handleClassInfo, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        let { class_id,  name, type_id, teachers, babys, teacher_num, baby_num } = res.data;
        this.setData({
          class_id,  name, type_id, teachers, babys, teacher_num, baby_num
        });
      }
    });
  },
  onLoad(options) {
    this.setData({
      role: +options.role,
      class_user_id: +options.cuId
    });
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    this.getClassInfo();
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
  onShareAppMessage(e) {
    if (e.from === 'button') {
      this.setData({
        pickerRole: +e.target.dataset.role
      });
      return commonShare(
        `欢迎加入${this.data.name}`,
        `/pages/ClassModule/invitation/invitation?role=${this.data.pickerRole}&class_id=${this.data.class_id}&class_name=${this.data.name}`,
        '',
        true
      );
    } else {
      return commonShare(
        `欢迎加入${this.data.name}`,
        `/pages/ClassModule/invitation/invitation?role=2&class_id=${this.data.class_id}&class_name=${this.data.name}`,
        '',
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
