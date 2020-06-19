const { getOrderList, cancleOrder, getOrderStatus } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');
Page({
  data: {
    isShowPopup: false,
    orderList: null,
    curSelectId: '',
  },
  // 取消订单
  cancleOrder (e) {
    //  取消
    if(!this.data.isShowPopup){
      this.setData({
        isShowPopup: true,
        curSelectId: e.currentTarget.dataset.id
      });
    }else{
      // 取消
      this.setData({
        isShowPopup: false
      });
    }
  },
  // 获取订单列表
  getOrderList () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    ajax(getOrderList, {
      data:{
        offset: 0,
        limit: 0
      }
    }).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        this.setData({
          orderList: res.data.orders,
        });
        this.getOrderStatus();
      }
    });
  },
  // 获取用户活动订单状态
  getOrderStatus () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    ajax(getOrderStatus, {
      data: {},
      method: 'POST'
    }).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        this.data.orderList.forEach((item, index) => {
          for (let o in res.data) {
            if (item.id === o) {
              item.activity = res.data[o];
              let name = `orderList[${index}]`;
              this.setData({
                [name]: item
              });
            } 
          }
        });
      }
    });
  },
  // 继续购买
  handleConfirm () {
    this.setData({
      isShowPopup: false
    });
  },
  // 取消
  handleCancel () {
    let params = {
      id: this.data.curSelectId
    };
    let that = this;
    ajax(cancleOrder,{method:'PUT',data:params}).then((res)=>{
      if(res.code === 0){
        wx.showToast({
          title: '订单已取消',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: ()=>{
            wx.showLoading({
              title: '加载中',
              mask: true,
            });
            that.getOrderList();
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    });
    this.setData({
      isShowPopup: false
    });
  },
  toPage(e){
    // 订单状态  status 0、用户取消 1、成功提交（待付款） 2、确认到账（已付款）
    //  id,pid,name,payPrice,from = 1 (知识图谱)/2(课程详情)
    // data-status="{{item.status}}" data-pic="{{item.pic}}" data-pid="{{item.id}}" data-orderid="{{item.id}}" data-price="{{item.sale_price}}"
    let p = e.currentTarget.dataset;
    let status = +p.status;
    if (status === 2) {
      wx.navigateTo({
        url: `/pages/orderPay/orderPay?type=${p.status}&orderId=${p.orderid}&name=${p.name}&pid=${p.pid}&pic=${escape(p.pic)}&payPrice=${p.price}&creatDate=${p.create_time}&payTime=${p.pay_time}`,
      });
    } else if(status === 0 || status === 1) {
      wx.navigateTo({
        url: `/pages/orderPay/orderPay?type=${p.status}&orderId=${p.orderid}&name=${p.name}&pid=${p.pid}&pic=${escape(p.pic)}&payPrice=${p.price}&creatDate=${p.create_time}`,
      });
    }
    // wx.navigateTo({
    //   url: `/pages/orderPay/orderPay?atype=${p.atype}&orderId=${p.orderid}`
    // });
  },

  onLoad() {
    // Do some initialize when page load.
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    this.getOrderList();
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
  shareOrder(e) {
    this.setData({
      shareItem: e.currentTarget.dataset.item
    });
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      let item = res.target.dataset.item;
      console.log('分享地址', `/pages/courseDetail/courseDetail?id=${item.course_id}&activityId=${item.activity.activity_id}&cloudId=${item.activity.cloud_id}&isShare=${1}&activityType=${1}`);
      // 来自页面内转发按钮
      return commonShare(
        item.name,
        `/pages/courseDetail/courseDetail?id=${item.course_id}&activityId=${item.activity.activity_id}&cloudId=${item.activity.cloud_id}&isShare=${1}&activityType=${1}`,
        '',
        true
      );
    }
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
