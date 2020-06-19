var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    flag: true, // 节流
    timer: '', // 定时器
    region: '', // 市
    timer2: '' // 定时器2
  },
  handleChange() {


  },
  //数据回填方法
  backfill: function (e) {
    if (this.data.timer2) clearTimeout(this.data.timer2);
    var id = e.currentTarget.id;
    for (var i = 0; i < this.data.suggestion.length;i++){
      if (i === +id) {
        this.setData({
          backfill: this.data.suggestion[i].title
        });
        
        let info = {
          address: this.data.suggestion[i].title,
          position: [this.data.suggestion[i].longitude,this.data.suggestion[i].latitude ]
        };
        if (this.data.from === 1) { // 基本信息
          wx.setStorageSync('baseInfo', info);
        } else {
          wx.setStorageSync('positionInfo', info);
        }
        
        this.data.timer2 = setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000);
      }  
    }
  }, 
  handleCancel() {
    this.setData({
      backfill: ''
    });
  },
  //触发关键词输入提示事件
  getsuggest(e) {
    if (this.data.flag) {
      if (this.data.timer) clearTimeout(this.data.timer);
      this.setData({
        flag: false
      });
      var _this = this; 
      qqmapsdk.getSuggestion({
        keyword: e.detail.value, 
        region: this.data.region, 
        success: (res) => {  
          console.log(res,'oooo');
          var sug = [];
          for (var i = 0; i < res.data.length; i++) {
            sug.push({ 
              title: res.data[i].title,
              id: res.data[i].id,
              addr: res.data[i].address,
              city: res.data[i].city,
              district: res.data[i].district,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng
            });
          }
          _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
            suggestion: sug
          });
        },
        fail: (error)=> {
          wx.showToast({
            title: '网络错误，请稍后再试吧',
            icon: 'none',
            duration: 1500,
          });
          console.error(error);
        },
        complete: (rep) =>{
          _this.timer = setTimeout(() => {
            _this.setData({
              flag: true
            });
          },2000);
          console.log(rep);
        }
      });
    } else {
      return;
    }
    
  },
  onLoad(options) {
    qqmapsdk = new QQMapWX({
      key: '65BBZ-YJMKK-ZEJJE-AMRTV-S323K-UHFD4'
    });
    this.setData({
      region: options.city,
      from: +options.from
    });
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
