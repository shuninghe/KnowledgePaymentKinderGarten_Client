const { pay, getPayStatus, joinGroup } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { formatTimeTwo, dealPrice } = require('../../utils/common');

Page({
  data: {
    activityType: null, // 活动类型 1拼团 2秒杀
    actId: null, // 活动id
    orderId: null, // 活动订单id 或 订单id
    type: null, // 0、用户取消 1、成功提交（待付款） 2、确认到账（已付款）
    name: '', // 姓名
    id: '', // 课程id 用于支付成功后跳转
    price: 0, // 
    pic: '',  // 图片
    creatDate: null,
    payTime: null,
    from: 0, // 1(知识图谱)/2(课程详情)
    activity: {}
  },
  // 支付成功后加入拼团回调
  joinGroup(id){
    let params = {
      cloudId: id
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
        wx.hideLoading();
        if (res.data.status === 2) {
          if (this.data.activityType) {
            if (this.data.activityType === 1) { // 加入拼团
              this.joinGroup(this.data.cloudId);
              wx.navigateTo({
                url:  `/pages/groupResult/groupResult?cloudId=${this.data.cloudId}&selectNum=${this.data.selectNum}&actId=${this.data.actId}&course_id=${this.data.id}&isHeader=${0}&orderId=${orderId}`
              });
            } else if (this.data.activityType === 2) { // 秒杀
              wx.redirectTo({
                url: '/pages/myOrder/myOrder'
              });
            }
          } else {
            wx.showToast({
              title: '支付成功',
              icon: 'none',
              success () {
                wx.reLaunch({
                  url: '/pages/studyCenter/studyCenter'
                });
              }
            });
          }
        } else if (res.data.status === 0) {
          wx.showToast({
            title: '支付已取消',
            icon: 'none'
          });
        }
      }
    });
  },
  // 发起支付-调用辅导支付
  toPay () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    let params = {
      payment_type: 14,//付款方式(14 微信小程序 )，30 卡激活购买
      pids: [{
        pid: +this.data.pid ,// 商品编号
        num: 1 ,//  购买数量
      }] 
    };
    if (this.data.activityType) {
      params.discount = (this.data.activityType == 1 ? 2 : (this.data.activityType == 2 ? 3 : 0));
      params.client_id = getApp().globalData.client_id;
      params.goodsType = 5;
      params.extra ={ //  扩展参数可选
        activity:{
          id: +this.data.actId, //活动编号
        },
        buyer_phone: wx.getStorageSync('userinfo').phone     // 购买人手机号
      };
    } else {
      this.data.isHelp && (params.discount = 1);
      this.data.orderId && (params.order_id = this.data.orderId);
    }
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
      }).catch(rej => {
        wx.showToast({
          title: rej.msg,
          icon: 'none'
        });
      });
    }
  },
  onLoad(options) {
    console.log(options);
    this.setData(options);
    if (options.from) {
      this.setData({
        from: +options.from,
        type: 1
      });
    }
    options.payPrice && this.setData({ payPrice: dealPrice(options.payPrice) });
    options.price && this.setData({ price:dealPrice(options.price) });
    options.isHelp && this.setData({ isHelp: +options.isHelp });
    let timestamp = Date.parse(new Date());
    if(!this.data.creatDate){
      this.setData({
        creatDate: formatTimeTwo(timestamp,'Y.M.D h:m:s')
      });
    }
    if (+options.atype) { // 秒杀和参团
      this.setData({
        activityType: +options.atype,
        actId: +options.actId,
        orderId: options.orderId,
      });
    }
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
