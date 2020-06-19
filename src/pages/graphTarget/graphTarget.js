const { courseDetail, userinfo, getRegistrationConfigList, pay, getPayStatus } = require('../../api.config');
const { ajax } = require('../../utils/util');
var time = 0, touchDot = 0, interval = '';

Page({
  data: {
    showTip: null,
    product_id: null,     // 商品id
    course_id: null,      // 课程id
    name: '',             // 课程名字
    pic: '',              // 课程封面
    price: null,          // 课程价格
    isbuy: null,          // 是否已购课程
    type_field: [],       // [一级类别系列id, 二级领域系列id]
    targetId: [],         // 当前领域下所有目标id(三级id-目标)
    age: '3~4岁',         // 四级年龄段系列名
    target: [],           
    targetIndex: 0,
    numWord: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
    showPhonePopup: false,  // 显示购买绑定手机号弹窗
    showBuyPopup: false,    // 显示未购买提示弹窗
    iosConfig: false, // ios的报名配置
    androidConfig: false, // android的报名配置
    hasSignUp: false, // 是否报过名
  },
  // 关闭滑动提示
  closeTip () {
    this.setData({ 
      showTip: false 
    });
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
      client_id: getApp().globalData.client_id //客户端唯一编号
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
  // 确认购买
  confirmBuy() {
    this.setData({ 
      showBuyPopup: false 
    });
    this.judgeBindPhone();
  },
  // 取消购买
  cancelBuy() {
    this.setData({ 
      showBuyPopup: false 
    });
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸结束事件
  touchEnd: function (e) {
    var touchMove = e.changedTouches[0].pageX;
    // 下一个
    if (touchMove - touchDot <= -60 && time < 10) {
      if (this.data.targetIndex < this.data.target.length - 1) {
        this.setData({
          targetIndex: this.data.targetIndex+1
        });
      } else {
        wx.showToast({
          title: '已经到底啦！',
          icon: 'none'
        });
      }
    }
    // 上一个
    if (touchMove - touchDot >= 60 && time < 10 && this.data.targetIndex > 0) {
      this.setData({
        targetIndex: this.data.targetIndex-1
      });
    }
    clearInterval(interval);
    time = 0;
  },
  
  // 跳转至课程视频页
  toCourseVideo () {
    // 强制报名配置
    if (wx.getStorageSync('functionConfig').isForceEnroll) {
      wx.navigateTo({
        url: `/pages/signUpInfo/signUpInfo?id=${this.data.course_id}`
      });
      return;
    }
    if (this.data.isbuy) {
      let { course_id, target, targetIndex } = this.data;
      wx.navigateTo({
        url: `/pages/courseVideo/courseVideo?course_id=${course_id}&section_id=${target[targetIndex].id}`
      });
    } else {
      if (this.data.isIOS && this.data.iosConfig && !this.data.hasSignUp || !this.data.isIOS && this.data.androidConfig && !this.data.hasSignUp) {
        wx.navigateTo({
          url: `/pages/signUpInfo/signUpInfo?id=${this.data.course_id}`
        });
      } else if ((this.data.iosConfig && this.data.isIOS && this.data.hasSignUp) || (!this.data.iosConfig && this.data.isIOS)) {
        wx.navigateTo({
          url: '/pages/studyCenter/studyCenter'
        });
      } else {
        this.setData({ 
          showBuyPopup: true 
        });
      }
    }
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
  // 处理层级数据
  handleTreeData (trees) {
    // 处理一二级数据
    let { type_field, age } = this.data;
    let tree = [];    // 三四五级数据
    trees.forEach(item1 => {
      if (item1.section_id === type_field[0]) {
        item1.child_trees.forEach(item2 => {
          if (item2.section_id === type_field[1]) {
            tree = item2.child_trees;
            wx.setNavigationBarTitle({ title: item2.section_name });
            return;
          }
        });
      }
    });
    // 处理三四级数据
    let targetId = [], target = [];
    tree.forEach(item3 => {
      targetId.push(item3.section_id);
      item3.child_trees.forEach(item4 => {
        if (item4.section_name === age) {
          target.push({
            id: item4.section_id,           // 四级年龄段系列id  
            title: item3.section_name,      // 三级目标系列名
            content: item4.course_target,   // 四级年龄段【目标详情】
            advise: item4.education_advice  // 四级年龄段【教学建议】
          });
        }
      });
    });
    this.setData({
      targetId, target
    });
  },
  // 获取课程详情
  getCourseDetail () {
    let params = {
      course_id: this.data.course_id, //课程id
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data: params}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        let { product_id, name, pic, price, isbuy, trees, validity } = res.data;
        this.setData({
          product_id, name, pic, price,
          isbuy: isbuy ? (validity < Date.parse(new Date()) ? 0 : 1) : 0,
          showTip: isbuy ? false : true,
          hasSignUp: res.data.is_signUp
        });
        this.handleTreeData(trees);
      }
    });
  },

  onLoad(option) {
    // 开启ios虚拟隐藏
    this.setData({
      isIOS: wx.getStorageSync('isIOS')
    });
    let { id, typeId, fieldId, age } = option;
    this.setData({ 
      course_id: parseInt(id),
      type_field: [parseInt(typeId), parseInt(fieldId)],
      age
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getConfigList();
    this.getCourseDetail();    
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    setTimeout(() => {
      wx.removeStorageSync(`tree_${wx.getStorageSync('section_id')}`);
    }, 500);
  },
  onHide() {
    // Do something when page hide.
    wx.removeStorageSync('loginCode');  
  },
  onUnload() {
    // Do something when page close.
    wx.removeStorageSync(`tree_${wx.getStorageSync('section_id')}`);
    wx.removeStorageSync('section_id');
    wx.removeStorageSync('courseInfo');
    wx.removeStorageSync('curPlayId');
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onPageScroll() {

  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
