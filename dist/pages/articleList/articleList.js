const { getArticleClassifyList } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    id: null, // 图文分类id
    activeTab: 0,
    tabsData: null,
    list: null
  },
  // 获取设备宽度
  getSystemWidth () {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowWidth: res.windowWidth
        });
      }
    });
  },
  scroll (e) {
    if (e.detail.scrollLeft > 10) {
      this.setData({ showLeftTip: true });
    } else {
      this.setData({ showLeftTip: false });
    }
    if (e.detail.scrollWidth-this.data.windowWidth-e.detail.scrollLeft <= 10) {
      this.setData({ showRightTip: false });
    } else {
      this.setData({ showRightTip: true });
    }
  },

  // 切换tab
  changeTab (e) {
    let dataset = e.currentTarget.dataset;
    this.setData({
      activeTab: dataset.index,
      list: this.data.tabsData[dataset.index].list
    });
  },

  // 跳转到图文详情
  handleDetail (e) {
    if (+e.currentTarget.dataset.type === 2) {
      wx.navigateTo({
        url: `../outHtml/outHtml?url=${e.currentTarget.dataset.content}`
      });
    } else {
      wx.navigateTo({
        url: `../dynamicDetail/dynamicDetail?id=${e.currentTarget.dataset.id}`
      });
    }
  },
  
  // 获取图文分类列表
  getArticleClassifyList (id) {
    let data = {
      category_id: id
      // limit:int,
      // offset:int,
    };
    ajax(getArticleClassifyList, {data}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.child.length) {
          this.setData({
            tabsData: res.data.child,
            list: res.data.child[0].list
          });
        } else {
          this.setData({
            tabsData: [res.data],
            list: res.data.list
          });
        }
        wx.setNavigationBarTitle({
          title: res.data.name
        });
        if (this.data.tabsData.length > 4) {
          this.setData({
            showRightTip: true
          });
        }
      }
    });
  },
  
  onLoad(option) {
    console.log('option', option);
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.getArticleClassifyList(+option.id);
    this.getSystemWidth();
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
