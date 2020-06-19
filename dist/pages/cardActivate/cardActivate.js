const {pay} = require('../../api.config');
const {ajax} = require('../../utils/util');
Page({
  data: {
    psw: '',
    timer: ''
  },
  pswinput(e){
    this.setData({
      psw: e.detail.value
    });
  },
  // 激活
  confirm(){
    const data = {
      payment_type: 30,
      extra: {
        code: this.data.psw
      }
    };
    ajax(pay, {data, method: 'post'}).then(res => {
      if (res.code === 0) {
        console.log(res);
        
        if (this.data.timer) clearTimeout(this.data.timer);
        wx.showToast({
          title: '激活成功',
          icon: 'none',
          duration: 1500,
        });
        this.data.timer = setTimeout(() => {
          wx.reLaunch({
            url: '/pages/studyCenter/studyCenter'
          });
        }, 1500);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500,
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none',
        duration: 1500,
      });
    });
  },
  onLoad() {
    // Do some initialize when page load.
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
