// 全局app实例
const { getBonusUserInvite } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    myList: [
      {type: 1, name: '我的同学'},
      {type: 2, name: '我的邀请人'}
    ],
    type: 1, // 顶部所选择的下标，获取我的邀请时所携带的type
    inviteList: [], // 我的邀请列表
  },
  changeTab (e) {
    let type = +e.currentTarget.dataset.type;
    if (type === this.data.type) {
      return; 
    } else {
      this.setData({
        type: type
      });
      this.getBonusUserInvite();
    }
  },
  // 获取我的邀请
  getBonusUserInvite () {
    let data = {
      client_id: getApp().globalData.client_id, //客户端唯一编号
      type: this.data.type // 1 同学  2 我的邀请人  
    };
    ajax(getBonusUserInvite, {data: data}).then(res=>{
      if (res.code === 0) {
        this.setData({
          nameIndex: 0,
          inviteList: res.data.userList,
        });
      }
    });
  },
  onLoad() {
    this.getBonusUserInvite();
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
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
