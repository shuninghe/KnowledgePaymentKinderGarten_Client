Component({

  behaviors: [],

  properties: {
    pic: {
      type: String,
      value: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587441141158.7905wyz-map.png'
    },
    positions: {
      type: Array,
      value: []
    }
  },
  data: {},

  // 生命周期函数
  created() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  },
  attached() {},
  ready() {},
  moved() {},
  detached() {},

  methods: {
    showPicture (){
      wx.hideLoading();
    },
    toPage (e) {
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: url
      });
    }
  }

});