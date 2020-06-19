const { courseDetail, userinfo, getRegistrationConfigList, pay, getPayStatus } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    isShowBottomPrice: true, // 是否显示底部价格
    product_id: null, // 商品id
    course_id: null,  // 课程id
    name: '',         // 课程名字
    pic: '',          // 课程封面
    price: null,      // 课程价格
    isbuy: null,
    courseNum: '',    // 课程总数
    fields: [
      {
        position: [312, 208],
        arrowPos: [64, 131],
        arrowDeg: 0
      },{
        position: [577, 415],
        arrowPos: [-50, 50],
        arrowDeg: 72
      },{
        position: [481, 685],
        arrowPos: [0, -90],
        arrowDeg: 144
      },{
        position: [133, 685],
        arrowPos: [140, -90],
        arrowDeg: 216
      },{
        position: [48, 415],
        arrowPos: [180, 50],
        arrowDeg: 288
      },
    ],
    showPhonePopup: false, // 显示购买绑定手机号弹窗
    iosConfig: false, // ios的报名配置
    androidConfig: false, // android的报名配置
    hasSignUp: false, // 是否报过名
  },
  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.status === 2) { 
          console.log('支付成功');
          this.setData({
            isbuy: 1
          });
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  // 发起支付-调用辅导支付
  toPay (obj) {
    let params = {
      payment_type: 14,       // 付款方式(14 微信小程序 )，30 卡激活购买
      pids: [{
        pid: +obj.pid,        // 商品编号
        num: 1                // 购买数量
      }],
      client_id: getApp().globalData.client_id    //客户端唯一编号
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
  
  // 判断是否已绑定手机号-获取个人信息
  judgeBindPhone () {
    if (this.data.flag) return; 
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({ flag: true });
    ajax(userinfo, {}, 'get').then(res => {
      if (res.code === 0) {
        setTimeout(() => {
          this.setData({ flag: false });          
        }, 500);
        if (res.data.phone) {
          let { product_id, course_id, name, price } = this.data;
          let pic = escape(this.data.pic);
          if (price) {
            wx.hideLoading();
            // 跳转至订单详情页
            wx.navigateTo({
              url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${pic}&payPrice=${price}&from=2`
            });
          } else {
            // 0元立即学习隐式支付
            let obj = {
              pid: product_id,
              id: course_id,
              name: name,
              pic: pic,
              payPrice: price,
              from: 2 
            };
            this.toPay(obj);
          }
        } else {
          wx.hideLoading();
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
      }
    });
  },
  // 一键获取手机号
  getWxPhone() {
    this.setData({ 
      showPhonePopup: false 
    });
    // 0元立即学习隐式支付
    if (!this.data.price) {
      this.judgeBindPhone();
      return;
    }
    let { product_id, course_id, name, price } = this.data;
    let pic = escape(this.data.pic);
    // 跳转至订单详情页
    wx.navigateTo({
      url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${pic}&payPrice=${price}&from=2`
    });
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

  // 跳转至知识图谱领域页
  toGraphField (e) {
    const title = e.currentTarget.dataset.title;
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/graphField/graphField?id=${this.data.course_id}&title=${title}&firstId=${id}`
    });
  },
  
  // 获取课程详情
  getCourseDetail() {
    const data = {
      course_id: this.data.course_id,
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        let { product_id, name, pic, price, isbuy, sections_num, validity } = res.data;
        this.setData({
          product_id, name, pic, price,
          isbuy: isbuy ? (validity < Date.parse(new Date()) ? 0 : 1) : 0,
          courseNum: sections_num
        });
        if (res.data.trees.length) {
          res.data.trees.forEach((v, i) => {
            if (v.is_series && i<5 ) {
              this.setData({
                [`fields[${i}].title`]: v.section_name,
                [`fields[${i}].num`]: v.study_schedule.section_duration,
                [`fields[${i}].sectionId`]: v.section_id,
              });
            }
          });
        }
        // 是否报过名
        this.setData({
          hasSignUp: res.data.is_signUp
        });
      }
    });
  },
  // 获取报名配置
  getConfigList() {
    const data = {
      course_id: this.data.course_id
    };
    ajax(getRegistrationConfigList, {data, method: 'GET',failToast: false}).then(res => {
      if (res.code === 0) {
        if (res.data.Aircraft.length >= 2) {
          this.setData({
            iosConfig: true,
            androidConfig: true
          });
        } else if (res.data.Aircraft.length === 1) {
          if (res.data.Aircraft[0] === 1) {
            this.setData({
              iosConfig: false,
              androidConfig: true
            });
          } else {
            this.setData({
              iosConfig: true,
              androidConfig: false
            });
          }
        } else {
          this.setData({
            iosConfig: false,
            androidConfig: false
          });
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none',
        duration: 1500
      });
    });
  },
  onLoad(option) {
    this.setData({
      course_id: parseInt(option.id)
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    // 开启ios虚拟隐藏
    this.setData({
      isIOS: wx.getStorageSync('isIOS')
    });
    this.getConfigList();
  },
  onReady() {
  },
  onShow() {
    this.getCourseDetail();
  },
  onHide() {
    wx.removeStorageSync('loginCode'); 
  },
  onUnload() {
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
  },
  onTabItemTap() {
  },
  customData: {}
});
