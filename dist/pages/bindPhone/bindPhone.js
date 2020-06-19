const {getPhoneCode, checkPhoneCode, userinfo } = require('../../api.config');
const {ajax} = require('../../utils/util');
Page({
  data: {
    text: '获取验证码', //按钮文字
    currentTime: 61, //倒计时
    disabled: false, //按钮是否禁用
    phone: '',
    phonecode: '',
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      phonecode: e.detail.value
    });
  },
  // 确定
  confirm(){
    let params = {
      mobile: this.data.phone,                     //手机号
      code: this.data.phonecode+'',                       //验证码
      type:  4,      // 1、注册 2、更换手机号 3、忘记密码 4、绑定手机号
    };
    ajax(checkPhoneCode,{data:params,method:'get'}).then(res => {
      if (res.code === 0&&res.data.is_ok) {
        this.updatePhone();
      }else{
        wx.showToast({
          title: '验证码错误',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      }
    });
  },
  // 更新个人中心
  updatePhone(){
    let data = {
      phone: this.data.phone
    };
    ajax(userinfo,{data,method:'PUT'}).then(res=>{
      if(res.code === 0){
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: ()=>{
            wx.navigateBack({
              delta: 1
            });
          },
        });
        wx.setStorageSync('isRefreshUserInfo', '1');
      }
    });
  },
  // 获取验证码
  getCode() {
    var that = this;
    if(this.data.disabled){
      return;
    }
    that.setData({
      disabled: true, //只要点击了按钮就让按钮禁用 （避免正常情况下多次触发定时器事件）
    });
    var phone = that.data.phone;
    var currentTime = that.data.currentTime; //把手机号跟倒计时值变例成js值
    var warn = null; //warn为当手机号为空或格式不正确时提示用户的文字，默认为空
    if (phone == '') {
      warn = '号码不能为空';
    } 
    if (phone.trim().length != 11 || !/^1\d{10}$/.test(phone)) {
      warn = '手机号格式不正确';
    } if((warn != null)) {
      //判断 当提示错误信息文字不为空 即手机号输入有问题时提示用户错误信息 并且提示完之后一定要让按钮为可用状态 因为点击按钮时设置了只要点击了按钮就让按钮禁用的情况
      wx.showToast({
        title: warn,
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
      });
      that.setData({
        disabled: false,
      });
      return;
    }
    let params = {
      type: 4,
      mobile: this.data.phone
    };
    ajax(getPhoneCode,{data:params,method:'POST'}).then(res => {
      if (res.code === 0) {
        //当手机号正确的时候提示用户短信验证码已经发送
        wx.showToast({
          title: '短信验证码已发送',
          icon: 'none',
          duration: 2000
        });
        //设置一分钟的倒计时
        var interval = setInterval(function () {
          currentTime--; //每执行一次让倒计时秒数减一
          that.setData({
            text: currentTime + 's', //按钮文字变成倒计时对应秒数
          });
          //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
          if (currentTime <= 0) {
            clearInterval(interval);
            that.setData({
              text: '重新发送',
              currentTime: 61,
              disabled: false,
              color: '#929fff'
            });

          }

        }, 1000);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
        });
      
      }
    }).catch(()=>{
      this.setData({
        disabled: false
      });
    });
  },
  onLoad() {
    // Do some initialize when page load.
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
