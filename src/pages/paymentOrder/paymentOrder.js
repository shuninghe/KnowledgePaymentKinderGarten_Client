const {pay, packageGoods, getPayStatus, userinfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
// const { formatTimeTwo, formatMoney } = require('../../utils/common');
Page({
  /**
       * 页面的初始数据
       */
  data: {
    mode: 0, // 0正常打包商品（回首页）、1分销（跳转分销登录）、2VIP（返回上一页）、3知识付费数
    nowTime: new Date().getTime(),
    pid: '', // 打包商品id
    packageGoods: {},
    payPid: [], //支付商品id
    payMoney: 0, // 支付金额
    showPhonePopup: false // 显示购买绑定手机号弹窗
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...'
    }); 
    this.setData({
      mode: +options.mode || 0,
      pid: +options.pid || '',
      shopId: +options.shopid || null
    });
    if (this.data.mode === 3) {
      this.setData({
        pid: +options.pid || +wx.getStorageSync('functionConfig').knowledgeId
      });
    } 
    this.getPackageGoods();
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    });
  },
  // 获取打包商品详情
  getPackageGoods() {
    const data = {
      pid: this.data.pid
    };
    ajax(packageGoods, {data, method: 'get'}).then(res => {
      if (res.code === 0) {
        let data = res.data;
        data.sell_price = (data.sell_price / 100).toFixed(2);
        data.price = (data.price / 100).toFixed(2);
        data.good_list.forEach(item => {
          item.sell_price = (item.sell_price / 100).toFixed(2);
        });
        if(data.bale_status === 2) {
          let pay = data.id;
          let money = data.sell_price;
          data.good_list.forEach(item => {
            item.checked = true;
          });
          this.setData({
            payPid: pay,
            payMoney: money
          });
        } else {
          data.good_list.forEach(item => {
            item.checked = false;
          });  
        }
        if(data.bale_status === 1) {
          this.setData({
            payPid: ''
          }); 
        }
        wx.hideLoading();
        this.setData({
          packageGoods: data
        });
      }
    });
  },
  // 选中支付商品
  selectChecked(e) {
    // console.log(e.currentTarget.dataset.pid, e.currentTarget.dataset.type,e.currentTarget.dataset.checked);
    if(e.currentTarget.dataset.type === 2) {
      return false;
    }
    // 单选
    if(e.currentTarget.dataset.type === 1) {
      let data = this.data.packageGoods;
      let pay = [];
      let money = 0;
      data.good_list.forEach(item => {
        if(item.pid === e.currentTarget.dataset.pid) {
          item.checked = true;
          pay.push(item.pid);
          money = item.sell_price;
        } else {
          item.checked = false;
        }
      });
      this.setData({
        packageGoods: data,
        payPid: pay,
        payMoney: money
      });
    }
    // 不限制
    if(e.currentTarget.dataset.type === 3) {
      let data = this.data.packageGoods;
      data.good_list.forEach(item => {
        if(item.pid === e.currentTarget.dataset.pid) {
          if(e.currentTarget.dataset.checked) {
            let index = this.data.payPid.findIndex(e => e === item.pid);
            if (index > -1) {
              this.data.payPid.splice(index, 1);
            }
            item.checked = false;
          } else {
            item.checked = true;
            this.data.payPid.push(item.pid);
          }
        }
      });
      let money = 0;
      // money = (money / 100).toFixed(2);
      if(this.data.payPid.length) {
        if(this.data.payPid.length === data.good_list.length) {
          money = data.sell_price * 100;
        } else {
          data.good_list.forEach(item => {
            this.data.payPid.forEach(item1 => {
              if(item.pid === item1) {
                money = money + parseInt(item.sell_price * 100); 
              }
            });
          }); 
        }
      }
      money = (money / 100).toFixed(2);
      this.setData({
        packageGoods: data,
        payMoney: money
      });
    }
  },
  // 判断是否已绑定手机号-获取个人信息
  judgeBindPhone (e) {
    if (this.data.flag) return;
    let type = e.currentTarget.dataset.type;
    if(type === 3) {
      if(!this.data.payPid.length) {
        wx.showToast({
          title: '请选择支付的商品',
          icon: 'none',
          duration: 3000
        });
        return false;
      }
    }
    if(type === 1 || type === 2) {
      if(!this.data.payPid) {
        wx.showToast({
          title: '请选择支付的商品',
          icon: 'none',
          duration: 3000
        });
        return false;
      }
    }
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({ flag: true });
    ajax(userinfo, {failToast: false}, 'get').then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        wx.setStorageSync('userinfo', res.data);
        setTimeout(() => {
          this.setData({ flag: false });          
        }, 500);
        if (res.data.phone) {
          this.toPay();
        } else {
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
  // 发起支付-调用辅导支付
  toPay () {
    let pids = [];
    if(this.data.payPid.length === this.data.packageGoods.good_list.length) {
      pids.push({
        pid: this.data.packageGoods.id,
        num: 1
      });
    } else {
      this.data.payPid.forEach(item => {
        pids.push({
          pid: item,
          num: 1
        });
      });
    }
    let extra = {
      // phone: wx.getStorageSync('userinfo').phone,   //  手机号
      // address_id: '5e5972424562c84e27f955ef'
    };
    this.data.shopId && (extra.shop_id = this.data.shopId); // 店铺id
    let params = {
      payment_type: 14,       // 付款方式(14 微信小程序 )，30 卡激活购买
      pids: pids,
      client_id: getApp().globalData.client_id,// 客户端唯一编号
      extra: extra
    };
    ajax(pay, { data: params, method: 'POST',failToast: false }).then(res => {
      if (res.code === 0) {
        let _this = this;
        // 订单是否已支付成功 若为true则意为已完成支付而无需后续支付流程  主要用于免费内容
        if (!res.data.complete) {
          wx.requestPayment({
            timeStamp: res.data.params.timeStamp,
            nonceStr: res.data.params.nonceStr,
            package: res.data.params.package,
            signType: res.data.params.signType,
            paySign: res.data.params.paySign,
            success: () => {
              _this.getPayStatus(res.data.orderId);
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
          _this.getPayStatus(res.data.orderId);
        }
      } else {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    });
  },
  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.status === 2) { 
          console.log('支付成功');
          wx.showToast({
            title: '支付成功',
            icon: 'none',
            duration: 1500,
            mask: true
          });
          setTimeout(() => {
            if (this.data.mode === 1) {
              wx.redirectTo({
                url: '/pages/saleLogin/saleLogin?mode=2',
              });
            } else if (this.data.mode === 2) {
              // ajax(userinfo, {}, 'get').then(res => {
              // if (res.code === 0) {
              // wx.setStorageSync('userinfo', res.data);
              wx.navigateBack({
                delta: 1
              });
              // }
              // });
            } else {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          }, 1500);
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  /**
       * 生命周期函数--监听页面初次渲染完成
       */
  onReady: function () {
    
  },
    
  /**
       * 生命周期函数--监听页面显示
       */
  onShow: function () {
    
  },
    
  /**
       * 生命周期函数--监听页面隐藏
       */
  onHide: function () {
    
  },
    
  /**
       * 生命周期函数--监听页面卸载
       */
  onUnload: function () {
    
  },
    
  /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
  onPullDownRefresh: function () {
    
  },
    
  /**
       * 页面上拉触底事件的处理函数
       */
  onReachBottom: function () {
    
  }
});