const { getClassType, handleClassInfo } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    mode: 1, // 1编辑班级信息 2新建班级
    types: [{
      _id: 1,
      name: '小班'
    },{
      _id: 2,
      name: '中班'
    },{
      _id: 3,
      name: '大班'
    },{
      _id: 4,
      name: '托班'
    }],
    cdk: null, // 园所编码
    class_id: null,   // 班级id
    name: '',   // 班级名字
    type_id: null, // 班级类型id
  },
  // 选择班级类型
  choiseType (e) {
    this.setData({
      type_id: +e.currentTarget.dataset.id
    });
  },
  // input输入
  inputText (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    });
  },
  // 按钮
  activeButton () {
    let { mode, cdk, name, type_id } = this.data;
    switch (mode) {
    case 1:
      this.setData({
        disabled: !(name && type_id)
      });
      break;
    case 2:
      this.setData({
        disabled: !(cdk && name && type_id)
      });
      break;
    }
  },
  // 保存：添加班级、修改班级
  saveInfo () {
    let { mode, cdk, name, type_id } = this.data;
    if (!(name && type_id && (mode === 1 || mode === 2 && cdk))) {
      wx.showToast({
        title: '请先填写完整',
        icon: 'none'
      });
      return;
    } 
    let params = {
      type_id: this.data.type_id, 
      name: this.data.name   
    };
    if (this.data.mode === 1) { // 修改班级
      params.class_id = this.data.class_id;   
      ajax(handleClassInfo, {data: params, method: 'put'}).then(res => {
        if (res.code === 0) {
          wx.navigateBack({
            delta: 1
          });
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    } else if (this.data.mode === 2) { // 添加班级
      params.cdk = +this.data.cdk;    
      let userinfo = wx.getStorageSync('userinfo');
      params.tname = userinfo.real_name || userinfo.wx_nick_name || `${this.data.name}`;     // 老师名字
      ajax(handleClassInfo, {data: params, method: 'post'}).then(res => {
        if (res.code === 0) {
          wx.reLaunch({
            url: '/pages/index/index?selected=9'
          });
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    }
  },
  // 二次确认删除
  delClass () {
    wx.showModal({
      title: '提示',
      content: '是否确认解散当前班级？',
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
  // 解散班级
  confirmDel () {
    let params = {
      class_id: this.data.class_id
    };
    ajax(handleClassInfo, {data: params, method: 'delete', failToast: false}).then(res => {
      if (res.code === 0) {
        console.log('解散班级');
        wx.reLaunch({
          url: '/pages/index/index'
        });
      }
    }).catch(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      });
    });
  },
  // 获取班级类型列表
  getClassType () {
    ajax(getClassType, {data: {}, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          types: res.data.types
        });
      }
    });
  },
  onLoad(options) {
    this.setData({
      mode: +options.mode, 
      cdk: +options.cdk,  // 园所编码
      class_id: +options.class_id,   // 班级id
      name: options.name,   // 班级名字
      type_id: +options.type_id, // 班级类型id
    });
    wx.setNavigationBarTitle({
      title: this.data.mode === 1 ? '班级信息' : '添加班级'
    });
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {

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
