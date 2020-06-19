
Component({

  behaviors: [],

  properties: {},
  data: {
    classData: [],
    conHeight: null,
    classifyActive: 0,
    contentActive: null,
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      classData: wx.getStorageSync('homeData').classAreasData
    });
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        _this.setData({
          conHeight: windowHeight - 97,
        });
      }
    });
    // 获得每个元素据顶部的高度，组成一个数组，通过高度与scrollTop的对比来知道目前滑动到那个区域
    let heightArr = [];
    let h = 0;
    // 创建节点选择器
    const query = wx.createSelectorQuery().in(this);
    query.selectAll('.contlist').boundingClientRect();
    query.select('.right-content').boundingClientRect();
    query.exec(function (res) {
      console.log(res);
      res[0].forEach((item) => {
        h += item.height;
        heightArr.push(parseInt(h));
      });
      _this.setData({
        heightArr: heightArr,
        rightHeight: res[1].height
      });
    });
    console.log(this.data);
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // todo获取所有课程
    
    toCourseDetail (e) {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.url}`
      });
    },
    chooseType (e) { //分类选择
      let dataSet = e.currentTarget.dataset;
      this.setData({
        classifyActive: dataSet.index, 
        contentActive: 'type' + dataSet.index
      });
    },
    onScroll (e) {
      const scrollTop = parseInt(e.detail.scrollTop);
      const scorllArr = this.data.heightArr;
      // if (scrollTop >= this.data.rightHeight - this.data.conHeight) {
      //   return;
      // } else {
      for (let i=0;i < scorllArr.length; i++) {
        if (scrollTop < scorllArr[0]) {
          this.setData({
            classifyActive: 0, 
          });
        } else if ( scrollTop >= scorllArr[i] && scrollTop < scorllArr[i+1]) {
          this.setData({
            classifyActive: i + 1, 
          });
        } 
      }
      // }
    },
  }

});