const { userinfo, getLevelInfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
Component({
  behaviors: [],
  properties: {},
  data: {
    globalData: getApp().globalData,
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    userinfo: null, // 用户数据-后端返回
    hasPhone: false,
    liable_kindergarten: null, // 大于0为管理员
    isShowSale: false, // 显示分销系统入口
    showPhonePopup: false, // 显示购买绑定手机号弹窗
    showUserPopup: false
  },
  // 生命周期函数
  created() {},
  attached() {
    this.getLevelInfo();
    this.setData({
      isShowBindGarden: wx.getStorageSync('functionConfig').isShowBindGarden,
      isShowEnter: wx.getStorageSync('functionConfig').isShowEnter,
      hasPackageId: wx.getStorageSync('functionConfig').packageId ? true : false
    });
    if (JSON.stringify(wx.getStorageSync('userinfo'))!=='{}') {
      this.setData({
        userinfo: wx.getStorageSync('userinfo'),
        hasPhone: wx.getStorageSync('userinfo').phone ? true : false,
        liable_kindergarten: wx.getStorageSync('userinfo').liable_kindergarten,
      });
    }
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
            userinfo: res.data,
            hasPhone: res.data.phone ? true : false,
            liable_kindergarten: res.data.liable_kindergarten,
            showUserPopup: false
          });
        }
      });
    },
    onGotUserInfo (e) {
      if (e.detail.userInfo) {
        wx.showLoading({
          title: '加载中',
          mask: true,
        });
        // 修改个人信息
        let params = {
          pic: e.detail.userInfo.avatarUrl,
          wx_nick_name: e.detail.userInfo.nickName
        };
        ajax(userinfo, {data: params, method:'PUT'}).then(res => {
          if (res.code === 0) {
            wx.hideLoading();
          }
        });
      }
    },
    goMyStudy(){
      wx.navigateTo({
        url: '../studyCenter/studyCenter'
      });
    },
    // 加入我们（分销介绍）
    toSaleEntry () {
      let pid = wx.getStorageSync('functionConfig').packageId;
      wx.navigateTo({
        url: `/pages/saleEntrance/saleEntrance?type=1&pid=${pid}`
      });
    },
    // 我的邀请（加盟商）
    toMyInvite () {
      wx.navigateTo({
        url: '/pages/Scholarship/myInvite/myInvite'
      });
    },
    toTypePage (e) {
      if (!this.data.userinfo) {
        this.setData({
          showUserPopup: true
        });
        return;
      }
      const type = +e.currentTarget.dataset.type;
      if (type === 1) { // 园所入驻、园所管理
        if (this.data.liable_kindergarten > 0) {
          wx.navigateTo({
            url: `/pages/kindergarten/kindergarten?from=1&id=${this.data.liable_kindergarten}`
          });
        } else {
          wx.navigateTo({
            url: `../settled/settled?nickName=${this.data.userinfo.wx_nick_name}`
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
      } else if (type === 5) { // 奖学金入口
        wx.navigateTo({
          url: '/pages/Scholarship/scholaHome/scholaHome'
        });
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
    closeUserPopup () {
      this.setData({ 
        showUserPopup: false 
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