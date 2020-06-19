// 全局app实例
const { getUserInvite, getLevelList } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    myList: [],
    type: null, // 顶部所选择的下标，获取我的邀请时所携带的type
    nameIndex: 0, // 切换二级的下标，所显示的内容
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
      this.getUserInvite();
    }
  },
  nameTab (e) {
    let index = +e.currentTarget.dataset.index;
    if (index === this.data.nameIndex) {
      return; 
    } else {
      this.setData({
        nameIndex: index
      });
    }
  },
  // 获取我的邀请
  getUserInvite () {
    let data = {
      type: this.data.type // 1 我的下级  2我的伙伴  3 我的邀请人  
    };
    ajax(getUserInvite, {data: data}).then(res=>{
      if (res.code === 0) {
        this.setData({
          nameIndex: 0,
          inviteList: res.data.userList,
        });
      }
    });
  },
  // 唤起电话
  call (event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.phone
    });
  },
  // 获取分销等级列表
  getLevelList () {
    return new Promise(resolve => {
      ajax(getLevelList, {data: {}, method: 'GET'}).then(res => {
        if (res.code === 0) {
          let index = res.data.list.findIndex(item => {
            return item.name === '园长';
          });
          if (index > -1) {
            let levelId = wx.getStorageSync('saleManInfo').level_id;
            if (res.data.list[index].id === levelId) {
              this.setData({
                myList: [
                  {type: 3, name: '我的邀请人'}, 
                ],
                type: 3
              });
            } else {
              this.setData({
                myList: [
                  {type: 1, name: '我的下级'},
                  {type: 2, name: '我的伙伴'},
                  {type: 3, name: '我的邀请人'}, 
                ],
                type: 1
              });
            }
          } else {
            this.setData({
              myList: [
                {type: 1, name: '我的下级'},
                {type: 2, name: '我的伙伴'},
                {type: 3, name: '我的邀请人'}, 
              ],
              type: 1
            });
          }
          resolve();
        }
      });
    });
  },
  onLoad() {
    wx.getStorageSync('saleManInfo');
    this.getLevelList().then(() => {
      this.getUserInvite();
    });
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
