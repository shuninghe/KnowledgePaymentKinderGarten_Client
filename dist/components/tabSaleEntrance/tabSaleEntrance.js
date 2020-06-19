const { getLevelInfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
Component({

  behaviors: [],

  properties: {},
  data: {
    imgs: [
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/huixue/huixue_sale.png',
    ],
    type: 1, // 1代理商入口
    pid: '', // 打包商品id
    animationData: null
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      pid: wx.getStorageSync('functionConfig').packageId
    });
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
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
            url: `/pages/paymentOrder/paymentOrder?pid=${this.data.pid}`,
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
  }

});

