const {getActivityDetail, groupDetail, updateRecord} = require('../../api.config');
const { ajax } = require('../../utils/util');
const formatPrice = require('../../utils/common.js').dealPrice;
const { commonShare } = require('../../utils/common');
Page({
  data: {
    pintuanInfo: {},
    name: '',
    coverPic: '',
    sellNum: null,
    activityPrice: null,
    selectNum: null,
    isHeader: 1,
    finallFeel: 0,
    cloudId: null,
    orderId: ''
  },
  goViewOrder() {
    wx.navigateTo({
      url: '/pages/myOrder/myOrder'
    });
  },
  // 提交分享记录
  postVisitRecord() {
    let params = {
      groupId: +this.data.cloudId,
      openId: wx.getStorageSync('openId')
    };
    ajax(updateRecord, {data:params, method: 'POST', failToast: false}).then(() => {
      console.log('提交海报');
    });

  },
  // 获取活动详情
  getActivityDetail() {
    let params = {
      activity_id: +this.data.actId
    };
    ajax(getActivityDetail, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        this.setData({
          name: res.data.course_name,
          coverPic: res.data.course_pic,
          sellNum: res.data.purchase_people,
          groupConfig: res.data.config.group_config,
          activityPrice: this.getSelectGroupPrice(res.data.config.group_config) / 100,
          finallFeel: this.data.isHeader > 0 ? formatPrice(this.getSelectGroupPrice(res.data.config.group_config) - res.data.config.preferential_num): this.getSelectGroupPrice(res.data.config.group_config) / 100
        });
        
      }
    });
  },
  // 获取选择拼团的价格
  getSelectGroupPrice(obj) {
    let temp = 0;
    obj.forEach(v => {
      if (v.num.indexOf(this.data.selectNum) > -1) {
        temp = v.activity_price;
      }
    });
    return temp;
  },
  // 获取拼团详情
  getGroupReslt() {
    ajax(`${groupDetail}/${this.data.cloudId}`, {}).then(res => {
      if (res.code === 0) {
        this.setData({
          loadingFlag: true,
          status: res.data.status,
          endTime: res.data.end_time,
          cloudNum: res.data.num,
          fillNum: res.data.surplus_num,
          id: res.data.goods_id,
          aId: res.data.activity_id,
          atype: res.data.type,
          goodsType: res.data.goods_type,
          type: res.data.goods_type === 3 ? 0 : 1, 
          name: res.data.activity_name
        });
        let { status, end_time, num, surplus_num } = res.data;
        let obj = { status, end_time, num, surplus_num };
        if (res.data.members.length) {
          let list = res.data.members;
          let nullList, newList = [];
          if (res.data.num - res.data.members.length) {
            nullList = new Array(res.data.num - res.data.members.length);
            newList = [...list, ...nullList];
            obj.headpicList = newList;
          } else {
            obj.headpicList = list;
          }
        }
        this.setData({
          pintuanInfo: obj
        });
      }
    });
  },
  onLoad(options) {
    this.setData({
      cloudId: options.cloudId,
      selectNum: options.selectNum,
      actId: options.actId,
      course_id: options.course_id,
      isHeader: +options.isHeader,
      orderId: options.orderId || ''
    });
    this.getActivityDetail();
    this.getGroupReslt();
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
  onShareAppMessage() {
    this.postVisitRecord();
    console.log(`/pages/courseDetail/courseDetail?id=${this.data.course_id}&activityId=${this.data.actId}&cloudId=${this.data.cloudId}&isShare=${1}&activityType=${1}`,'iii');
    return commonShare(
      this.data.name,
      `/pages/courseDetail/courseDetail?id=${this.data.course_id}&activityId=${this.data.actId}&cloudId=${this.data.cloudId}&isShare=${1}&activityType=${1}`,
      '',
      true
    );
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
