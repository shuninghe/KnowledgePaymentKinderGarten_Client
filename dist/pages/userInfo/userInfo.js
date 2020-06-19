const {userinfo} = require('../../api.config');
const {ajax} = require('../../utils/util');
const {formatTimeTwo} = require('../../utils/common');
Page({
  data: {
    currentIndex: 0, // 当前索引
    sexList: ['男', '女'], // 性别
    occupationList: ['教师', '园长', '保育员'],
    occupationIndex: 0, // 职业
    sexIndex: 0, // 性别索引
    date: '2016-09-01', // 生日日期
    dateEnd: '',
    kindergarten_id: null,
    kindergarten: '', // 园所名字
    phone: '', // 手机
    region: '', // 地区
    nickName: '', // 昵称
    wx_nick_name: '', // 微信昵称
    realName: '', // 真实姓名
    detailedAddress: '', // 详细地址
  },
  // 去绑定园所
  toBindKindergarten(){
    if(this.data.kindergarten_id){
      wx.navigateTo({
        url: `/pages/bindSchool/bindSchool?id=${this.data.kindergarten_id}&name=${this.data.kindergarten}`,
      });
    }else{
      wx.navigateTo({
        url: '/pages/bindSchool/bindSchool'
      });
    }
  },
  // 切换tab
  changeTab(e) {
    this.setData({
      currentIndex: + e.currentTarget.dataset.index
    });
  },
  // 提交 
  confirm() {
    const params = {
      nick_name: this.data.nickName || this.data.wx_nick_name,  // 昵称
      real_name: this.data.realName,  // 真实姓名
      gender: +this.data.sexIndex === 0?1:2,        // 1 男 2 女
      birthday: this.data.date,       // 出生日期
      region: typeof(this.data.region) === 'string' ? this.data.region : this.data.region.join(''),
      address: this.data.detailedAddress,    // 地址
      occupation: this.data.occupationList[this.data.occupationIndex], // 职业 园长 老师
    };
    ajax(userinfo,{data:params,method:'PUT'}).then((res)=>{
      if(res.code === 0){
        wx.reLaunch({
          url: '/pages/index/index?selected=3'
        });
      }
    }).catch(res => {
      wx.showToast({
        title: res.msg,
        icon: 'none',
      });
    });
  },
  // 昵称
  nickinput(e){
    this.setData({
      nickName: e.detail.value
    });
  },
  // 真实姓名
  realinput(e){
    this.setData({
      realName: e.detail.value
    });
  },
  // 地址
  addressinput(e){
    this.setData({
      detailedAddress: e.detail.value
    });
  },
  // 时间绑定
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    });
  },
  // 职业
  bindOccupationPickerChange(e) {
    this.setData({
      occupationIndex: e.detail.value
    });
  },
  // 性别
  bindSexPickerChange(e) {
    this.setData({
      sexIndex: e.detail.value
    });
  },
  // 选择所在地区
  bindRegionChange (e) {
    this.setData({
      region: e.detail.value
    });
  },
  // 获取用户信息
  getUserInfo(flag = 0){
    ajax(userinfo,{failToast: false}).then((res)=>{
      if(res.code === 0){
        if(flag === 0){
          this.setData({
            nickName : res.data.nick_name,  // 昵称
            wx_nick_name : res.data.wx_nick_name,  // 微信昵称
            realName : res.data.real_name,  // 真实姓名
            sexIndex : res.data.gender === 1? 0:1,        // 0未知 1 男 2 女
            date : res.data.birthday,      // 出生日期
            region : res.data.region,     // 地区
            detailedAddress : res.data.address,    // 地址
            occupationIndex : this.data.occupationList.indexOf(res.data.occupation), // 职业 园长 老师
            kindergarten_id : res.data.kindergarten_id,// 园所id
            kindergarten: res.data.kindergarten, // 园所名           
            phone : res.data.phone,  // 手机号
          });
        }else{
          this.setData({
            kindergarten_id : res.data.kindergarten_id,// 园所id
            kindergarten: res.data.kindergarten, // 园所名           
            phone : res.data.phone,  // 手机号
          });
        }
      }
    });
  },
  onLoad() {
    this.setData({
      dateEnd: formatTimeTwo(+Date.parse(new Date()),'Y-M-D'),
    });
    this.getUserInfo();
  },
  onReady() {
  },
  onShow() {
    if(wx.getStorageSync('isRefreshUserInfo')){
      this.getUserInfo(1);
      wx.removeStorageSync('isRefreshUserInfo');
    }
    this.setData({
      isShowBindGarden: wx.getStorageSync('functionConfig').isShowBindGarden
    });
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
