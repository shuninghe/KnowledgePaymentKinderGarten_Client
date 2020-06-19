const { formatTimeTwo } = require('../../utils/common');
const { ajax } = require('../../utils/util');
const { getRegistrationConfigList, courseDetail, bindPhoneNumber, userinfo, postSignUpInfo, checkSensitiveWord, pay, getPayStatus, getCode } = require('../../api.config');
Page({
  data: {
    logoPic: getApp().globalData.logoPic,
    information: {},  // 报名信息
    courseId: null, 
    course: '',  // 课程信息
    timer: '',   // 定时器
    canSendCode: false, // 是否可以获取验证码
    alreadySend: false, //
    second: 60,         // 验证码倒计时
    phoneNum: null,
    code: null
  },
  // 获取报名配置
  getSignUpConfig() {
    this.getUserInfo().then(resUser => {
      const data = {
        course_id: this.data.courseId
      };
      ajax(getRegistrationConfigList, {data, method: 'GET', failToast: false}).then(res => {
        if (res.code === 0) {
          this.setData({
            list: res.data.list
          });
          res.data.list.forEach((item, i) => {
            if (item.type === 1 || item.type === 3) {
              this.setData({
                ['information.' + item._id ]: {temp: '',type: item.type}
              });
              if (resUser.real_name.length) {
                if (item.type === 1) {
                  this.setData({
                    ['information.' + item._id ]: {temp: resUser.real_name,type: item.type}
                  });
                }
              }
            } else if (item.type === 2 || item.type === 4) {
              this.setData({
                ['information.' + item._id ]: {temp: null,type: item.type}
              });
              if (resUser.phone.length) {
                if (item.type === 2) {
                  this.setData({
                    ['information.' + item._id ]: {temp: resUser.phone,type: item.type},
                    phoneNum: resUser.phone,
                    canSendCode: true
                  });
                }
              }
            } else if (item.type === 5) {
              this.setData({
                ['information.' + item._id ]: {temp: formatTimeTwo(+new Date(), 'Y-M-D'),type:item.type }
              });
            } else if (item.type === 6) {
              this.setData({
                ['information.' + item._id ]: {temp: item.options[0],type: item.type}
              });
            } else { // 多选
              let deloption = [];
              item.options.forEach(v => {
                deloption.push({ txt: v, status: false});
              });
              this.setData({
                ['information.' + item._id ]: {temp: [],type: item.type},
                ['list['+ i + ']options']: deloption
              });
            }
          });
        }
      });
    });
    
  },
  // 获取课程信息
  getCourseDetail() {
    const data = {
      course_id: this.data.courseId,
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data, method: 'GET', failToast: false}).then(res => {
      if (res.code ===0 ){
        this.setData({
          course: {
            pid: res.data.product_id,
            id: res.data.course_id,
            name: res.data.name,
            pic: res.data.pic,
            payPrice: res.data.price,
            from: 2 
          }
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 设置报名信息
  setInformation(e) {
    if (e.currentTarget.dataset.type === 1 || e.currentTarget.dataset.type === 3 || e.currentTarget.dataset.type === 4 || e.currentTarget.dataset.type === 5) { // 姓名、单行文本、数量
      this.setData({
        ['information.'+ e.currentTarget.dataset.key + '.temp']:  e.detail.value
      });
    } else if (e.currentTarget.dataset.type === 2) { // 手机号
      if (+e.currentTarget.dataset.mode === 1) {
        this.setData({
          ['information.'+ e.currentTarget.dataset.key + '.temp']: e.detail.value
        });
        let phoneNum = e.detail.value;
        if (phoneNum.length === 11) {
          let checkedNum = this.checkPhoneNum(phoneNum);
          if (checkedNum) {
            this.setData({
              phoneNum: phoneNum,
              canSendCode: true
            });
          }
        }
      } else if (+e.currentTarget.dataset.mode === 2) {
        this.setPhoneNumber(e);
      } 
      // else if (+e.currentTarget.dataset.mode === 3) {
      //   this.setData({
      //     code: e.detail.value,
      //   });
      // }
    } else if (e.currentTarget.dataset.type === 6) { // 单选
      this.setData({
        ['information.'+ e.currentTarget.dataset.key + '.temp']: this.data.list[e.currentTarget.dataset.index].options[+e.detail.value]
      });
    } else { // 多选
      let checkArr = this.data.information[e.currentTarget.dataset.key].temp;
      let currentTxt = e.currentTarget.dataset.txt;
      if (checkArr.indexOf(currentTxt) > -1) {
        checkArr.splice(checkArr.indexOf(currentTxt),1);
      } else {
        checkArr.push(currentTxt);
      }
      this.setData({
        ['list[' + e.currentTarget.dataset.index + '].options[' + e.currentTarget.dataset.sonindex + '].status']: !this.data.list[e.currentTarget.dataset.index].options[e.currentTarget.dataset.sonindex].status,
        ['information.'+ e.currentTarget.dataset.key + '.temp']: checkArr
      });

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
  // 一键获取手机号
  setPhoneNumber(e) {
    let _this = this;
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      if (e.detail.iv) {
        wx.checkSession({
          success() {
            let data = {
              code: wx.getStorageSync('signCode'),    //wx.login获取的code
              iv: e.detail.iv,           //加密算法的初始向量
              encrypted_data: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
            };
            ajax(bindPhoneNumber, {data, method: 'POST',failToast: false}).then(res => {
              if (res.code === 0) {
                wx.removeStorageSync('signCode');
                _this.setData({
                  ['information.'+ e.currentTarget.dataset.key+ '.temp']: res.data.phone,
                  phoneNum: res.data.phone,
                  canSendCode: true
                });
              }
            });
          },
          fail() {
            console.log('checkSession过期');
          }
        });
      } 
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
  // 获取个人信息
  getUserInfo() {
    return new Promise((resolve, reject) => {
      ajax(userinfo, {}).then(res => {
        if (res.code === 0) {
          resolve(res.data);
        } else {
          reject();
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
        }
      }).catch(rep => {
        reject();
        wx.showToast({
          title: rep.msg,
          icon: 'none',
          duration: 1500
        });
      });
    });
    
  },
  // 验证报名信息
  checkSignUpInfo(){
    return new Promise((resolve, reject) => {
      let obj = this.data.information //eslint-disable-line
      for (let key in obj) {
        if (obj[key].type === 1) {
          let nameReg = /[\u4e00-\u9fa5]/;
          if (!nameReg.test(obj[key].temp)) {
            wx.showToast({
              title: '请填写正确的姓名',
              icon: 'none'
            });
            reject();
            return;
          } 
        } else if (obj[key].type === 2) {
          let phoneReg = /^1\d{10}$/;
          if (!phoneReg.test(obj[key].temp)) {
            wx.showToast({
              title: '请填写正确的手机号',
              icon: 'none'
            });
            reject();
            return;
          }
        } else {
          if (obj[key].temp && !obj[key].temp.length || !obj[key].temp) {
            wx.showToast({
              title: '必填项不能为空哦',
              icon: 'none'
            });
            reject();
            return;
          }
        }
      }
      resolve();
    }); 
  },
  // 立即报名
  putSignUpInfo() {
    this.checkSignUpInfo().then(() => {
      // 处理数据成后端需要的格式
      let delInfo = {};
      for (let key in this.data.information) {
        delInfo[key] = this.data.information[key].temp;
      }
      this.checkoutTxt(delInfo).then(() => {
        ajax(postSignUpInfo, {data: {information:delInfo, id: this.data.courseId}, method: 'POST',failToast:false}).then(res => {
          if (res.code === 0) {
            if (this.data.timer) clearTimeout(this.data.timer);
            if (this.data.course.payPrice) {
              wx.showModal({
                title: '提示',
                content: '请耐心等待，48小时内会有专人客服与您联系',
                showCancel: false,
                confirmText: '确定',
                confirmColor: '#3CC51F',
                success: (result) => {
                  if(result.confirm){
                    wx.navigateBack({
                      delta: 1
                    });
                  }
                },
              });
            } else {
              // 0元立即学习隐式支付
              this.toPay(this.data.course);
            }            
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            });
          }
        }).catch(rep => {
          wx.showToast({
            title: rep.msg,
            icon: 'none'
          });
        });
      });
      
    });
  },
  // 发起支付-调用辅导支付
  toPay (obj) {
    let params = {
      payment_type: 14,       // 付款方式(14 微信小程序 )，30 卡激活购买
      pids: [{
        pid: +obj.pid,        // 商品编号
        num: 1                // 购买数量
      }]
    };
    let that = this;
    if (wx.getStorageSync('openId')) {
      ajax(pay, { data: params, method: 'POST' }).then(res => {
        if (res.code === 0) {
          // 订单是否已支付成功 若为true则意为已完成支付而无需后续支付流程  主要用于免费内容
          if (!res.data.complete) {
            wx.requestPayment({
              timeStamp: res.data.params.timeStamp,
              nonceStr: res.data.params.nonceStr,
              package: res.data.params.package,
              signType: res.data.params.signType,
              paySign: res.data.params.paySign,
              success: () => {
                that.getPayStatus(res.data.orderId);
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                });
              }
            });
          } else if (res.code === 0 && res.data.complete) {
            this.getPayStatus(res.data.orderId);
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    }
  },
  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.status === 2) { 
          console.log('支付成功');
          wx.navigateBack({
            delta: 1
          });
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  // 检测敏感词
  checkoutTxt(obj) {
    return new Promise((resolve, reject) => {
      let content = '';
      for (let key in obj) {
        content+= obj[key];
      }
      const data = {
        content: content,
        type: 1
      };
      ajax(checkSensitiveWord, {data, method: 'POST', failToast: false}).then(res => {
        if (res.code === 0) {
          if (res.data.status !== 1) {
            wx.showToast({
              title: '请不要输入敏感词汇哦',
              icon: 'none',
              duration: 1500
            });
            reject();
          } 
          resolve();
        }
      }).catch(() => {
        wx.showToast({
          title: '请不要输入敏感词汇哦',
          icon: 'none',
          duration: 1500
        });
        reject();
      });
    });
    
  },
  onLoad(options) {
    wx.login({
      success (res) {
        wx.setStorageSync('signCode', res.code);
      }
    });
    this.setData({
      courseId: +options.id
    });
    this.getCourseDetail();
    this.getSignUpConfig();
  },
  onReady() {
  },
  onShow() {
  },
  onHide() {
  },
  onUnload() {
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
