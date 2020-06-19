const { userinfo, getLevelInfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
Component({

  behaviors: [],

  properties: {},
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    userData: null ,// 用户数据
    liable_kindergarten: null, // 大于0为管理员
    isShowSale: false, // 显示分销系统入口
    showPhonePopup: false, // 显示购买绑定手机号弹窗
  },

  // 生命周期函数
  created() {},
  attached() {
    this.getLevelInfo();
    this.setData({
      isShowBindGarden: wx.getStorageSync('functionConfig').isShowBindGarden,
      isShowEnter: wx.getStorageSync('functionConfig').isShowEnter
    });
    let userData = wx.getStorageSync('userData');
    if (userData) {
      this.setData({ userData });
    }
    this.getUserInfo();
  },
  ready() {},
  moved() {},
  detached() {},
  pageLifetimes: {
    show: function() {
      this.getUserInfo();
    },
  },
  methods: {
    getUserInfo () {
      ajax(userinfo, {failToast: false}).then(res => { 
        if (res.code === 0) {
          wx.setStorageSync('userinfo', res.data);
          this.setData({
            hasPhone: res.data.phone ? true : false,
            liable_kindergarten: res.data.liable_kindergarten
          });
        }
      });
    },
    goMyStudy(){
      wx.navigateTo({
        url: '../studyCenter/studyCenter'
      });
    },
    onGotUserInfo(e){
      let nowTime = new Date().getTime();
      if (nowTime - this.data.time < 2000) {
        return;
      } else {
        this.setData({
          time: nowTime
        });
      }
      const type = +e.currentTarget.dataset.type;
      if (e.detail.userInfo) {
        wx.showLoading({
          title: '加载中',
          mask: true,
        });
        wx.setStorageSync('userData', e.detail.userInfo);
        this.setData({
          userData: e.detail.userInfo
        });
        // 修改个人信息
        let params = {
          pic: this.data.userData.avatarUrl,
          wx_nick_name: this.data.userData.nickName
        };
        ajax(userinfo, {data: params, method:'PUT'}).then(res => {
          wx.hideLoading();
          if (res.code === 0) {
            this.toTypePage(type);
          }
        });
      }
    },
    toTypePage (type) {
      if (type === 1) { // 园所入驻、园所管理
        if (this.data.liable_kindergarten > 0) {
          wx.navigateTo({
            url: `/pages/kindergarten/kindergarten?from=1&id=${this.data.liable_kindergarten}`
          });
        } else {
          wx.navigateTo({
            url: `../settled/settled?nickName=${this.data.userData.nickName}`
          });
        }
      } else if (type === 2) { // 个人信息
        wx.navigateTo({
          url: '/pages/userInfo/userInfo'
        });
      } else if (type === 3) { // 学习卡激活
        if (this.data.hasPhone) {
          wx.navigateTo({
            url: '/pages/cardActivate/cardActivate'
          });
        } else {
          let _this = this;
          wx.login({
            success (res) {
              wx.setStorageSync('loginCode', res.code);
              _this.setData({ 
                showPhonePopup: true 
              });
            }
          });        
        }
      } else if (type === 4) { // 分销入口
        if (wx.getStorageSync('saleManInfo')) {
          wx.navigateTo({
            url: '/pages/saleHome/saleHome'
          });
        } else {
          wx.navigateTo({
            url: '/pages/saleLogin/saleLogin?mode=1'
          });
        }
      }
    },
    // 一键获取手机号
    getWxPhone() {
      this.setData({ 
        showPhonePopup: false,
        hasPhone: true
      });
      this.toTypePage(3);
    },
    // 绑定其他手机号
    toBindPhone() {
      this.setData({ 
        showPhonePopup: false 
      });
      wx.navigateTo({
        url: '/pages/bindPhone/bindPhone'
      });
    },
    // 关闭购买绑定手机号弹窗
    closePhonePopup () {
      this.setData({ 
        showPhonePopup: false 
      });
    },
    // 获取可申请等级信息
    getLevelInfo () {
      ajax(getLevelInfo,{data: {}, method:'GET'}).then((res)=>{
        if (res.code === 0) {
          res.data.list.forEach(item => {
            if (item.status === 2) {
              this.setData({
                isShowSale: true
              });
            }
          });
        }
      });
    }
  }

});