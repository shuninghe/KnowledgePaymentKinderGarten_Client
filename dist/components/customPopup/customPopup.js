const { bindPhoneNumber, userinfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
Component({

  behaviors: [],

  properties: {

    mode: {
      type: Number,
      value: 4 // 1 购买课程 2 订单列表 3 解除绑定(园所) 4手机号 5不强制授权信息 6强制授权信息
    },
    price: {
      type: Number
    },
    styleColor: String
  },
  data: {
    btnTxt: ['立即购买', '继续购买', '确认'],
    btnTxtCancel: ['考虑一下', '果断放弃', '取消']
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      // isPay: !wx.getStorageSync('isIosPay') && wx.getStorageSync('isIOS')
    });
  },
  ready() {
    
  },
  moved() {},
  detached() {},

  methods: {
    handleConfirm() {
      this.triggerEvent('handleConfirm');
    },
    handleCancel() {
      this.triggerEvent('handleCancel');
    },
    getPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        if (e.detail.iv) {
          let _this = this;
          wx.checkSession({
            success() {
              let data = {
                code: wx.getStorageSync('loginCode'),    //wx.login获取的code
                iv: e.detail.iv,                         //加密算法的初始向量
                encrypted_data: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
              };
              ajax(bindPhoneNumber, {data, method: 'POST'}).then(res => {
                if (res.code === 0) {
                  _this.triggerEvent('getWxPhone'); 
                }
              });
            },
            fail() {
              console.log('checkSession过期');
            }
          });
        } else {
          return false;
        }     
      } else {
        this.triggerEvent('handleCancel');                
      }
    },
    toBindPhone () {
      this.triggerEvent('toBindPhone');                
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
          wx.hideLoading();
          if (res.code === 0) {
            this.triggerEvent('handleConfirm');
          }
        });
      }
    },
  }

});