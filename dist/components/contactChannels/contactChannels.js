const { contactChannelsIcon, jiGouHomeIcon } = require('../../utils/images');
Component({

  behaviors: [],

  properties: {
    mode: Number, // 0首页1品牌2师资3荣誉4学员5联系
    phone: Number,
    weiXin: String
  },
  data: {
    contactChannelsIcon: contactChannelsIcon,
    jiGouHomeIcon: jiGouHomeIcon
  },

  // 生命周期函数
  created() {},
  attached() {},
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 一键复制事件
    copyBtn: function () {
      let that = this;
      wx.setClipboardData({
        data: that.data.weiXin,
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
    // 查看更多（联系我们）
    toShopInfo () {
      if (this.data.mode===5) {
        return;
      } else {
        wx.navigateTo({
          url: '/pages/ShopPackage/shopInformation/shopInformation?mode=5'
        });
      }
    },
    // 唤起电话
    callPhone () {
      if (this.data.phone) {
        wx.makePhoneCall({
          phoneNumber: this.data.phone + ''
        });
      } else {
        wx.showToast({
          title: '暂无客服电话',
          icon: 'none'
        });
      }
    },
  }

});