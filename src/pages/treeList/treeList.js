const { userinfo, getRegistrationConfigList, courseDetail, pay, getPayStatus } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    product_id: null,     // 商品编号
    course_id: null,      // 课程id
    name: '',             // 课程名字
    pic: '',              // 课程封面
    price: null,          // 课程价格
    isbuy: null,          // 0 未购买 1已购买 [未购买或者非试听不返回视频地址]
    section_id: null,     // 所在系列id
    section_name: null,   // 所在系列name
    trees: [],
    showPhonePopup: false,// 显示购买绑定手机号弹窗
    showBuyPopup: false,  // 显示未购买提示弹窗
    showList: [],          // 系列展开状态 
    iosConfig: false, // ios的报名配置
    androidConfig: false, // android的报名配置
    hasSignUp: false, // 是否报过名
  },
  
  // 跳转至目录章节页
  toTreeList (e) {
    let tree = e.currentTarget.dataset.tree;
    wx.setStorageSync('section_id', tree.section_id);
    wx.setStorageSync(`tree_${tree.section_id}`, {
      section_name: tree.section_name,
      child_trees: tree.child_trees
    });
    let list = wx.getStorageSync('section_id_list');
    list.push(tree.section_id);
    wx.setStorageSync('section_id_list', list);
    wx.navigateTo({
      url: `/pages/treeList/treeList?section_id=${tree.section_id}`
    });
  },
  // 展开、收起
  changeStatus (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      [`showList[${index}]`]: this.data.showList[index] ? 0 : 1
    });
  },
  // 跳转至课程视频页
  toCourseVideo (e) {
    let sectionId = e.currentTarget.dataset.sectionid;
    if (!sectionId) {
      sectionId = wx.getStorageSync('section_id');
    } 
    let course = e.currentTarget.dataset.course;
    let curPlayId = e.currentTarget.dataset.course.section_id;
    let type = e.currentTarget.dataset.type;
    wx.setStorageSync('curPlayId', parseInt(curPlayId));
    // 强制报名配置
    if (wx.getStorageSync('functionConfig').isForceEnroll) {
      wx.navigateTo({
        url: `/pages/signUpInfo/signUpInfo?id=${this.data.course_id}`
      });
      return;
    }
    if (this.data.isbuy || course.foruse) {
      if (course.status) {
        wx.navigateTo({
          url: `/pages/courseVideo/courseVideo?course_id=${this.data.course_id}&section_id=${sectionId}&curPlayId=${curPlayId}&fromType=${type}`
        });
      } else {
        wx.showToast({
          title: '资源更新中',
          icon: 'none',
        });
      }
    } else {
      /*
       * isIOS：是IOS机型
       * iosConfig：开启IOS报名
       * androidConfig：开启android报名
       * hasSignUp：是否已报名
       */
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
  // 处理目录数据
  handleTrees () {
    // 判断是否是【最后一级系列】 - 数组添加标识 hasCourse
    let trees = this.data.trees;
    let showList = [];
    trees.forEach(item => {
      let hasCourse = 0;
      if (item.is_series) {
        if (item.child_trees.length) {
          item.child_trees.forEach(i => {
            if (i.is_series === 0) {
              hasCourse = 1;
            }
          });
        } else {
          hasCourse = 1;
        }
      }
      item.hasCourse = hasCourse;
      showList.push(0);
    });
    this.setData({ trees, showList });
    // 默认展开第一个【最后一级系列】
    let index = trees.findIndex(item => {
      return item.hasCourse === 1;
    });
    if (index > -1) { // 若找不到，返回的index为-1
      this.setData({
        [`showList[${index}]`]: 1
      });
    }
  },
  // 获取课程详情
  getCourseDetail() {
    const data = {
      course_id: this.data.course_id,
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data}).then(res => {
      if (res.code === 0) {
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
    // 开启ios虚拟隐藏
    this.setData({
      isIOS: wx.getStorageSync('isIOS')
    });
    console.log('option', option);
    let { product_id, course_id, name, pic, price, isbuy } = wx.getStorageSync('courseInfo');
    this.setData({
      product_id, course_id, name, pic, price, isbuy,
      section_id: parseInt(option.section_id),
      section_name: wx.getStorageSync(`tree_${option.section_id}`).section_name,
      trees: wx.getStorageSync(`tree_${option.section_id}`).child_trees
    });
    this.getConfigList();
    this.handleTrees();
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    this.getCourseDetail();
  },
  onHide() {
    // Do something when page hide.
    wx.removeStorageSync('loginCode');      
  },
  onUnload() {
    setTimeout(() => {
      let list = wx.getStorageSync('section_id_list');
      wx.removeStorageSync(`tree_${list[list.length-1]}`);
      wx.removeStorageSync('curPlayId');
      list.pop();
      wx.setStorageSync('section_id_list', list);
    }, 500);
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  // onShareAppMessage() {
  //   // return custom share data when user share.
  // },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
