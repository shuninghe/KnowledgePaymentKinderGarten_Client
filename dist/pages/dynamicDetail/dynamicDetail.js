// 全局app实例
const { getContentDetail } = require('../../api.config.js');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    type: null, // 1招生 2 动态
    dynamicsId: null, // 详情id
    gardenId: null, 
    content: '', // 文章内容
    title: '', // 文章标题
    ctime: null, // 创建时间
    name: ''
  },
  onLoad(options) {
    console.log(options, 'options');
    this.setData({
      type: options.type,
      dynamicsId: options.id,
      gardenId: +options.gardenId,
      name: wx.getStorageSync('gardenName')
    });
    this.getContentDetail();
  },
  // 获取文章详情
  getContentDetail() {
    const data = {
      dynamic_id: this.data.dynamicsId
    };
    if (this.data.type) {
      data.id = this.data.gardenId;
      data.type = this.data.type;
    }
    ajax(getContentDetail, {data}).then(res => {
      if (res.code === 0) {
        let str = this.dealTxt(res.data.detail);
        this.setData({
          content: str,
          title: res.data.name,
          ctime: res.data.ctime
        });
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 富文本处理
  dealTxt(str) {
    str = `<div class="init-content">${str}</div>`;
    str = str.replace(/<p/g,'<p class="init-txt"');
    str = str.replace(/<img/g, '<img ');
    str = str.replace(/<table/g, '<div');
    str = str.replace(/<\/table>/g, '</div>');
    str = str.replace(/<tbody/g, '<div');
    str = str.replace(/<\/tbody>/g, '</div>');
    str = str.replace(/<tr/g, '<span');
    str = str.replace(/<\/tr>/g, '</span>');
    str = str.replace(/<td/g, '<span');
    str = str.replace(/<\/td>/g, '</span>');
    return str;
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
  onShareAppMessage() {
    return commonShare(
      this.data.name,
      `/pages/kindergarten/kindergarten?id=${this.data.gardenId}&from=2`,
      '',
      true
    );
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
