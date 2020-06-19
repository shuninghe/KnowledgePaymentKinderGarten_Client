const { getConfig } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    classData: [],
    conHeight: null,
    classifyActive: 0,
    navActive: 0,
    lastActive: null,
    contentActive: null,
  },
  //点击导航栏时就可以通过小程序的方法拿到id和该项目的索引，并赋值
  chooseType (e) { //分类选择
    let dataSet = e.currentTarget.dataset;
    this.setData({
      classifyActive: dataSet.i,
      navActive: dataSet.index,
      contentActive: 'type' + dataSet.index
    });
  },
  onScroll (e) {
    const scrollTop = e.detail.scrollTop;
    const scorllArr = this.data.heightArr;
    if (scrollTop >= scorllArr[scorllArr.length - 1 ] - (this.data.conHeight/2)) {
      return;
    } else {
      for (let i=0;i < scorllArr.length; i++) {
        if(scrollTop >= 0 && scrollTop <scorllArr[0]){
          if (0 !== this.data.lastActive) {
            this.setData({
              navActive: 0,
              lastActive:0,
            });
          }
        } else if ( scrollTop >= scorllArr[i-1] && scrollTop <scorllArr[i]) {
          if (i !== this.data.lastActive) {
            this.setData({
              navActive: i,
              lastActive: i,
            });
          }
        }
      }
    }
  },
  // 获取index配置数据
  getIndexConfig(){
    ajax(getConfig, {
      data: {
        version: getApp().globalData.version
      }
    }).then(res => {
      if (res.Code === 0 && res.Data.length > 0) {
        let i = res.Data.findIndex(item => {
          return item.config_name === 'index';
        });
        if (i === -1) {
          wx.showToast({
            title: '首页无数据,请配置数据',
            icon: 'none'
          });
        } else {
          let classData = [];
          let index = 0;
          res.Data[i].config.classAreas.forEach((m, i) => {
            let tab = [];
            m.classify.forEach(n => {
              tab.push({
                name: n.name,
                i: i,
                index: index,
                course: n.course
              });
              index++;
            });
            classData.push({
              name: m.name,
              tab: tab
            });
          });
          this.setData({
            classData
          });
        }
      }
    });
  },
  onLoad() {
    this.getIndexConfig();
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
    //创建节点选择器
    const query = wx.createSelectorQuery();
    //选择id
    query.selectAll('.contlist').boundingClientRect();
    query.exec(function (res) {
      //res就是 所有标签为contlist的元素的信息 的数组
      res[0].forEach((item) => {
        h += item.height;
        heightArr.push(h);
      });
      _this.setData({
        heightArr: heightArr
      });
      console.log('heightArr',heightArr);
    });
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
