const { getLevelInfo, saveShareInfo } = require('../../api.config');
const { ajax, getToken } = require('../../utils/util');
Page({

  /**
     * 页面的初始数据
     */
  data: {
    imgs: [
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/jiayuantong/entry_agrent.png',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/jiayuantong/entry_print.png'
    ],
    type: 1, // 1代理商入口  2园长入口
    pid: '', // 打包商品id
    animationData: null
  },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    this.setData({
      type: +options.type, 
      pid: +options.pid 
    });
    if (wx.getStorageSync('__token__')) {
      if (+options.log_id) {
        this.saveShareInfo(+options.log_id);
      }
    } else {
      getToken();
    }
  },
  showPicture (){
    let animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in',
      delay: 0
    });
    animation.opacity(1).step();
    this.setData({
      animationData: animation.export()
    });
  },
  // 订单支付、园所入驻
  handOpen() {
    this.getLevelInfo().then(() => {
      if (this.data.type === 1) {
        wx.navigateTo({
          url: `/pages/paymentOrder/paymentOrder?pid=${this.data.pid}&mode=1`,
        });
      } else if (this.data.type === 2) {
        wx.navigateTo({
          url: '/pages/gardenEntry/gardenEntry',
        });
      }
    });
  },
  // 获取可申请等级信息
  getLevelInfo () {
    return new Promise(resolve => {
      ajax(getLevelInfo,{data: {}, method:'GET'}).then((res)=>{
        if (res.code === 0) {
          let list = res.data.list;
          let index = list.findIndex(item => {
            return item.status === 2;
          });
          if (index > -1) { // 有身份
            wx.redirectTo({
              url: '/pages/saleLogin/saleLogin?mode=1'
            });
          } else if (list.length) { // 有可申请资格
            if (list[0].status === 1 && list[0].name !== '园长' && this.data.type === 1) {
              wx.redirectTo({
                url: '/pages/saleLogin/saleLogin?mode=2'
              });
            } else {
              resolve();
            }
          } else {
            resolve();
          }
        }
      });
    });
  },
  // 保存邀请信息（用户通过二维码进入小程序时请求）
  saveShareInfo (log) {
    let params = {
      log_id: log,             // 生成的二维码携带
    };
    ajax(saveShareInfo,{data: params, method:'POST'}).then((res)=>{
      if (res.code === 0) {
        console.log('保存邀请信息');
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
    wx.setNavigationBarColor({
      backgroundColor: '#ffffff',
      frontColor: '#000000'
    });
    wx.setNavigationBarTitle({
      title: this.data.type === 1 ? '代理商入口' : '园长入口'
    });
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
  
  },
  
  /**
     * 用户点击右上角分享
     */
  // onShareAppMessage: function () {
    
  // }
});