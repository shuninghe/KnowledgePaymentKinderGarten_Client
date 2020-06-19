const { getRelationList, addBaby, editBaby, editTeacher, deleteUserBaby, deleteClassBaby, deleteTeacher } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    mode: null,       // 1来自切换身份 2来自班级管理 3添加宝宝
    role: null,       // 1老师 2家长
    uid: null,        // 班级用户ID（老师、宝宝）
    baby_id: null,    // 宝宝id
    uname: '',        // 姓名
    cid: null,        // 班级id
    cname: '',        // 班级名
    rid: null,        // 亲属关系id
    relations: [],    // 亲属关系列表
    cuId: null,       // mode=2当前身份的class_user_id
    disabled: true
  },
  // 切换亲属关系
  bindPickerChange: function(e) {
    let pickId = this.data.relations[+e.detail.value]._id;
    console.log('选择器选择的值', e.detail.value, pickId);
    this.setData({
      rid: pickId
    });
    this.activeButton();
  },
  // input输入
  inputText (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    });
    this.activeButton();
  },
  // 按钮
  activeButton () {
    let { role, uname, rid } = this.data;
    switch (role) {
    case 1:
      this.setData({
        disabled: !(uname)
      });
      break;
    case 2:
      this.setData({
        disabled: !(uname && rid)
      });
      break;
    }
  },
  // 保存：添加宝宝、修改宝宝、修改老师
  saveInfo () {
    if (this.data.disabled) {
      wx.showToast({
        title: '请先填写完整',
        icon: 'none'
      });
      return;
    }
    if (this.data.role === 1) { // 修改老师
      let params = {
        teacher_id: this.data.uid,
        class_id: this.data.cid,  
        name: this.data.uname  
      };
      ajax(editTeacher, {data: params, method: 'put'}).then(res => {
        if (res.code === 0) {
          wx.navigateBack({
            delta: 1
          });
        }
      });
    } else if (this.data.role === 2) { 
      if (this.data.mode === 3) { // 家长添加宝宝
        let params = {
          relation_id: this.data.rid, 
          name: this.data.uname 
        };
        this.data.cid && (params.class_id = this.data.cid);  
        ajax(addBaby, {data: params, method: 'post'}).then(res => {
          if (res.code === 0) {
            wx.reLaunch({
              url: '/pages/index/index?selected=9'
            });
          }
        });
      } else if (this.data.mode === 2) { // 老师、家长修改宝宝
        let params = {
          baby_id: this.data.baby_id,
          name: this.data.uname, 
          relation_id: this.data.rid,
        };
        this.data.cid && (params.class_user_id = this.data.cuId); // 教师修改宝宝，传的是教师的class_user_id 
        ajax(editBaby, {data: params, method: 'put'}).then(res => {
          if (res.code === 0) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      } else if (this.data.mode === 1) { // 家长修改宝宝
        let params = {
          baby_id: this.data.baby_id,
          name: this.data.uname, 
          relation_id: this.data.rid,
        };
        this.data.cid && (params.class_user_id = this.data.uid); 
        ajax(editBaby, {data: params, method: 'put'}).then(res => {
          if (res.code === 0) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      }
    }
  },
  // 二次确认删除
  delRole () {
    wx.showModal({
      title: '提示',
      content: `是否确认删除${this.data.role === 1 ? '老师' : '宝宝'}？`,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#107E7D',
      success: (result) => {
        if(result.confirm){
          this.confirmDel();
        }
      }
    });
  },
  // 删除宝宝、删除老师
  confirmDel () {
    if (this.data.role === 1) {
      let params = {
        teacher_id: this.data.uid // 老师id
      };
      ajax(deleteTeacher, {data: params, method: 'delete'}).then(res => {
        if (res.code === 0) {
          console.log('删除老师');
          if (this.data.cuId === this.data.uid) {
            wx.reLaunch({
              url: '../../index/index'
            });
          } else {
            wx.navigateBack({
              delta: 1
            });
          }
        }
      });
    } else if (this.data.role === 2) {
      if (this.data.mode === 1) {
        let params = {
          baby_id: this.data.baby_id // 宝宝id
        };
        ajax(deleteUserBaby, {data: params, method: 'delete'}).then(res => {
          if (res.code === 0) {
            console.log('家长删除宝宝');
            wx.reLaunch({
              url: '../../index/index'
            });
          }
        });
      } else if (this.data.mode === 2) {
        this.deleteClassBaby();
      }
    }
  },
  // 班级删除宝宝
  deleteClassBaby () {
    let params = {
      class_id: this.data.cid,   //班级id
      baby_id: this.data.baby_id // 宝宝id
    };
    ajax(deleteClassBaby, {data: params, method: 'delete'}).then(res => {
      if (res.code === 0) {
        console.log('宝宝退出班级');
        if (this.data.cuId === this.data.uid) {
          wx.reLaunch({
            url: '../../index/index?selected=9'
          });
        } else {
          wx.navigateBack({
            delta: 1
          });
        }
      }
    });
  },
  // 获取亲属关系列表
  getRelationList () {
    return new Promise(resolve => {
      ajax(getRelationList, {data: {}, method: 'get'}).then(res => {
        if (res.code === 0) {
          this.setData({
            relations: res.data.relations
          });
        }
        resolve();
      });
    });
  },
  onLoad(options) {
    this.getRelationList().then(() => {
      let index = this.data.relations.findIndex(item => {
        return item._id === +options.rid;
      });
      this.setData({
        pickerIndex: index
      });
    });
    this.setData({
      role: +options.role,
      mode: +options.mode,
      uid: +options.uid, // 班级用户ID（老师、宝宝）
      baby_id: +options.baby_id, // 宝宝id
      uname: options.uname, // 姓名
      cid: +options.cid, // 班级id
      cname: options.cname, // 班级名
      rid: +options.rid, // 亲属关系id
      cuId: +options.cuId,  // mode=2当前身份的class_user_id
      disabled: +options.mode === 3 ? true : false
    });
    wx.setNavigationBarTitle({
      title: this.data.role === 1 ? '老师信息' : this.data.mode === 3 ? '添加宝宝' : '宝宝信息'
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
