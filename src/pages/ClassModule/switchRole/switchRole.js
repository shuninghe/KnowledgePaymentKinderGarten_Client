const { getRoleList, handleCurRole } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
const { objToParam } = require('../../../utils/common.js');

Page({
  data: {
    roles: [{
      id: 1,
      name: '老师'
    },{
      id: 2,
      name: '家长'
    }],
    pickerIndex: null,
    role: null, // 1老师 2家长
    list: [], 
    curUserId: null, // 当前身份的class_user_id或baby_id
    showEdit: false
  },
  // 获取当前身份 
  getCurRoleInfo () {
    return new Promise((resolve) => {
      ajax(handleCurRole, {data: {}, method: 'get'}).then(res => {
        if (res.code === 0) {
          wx.setStorageSync('curRoleInfo', res.data.role);
          resolve();
        }
      });
    });
  },
  // 切换角色
  bindPickerChange: function(e) {
    let pickId = this.data.roles[+e.detail.value].id;
    let flag = this.data.role === pickId ? false : true;
    this.setData({
      role: pickId
    });
    flag && this.getRoleList(true);
  },
  // 编辑
  switchShowEdit () {
    this.setData({
      showEdit: !this.data.showEdit
    });
  },
  // 跳转编辑身份信息页面
  toEditRoleInfo (e) {
    let item = e.currentTarget.dataset.item;
    let obj;
    if (this.data.role === 1) {
      obj = {
        role: 1,
        mode: 1,
        uid: item.class_user_id,
        uname: item.name,
        cid: item.class_id
      };
    } else {
      console.log(item);
      obj = {
        role: 2,
        mode: 1,
        uid: item.class_user_id,
        baby_id: item.baby_id,
        uname: item.name,
        cid: item.class_id,
        cname: item.class_name,
        rid: item.relation_id
      };
      console.log(obj);
    }
    wx.navigateTo({
      url: `/pages/ClassModule/editRoleInfo/editRoleInfo?${objToParam(obj)}`
    });
  },
  // 切换当前身份
  changeCurRole (e) {
    this.setData({
      curUserId: +e.currentTarget.dataset.uid
    });
    let params = {};
    if (+e.currentTarget.dataset.cid) {
      params.class_user_id = this.data.curUserId;      // 当有班级的时候传此参数
    } else {
      params.baby_id = this.data.curUserId;        // 宝宝id 无班级时传baby_id
    }
    ajax(handleCurRole, {data: params, method: 'put'}).then(res => {
      if (res.code === 0) {
        this.getCurRoleInfo().then(() => {
          wx.reLaunch({
            url: '../../index/index?selected=9'
          });
        });
      }
    });
  },
  // 添加宝宝 & 新建班级
  toAddRole () {
    if (this.data.role === 1) {
      wx.navigateTo({
        url: '/pages/ClassModule/editClassInfo/editClassInfo?mode=2',
      });
    } else if (this.data.role === 2) { 
      wx.navigateTo({
        url: '/pages/ClassModule/editRoleInfo/editRoleInfo?mode=3&role=2'
      });
    }
  },
  // 获取身份列表
  getRoleList (flag=false) {
    let params = {
      type: this.data.role      
    };
    ajax(getRoleList, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          list: res.data.roles,
          showEdit: false
        });
        if (flag && this.data.list.length) {
          let item = this.data.list[0];
          let params = {};
          if (item.class_id) {
            params.class_user_id = item.class_user_id;      // 当有班级的时候传此参数
          } else {
            params.baby_id = item.baby_id;        // 宝宝id 无班级时传baby_id
          }
          this.setData({
            curUserId: item.class_id ? item.class_user_id : item.baby_id
          });
          ajax(handleCurRole, {data: params, method: 'put'}).then(res => {
            if (res.code === 0) {
              this.getCurRoleInfo();
            }
          });
        }
      }
    });
  },
  onLoad(options) {
    let index = this.data.roles.findIndex(item => {
      return item.id === +options.role;
    });
    this.setData({
      role: +options.role,
      pickerIndex: index,
      curUserId: +options.uid
    });
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    this.getRoleList();
    this.getCurRoleInfo();
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
