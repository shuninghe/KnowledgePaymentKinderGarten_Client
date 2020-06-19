const { bindPhoneNumber, getCode, verifyCode, forgetPassword, getLevelInfo, applySaleman } = require('../../api.config');
const { ajax, getPasswordToken } = require('../../utils/util');
Page({
  data: {
    logoPic: getApp().globalData.logoPic,
    mode: 3,    // 1登录 2申请分销帐号 3忘记密码
    pageTitle: ['登录', '申请分销帐号', '忘记密码'],
    canSendCode: false, // 是否可以获取验证码
    alreadySend: false, //
    second: 60,         // 验证码倒计时
    levelId: null,      // 申请等级id
    userName: '',       // 姓名
    phoneNum: '',       // 手机号   
    code: '',           // 验证码
    password: '',       // 密码
    passwordAgain: '',  // 二次密码
    disabled: true,     // 登录、提交按钮禁用状态
    btnLoading: false   // 登录、提交按钮loading
  },
  toPageMode (e) {
    let mode = +e.currentTarget.dataset.mode;
    wx.redirectTo({
      url: `/pages/saleLogin/saleLogin?mode=${mode}`
    });
  },
  // input输入
  inputText (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    });
    // console.log(name + this.data[name]);
    this.activeButton();
  },
  // 一键获取手机号
  getPhoneNumber (e) {
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
                _this.setData({
                  phoneNum: res.data.phone,
                  canSendCode: true
                });
                _this.activeButton();
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
    }
  },
  // 输入手机号
  inputPhoneNum: function (e) {
    let phoneNum = e.detail.value;
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum);
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum,
          canSendCode: true
        });
        // console.log('phoneNum' + this.data.phoneNum);
        this.activeButton();
      }
    } 
  },
  // 验证手机号格式
  checkPhoneNum: function (phoneNum) {
    let str = /^1\d{10}$/;
    if (str.test(phoneNum)) {
      return true;
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
      });
      return false;
    }
  },
  // 获取验证码
  getCode: function () {
    if (!this.data.canSendCode) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }
    let params = {
      mobile: this.data.phoneNum, // 手机号
      type: 3,                    // 类型，   1、注册 2、更换手机号 3、忘记密码 4、绑定手机号
    };
    ajax(getCode, {data: params, method: 'POST', failToast: false}).then(res=>{
      if (res.Code === 0) {
        console.log('获取验证码', res.Data);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    });
    this.setData({
      alreadySend: true,
      canSendCode: false
    });
    this.timer();
  },
  // 计时器
  timer: function () {
    let promise = new Promise((resolve) => {
      let setTimer = setInterval(() => {
        this.setData({
          second: this.data.second - 1
        });
        if (this.data.second <= 0) {
          this.setData({
            second: 60,
            alreadySend: false,
            canSendCode: true
          });
          resolve(setTimer);
        }
      }, 1000);
    });
    promise.then((setTimer) => {
      clearInterval(setTimer);
    });
  },
  
  // 按钮
  activeButton () {
    let {mode, userName, phoneNum, code, password, passwordAgain} = this.data;
    switch (mode) {
    case 1:
      this.setData({
        disabled: !(phoneNum && password)
      });
      break;
    case 2:
      this.setData({
        disabled: !(userName && phoneNum && password, passwordAgain)
      });
      break;
    case 3:
      this.setData({
        disabled: !(phoneNum && code && password)
      });
      break;
    default:
      break;
    }
  },
  // 登录、提交
  onSubmit: function () {
    this.setData({
      btnLoading: true
    });
    let {mode, phoneNum, password, passwordAgain} = this.data;
    switch (mode) {
    case 1:
      getPasswordToken(phoneNum, password).then(() => {
        console.log('登录');
        this.setData({
          btnLoading: false
        });
      });
      break;
    case 2:
      if (password !== passwordAgain) {
        wx.showToast({
          title: '二次密码输入不一样',
          icon: 'none'
        });
        this.setData({
          btnLoading: false
        });
      } else if (password.length < 6) {
        wx.showToast({
          title: '密码最少设置6位',
          icon: 'none'
        });
        this.setData({
          btnLoading: false
        });
      } else {
        this.applySaleman();
      }
      break;
    case 3:
      this.verifyCode();
      break;
    default:
      break;
    }
  },
  // 校验验证码
  verifyCode () {
    let params = {
      mobile: this.data.phoneNum, // 手机号
      code: this.data.code,       // 验证码
      type: 3,                    // 类型，   1、注册 2、更换手机号 3、忘记密码 4、绑定手机号
    };
    ajax(verifyCode, {data:params, mothods:'GET'}).then(res=>{
      if (res.Code === 0) {
        if (res.Data.is_ok) {
          console.log('验证码正确');
          this.forgetPassword();
        } else {
          wx.showToast({
            title: '验证码错误',
            icon: 'none',
          });
          this.setData({
            btnLoading: false
          });
        }
      }
    });
  },
  // 忘记密码
  forgetPassword () {
    let params = {
      mobile: this.data.phoneNum,   // 手机号
      verify_code: this.data.code,  // 验证码
      password: this.data.password  // 新密码
    };
    ajax(forgetPassword, {data: params, method: 'PUT'}).then(res=>{
      if (res.Code === 0) {
        this.setData({
          btnLoading: false
        });
        wx.removeStorageSync('__saleToken__');
        wx.reLaunch({
          url: '/pages/saleLogin/saleLogin?mode=1'
        });
      }
    });
  },
  /** 
  * 根据数组对象中的某一属性值进行数组排序
  * @param {String} attr: 排序的属性
  * @param {Boolean} rev: true表示升序，false降序 (可选, 默认升序)
  * 使用方式: arr.sort(sortBy(attr, true))
  */
  sortBy (attr, rev) {
    if (rev ===  undefined) {
      rev = 1;
    } else {
      rev = (rev) ? 1 : -1;
    }
    return function (a, b) {
      a = a[attr];
      b = b[attr];
      if (a < b) {
        return rev * -1;
      }
      if (a > b) {
        return rev * 1;
      }
      return 0;
    };
  },
  // 获取可申请等级信息
  getLevelInfo () {
    return new Promise((resolve) => {
      ajax(getLevelInfo,{data: {}, method:'GET'}).then((res)=>{
        if (res.code === 0) {
          let index = res.data.list.findIndex(item => {
            return item.status === 2;
          });
          if (index > -1) {
            this.setData({
              levelId: res.data.list[index].id
            });
          } else {
            let list = res.data.list;
            if (list.length) {
              list.sort(this.sortBy('level', true));
              this.setData({
                levelId: list[0].id
              });
            } else {
              wx.showToast({
                title: '暂无申请资格',
                icon: 'none'
              });
            }
          }
          resolve();
        }
      });
    });
  },
  // 申请分销员
  applySaleman () {
    this.getLevelInfo().then(() => {
      let params = {
        client_id: getApp().globalData.client_id,
        userName: this.data.userName,        // 姓名
        phone: this.data.phoneNum,           // 手机号
        level_id: this.data.levelId,         // 等级id
        password: this.data.password,         // 初始密码 （选填） 
        type: 1,
      };
      ajax(applySaleman, {data: params, method: 'POST'}).then(res=>{
        if (res.code === 0) {
          this.setData({
            btnLoading: false
          });
          if (res.data.status === 1) {
            wx.showToast({
              title: '申请成功，需1～3个工作日进行审核',
              icon: 'none',
              duration: 1500,
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }, 1500);
          } else if (res.data.status === 2) {
            wx.redirectTo({
              url: '/pages/saleLogin/saleLogin?mode=1',
            });
          }
        }
      }).catch(res => {
        if (res.code === 4) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    });
  },

  onLoad(option) {
    this.setData({
      mode: +option.mode
    });
    wx.setNavigationBarTitle({
      title: this.data.pageTitle[this.data.mode-1]
    });
  },
  onReady() {

  },
  onShow() {
    wx.login({
      success (res) {
        wx.setStorageSync('loginCode', res.code);
      }
    });
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
