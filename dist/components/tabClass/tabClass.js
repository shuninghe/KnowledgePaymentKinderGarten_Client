const { handleCurRole } = require('../../api.config');
const { ajax } = require('../../utils/util');

Component({

  behaviors: [],

  properties: {},
  data: {
    tabList: ['班级主页', '通知', '相册', '学习圈'],
    curIndex: null,
    showDialog: false,
    dialog: [{
      icon: '/images/ClassModule/h_notice_104.png',
      txt: '发通知',
      page: '/pages/ClassModule/addNotice/addNotice'
    },{
      icon: '/images/ClassModule/h_photo_104.png',
      txt: '发照片',
      page: '/pages/ClassModule/addPhoto/addPhoto'
    },{
      icon: '/images/ClassModule/h_video_104.png',
      txt: '发视频',
      page: '/pages/ClassModule/addVideo/addVideo'
    }],
    curRoleInfo: {}, // 当前身份信息
    noClass: false,
    conHeight: 0 // 班级圈内容高度
  },
  
  // 生命周期函数
  created() {},
  attached() {
    this.getCurInfo();
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        _this.setData({
          conHeight: windowHeight - 262,
        });
      }
    });
  },
  ready() {},
  moved() {},
  detached() {},
  pageLifetimes: {
    show: function () {
      this.getCurRoleInfo().then(() => {
        this.getCurInfo();
      });
    },
  },
  methods: {
    // 获取当前身份 
    getCurRoleInfo () {
      return new Promise(resolve => {
        ajax(handleCurRole, {data: {}, method: 'get'}).then(res => {
          if (res.code === 0) {
            this.setData({
              curRoleInfo: res.data.role
            });
            wx.setStorageSync('curRoleInfo', res.data.role);
            if (JSON.stringify(res.data.role) === '{}') {
              wx.reLaunch({
                url: '/pages/ClassModule/firstEntry/firstEntry'
              });
            }
          }
          resolve();
        });
      });
    },
    // 获取当前身份
    getCurInfo () {
      let curRoleInfo = wx.getStorageSync('curRoleInfo');
      if (JSON.stringify(curRoleInfo) === '{}') {
        wx.reLaunch({
          url: '/pages/ClassModule/firstEntry/firstEntry'
        });
      } else {
        if (!curRoleInfo.class_id)  {
          this.setData({
            noClass: true
          });
        }
        if (curRoleInfo.type === 1) {
          this.setData({
            tabList: ['班级主页', '通知', '相册', '学习圈', '海报'],
            curIndex: String(this.data.curIndex)==='null' ? 0 : this.data.curIndex
          });
        } else {
          this.setData({
            tabList: ['班级主页', '通知', '相册', '学习圈'],
            curIndex: String(this.data.curIndex)==='null'||this.data.curIndex === 4 ? 0 : this.data.curIndex
          });
        }
      }
      this.setData({ curRoleInfo });
    },
    changeTab (e) {
      this.setData({
        curIndex: +e.currentTarget.dataset.index
      });
    },
    // 跳转切换身份
    toSwitchRole () {
      let curRoleInfo = this.data.curRoleInfo;
      wx.navigateTo({
        url: `/pages/ClassModule/switchRole/switchRole?role=${curRoleInfo.type}&uid=${curRoleInfo.class_user_id || curRoleInfo.baby_id}`
      });
    },
    // 跳转班级管理
    toClassManage () {
      let curRoleInfo = this.data.curRoleInfo;
      wx.navigateTo({
        url: `/pages/ClassModule/classManage/classManage?role=${curRoleInfo.type}&cuId=${curRoleInfo.class_user_id}`
      });
    },
    // 打开发布弹窗
    openDialog () {
      this.setData({
        showDialog: true
      });
    },
    // 关闭发布弹窗
    closeDialog () {
      this.setData({
        showDialog: false
      });
    },
    // 发布跳转
    toPage (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.page
      });
    }
  }

});