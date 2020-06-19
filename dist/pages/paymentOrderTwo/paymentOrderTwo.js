const {getActivityDetail, userinfo, creatOrder,checkGroup, pay, getPayStatus, joinGroup } = require('../../api.config');
const { ajax } = require('../../utils/util');
const formatPrice = require('../../utils/common.js').dealPrice;
Page({
  data: {
    cloudId: null,
    actId: null,
    groupConfig: [],
    finalFee: null,
    headerDiscount: null,
    selectNum: null,
    activityType: null
  },
  // 获取活动详情
  getActivityDetail() {
    let params = {
      activity_id: +this.data.actId
    };
    ajax(getActivityDetail, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        if (res.data.config.group_config.length > 1) {
          res.data.config.group_config.forEach(v => {
            v.finalFee = formatPrice(v.activity_price - res.data.config.preferential_num > 0 ? v.activity_price - res.data.config.preferential_num : 0);
            v.checked = false;
          });
        } else {
          res.data.config.group_config.forEach(v => {
            v.finalFee = formatPrice(v.activity_price - res.data.config.preferential_num > 0 ? v.activity_price - res.data.config.preferential_num : 0);
            v.checked = true;
          });
          this.setData({
            finalFee: res.data.config.group_config[0].finalFee
          });
        }
        
        this.setData({
          groupConfig: res.data.config.group_config,
          activityType: res.data.activity_type
        });
      }
    });
  },
  // 单选
  selectChecked(e) {
    this.data.groupConfig.forEach(v => {
      v.checked = false;
    });
    this.setData({
      groupConfig: this.data.groupConfig,
      [`groupConfig[${e.currentTarget.dataset.index}].checked`]: true,
      finalFee: this.data.groupConfig[e.currentTarget.dataset.index].finalFee
    });
  },
  // 支付
  judgeBindPhone() {
    let arr = this.data.groupConfig.filter(v => {
      return v.checked;
    });
    
    // 必须选择课程
    if (!arr.length) return wx.showToast({
      title: '请选择您要购买的课程',
      icon: 'none',
    });
    this.setData({
      selectNum: +arr[0].num.substring(0,1)
    });
    // 获取手机号
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    ajax(userinfo, {}, 'get').then(res => {
      if (res.code === 0) {
        if (res.data.phone) {
          this.setData({
            buyPhone: res.data.phone
          });
          this.toPay();
        } else {
          wx.login({
            success:(res)=> {
              wx.setStorageSync('loginCode', res.code);
              this.setData({ 
                showPhonePopup: true 
              });
            }
          });        
        }
      }
    }).finally(() => {
      wx.hideLoading();
    });
  },
  // 验证是否有拼团/发起拼团资格
  checkGroupQual() {
    return new Promise((resolve, reject) => {
      let params = {
        activityId: this.data.activityId
      };
      ajax(checkGroup, {data: params, method: 'post'}).then(res => {
        if (res.code === 0) {
          resolve(res);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          });
          reject();
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.Msg,
          icon: 'none',
          duration: 1500
        });
        reject();
      });
    });
  },
  // 创建活动订单
  createdOrder(){
    return new Promise((resolve,reject) => {
      let parmas = {
        activityId: Number(this.data.actId),
        goodsNo: 1001,
        price: Number(this.data.finalFee) * 100,
        payThrough: 2,
        ip: '',
        goodsType: 5,
        cloudNum: Number(this.data.selectNum)
      };
      this.data.cloudId && !this.data.isHeader && (parmas.cloudId = Number(this.data.cloudId));
      ajax(creatOrder, {data:parmas , method: 'post'}).then(res => {
        if(res.code === 0){
          this.setData({
            cloudId: res.data.cloud_id
          });
          resolve(res);
        }else{
          wx.showToast({
            title: res.msg
          });
          reject(res);
        }
      }).catch( err=> {
        wx.showToast({
          title: err.msg
        });
        reject(err);
      });
    });
  },
  // 支付
  toPay() {
    this.checkGroupQual().then(() => {
      this.createdOrder().then(() => {
        let params = {
          payment_type: 14,
          pids: [{
            pid: parseInt(this.data.productId), //    商品编号
            num: 1, //    购买数量
          }],
          client_id : getApp().globalData.client_id, //客户端唯一编号
          goodsType: 5,
          extra:{ //  扩展参数可选
            activity:{
              id: this.data.actId, //活动编号
            },
            buyer_phone: this.data.buyPhone,     // 购买人手机号
          }
        };
        params.discount = (this.data.activityType == 1 ? 2 : (this.data.activityType == 2 ? 3 : 0));
        ajax(pay, { data: params, method: 'POST',failToast: false }).then(res => {
          if(res.code === 0){
            if (!res.data.complete) {
              wx.requestPayment({
                timeStamp: res.data.params.timeStamp,
                nonceStr: res.data.params.nonceStr,
                package: res.data.params.package,
                signType: 'MD5',
                paySign: res.data.params.paySign,
                success: (resf) => {
                  console.log(resf, '微信支付成功');
                  this.getPayStatus(res.data.orderId);
                },
                fail: (err) => {
                  console.log(err, '微信支付');
                  this.setData({
                    cloudId: null
                  });
                  wx.showToast({
                    title: '支付取消',
                    icon: 'none',
                    duration: 1500,
                    mask: true
                  });
                }
              });
            }
            else if (res.code === 0 && res.data.complete) {
              this.getPayStatus(res.data.orderId);
            }
          } else {
            this.setData({
              cloudId: null
            });
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000,
              mask: true
            });
          }
        });
      });
    });
    
  },
  // 支付成功后加入拼团回调
  joinGroup(){
    let params = {
      cloudId: +this.data.cloudId
    };
    return new Promise((resole,reject)=>{
      ajax(joinGroup, { data: params, method: 'POST',failToast: false }).then(res=>{
        if(res.code === 0){
          resole(res);
        }else{
          reject(res);
        }
      });
    }); 
  },
  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        if (res.data.status === 2) { 
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 1500,
            mask: true
          });
          this.joinGroup();
          wx.navigateTo({
            url: `/pages/groupResult/groupResult?course_id=${this.data.course_id}&actId=${this.data.actId}&cloudId=${this.data.cloudId}&selectNum=${this.data.selectNum}&isHeader=${1}&orderId=${orderId}`
          });
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  // 一键获取手机号
  getWxPhone() {
    this.setData({ 
      showPhonePopup: false 
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
  onLoad(options) {
    this.setData({
      nowTime: +new Date(),
      course_id: options.course_id,
      actId: options.actId,
      productId: options.productId
    });
    this.getActivityDetail();
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
