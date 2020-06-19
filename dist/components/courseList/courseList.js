Component({

  behaviors: [],
  properties: {
    mode: {
      type: Number,
      value: 1 
    },
    showtype: {
      type: Number,
      value: 0,
    },
    name: {
      type: String,
      value: '',
    },
    contentshowtype: {
      type: Number,
      value: 0,
    },
    isHelp: {
      type: Boolean,
      value: false  // 是否是限时优惠
    },
    list: {
      type: Array,
      value: []
    }
  },
  data: {
    classTabIndex: 0,
    borderRadius: 0,
    mode: 0,
    isShow: true
  },
  // 生命周期函数
  created() {},
  attached() {
    let showtype = +this.data.showtype; // 工作区显示方式，1、左右 2、上下
    let contentshowtype = +this.data.contentshowtype; // 内容显示方式 1、滑动 2、平铺
    // console.log(showtype,contentshowtype,this.data.name,'----');
    //  1 带圆角 2 不带圆角只支持单行 3 带圆角最多两行  
    // tab平铺 内容平铺 切 不带圆角只支持单行 
    if(showtype === 1 && contentshowtype === 1){
      this.setData({
        mode:2,
        borderRadius: 0,
      });
    }
    // tab上下 内容平铺  带圆角
    else if(showtype === 2 && contentshowtype === 1){
      this.setData({
        mode: 1,
        borderRadius: 1,
      });
      // tab滑动 内容平铺 带圆角
    }else if(showtype === 1 && contentshowtype === 2){
      this.setData({
        mode: 3,
        borderRadius: 1,
      });
    }
  },
  ready() {
    if (this.data.list.length === 1 && !this.data.list[0].name || this.data.list.length === 1 && this.data.list[0].name === '暂无') {
      this.setData({
        isShow: false
      });
    }
  },
  moved() {},
  detached() {},

  methods: {
    // 单行tab切换
    changeTab(e){
      this.setData({
        classTabIndex: +e.currentTarget.dataset.index,
      });
    },
    // skipType配置跳转 - 首页
    toPage (e) {
      let item = e.currentTarget.dataset.item;
      console.log(e);
      if (+item.skipType===4 || +item.type===2) { // H5
        wx.navigateTo({
          url: `/pages/outHtml/outHtml?url=${item.url}`,
        });
      } else if (+item.skipType===5 || +item.type===1) { // 小程序
        wx.navigateToMiniProgram({
          appId: item.appid || '',
          path: item.url || '',
          extraData: {},
          envVersion: 'release',
        });
      } else if (+item.skipType===8) { // 广告海报
        wx.setStorageSync('adsPostImgs', item.content);
        wx.navigateTo({
          url: `${item.url}?title=${item.name}` || '',
        });
      } else {
        wx.navigateTo({
          url: item.url || '',
        });
      }
    },
  }

});