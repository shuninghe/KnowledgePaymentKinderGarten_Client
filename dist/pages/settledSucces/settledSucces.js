const { commonShare } = require('../../utils/common');

Page({
  data: {
    cdk: '',
    mode: null
  },
    
  /**
       * 生命周期函数--监听页面加载
       */
  onLoad: function (options) {
    this.setData({
      cdk: +options.cdk,
      mode: +options.mode
    });
  },
  // 一键复制事件
  copyBtn: function () {
    let that = this;
    wx.setClipboardData({
      data: that.data.cdk + '',
      success: function() {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        });
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data); // data
          }
        });
      },
      fail: function(err) {
        console.log(err);
      }
    });
  },
  toSaleLogin () {
    wx.reLaunch({
      url: '/pages/saleLogin/saleLogin?mode=1'
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
    
  },
  onShareAppMessage() {
    return commonShare(
      '这里的亲子游戏真不错！',
      `/pages/ClassModule/editClassInfo/editClassInfo?mode=2&cdk=${this.data.cdk}`,
      getApp().globalData.sharePic,
      true
    );
  },
});