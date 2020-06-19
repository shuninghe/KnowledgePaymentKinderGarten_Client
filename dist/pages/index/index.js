const { getHelpCourseList, userinfo, divertSubscription, handleCurRole } = require('../../api.config');
const { ajax, getToken, getIndexConfig } = require('../../utils/util');
const { commonShare } = require('../../utils/common.js');

Page({
  data: {
    id: '', // 从支付跳转过来携带id
    selected: null, // tabbar选中type
    color: null,
    selectedColor: null,
    tabBarList: [],
    functionConfig: {},
    homeData: {}, // 首页数据
    tabAdsPostData: {}, // 沃园长数据
    helpCourseList: null // 助力课程
  },
  // 切换tabBar
  changeTab (e) {
    let item;
    if (e.detail.selected) {
      item = this.data.tabBarList.find(item => {
        return item.type === e.detail.selected;
      });
    } else {
      item = e.currentTarget.dataset.item;
    }
    this.setData({
      selected: item.type
    });
    // !机构特殊处理
    wx.setNavigationBarTitle({
      title: item.name === '首页' ? getApp().globalData.appName : item.name
    });
  },
  // 获取助力课程列表
  getHelpCourseList () {
    ajax(getHelpCourseList, {failToast: false}).then(res=>{
      if (res.code === 0) {
        let helpCourseList = [];
        res.data.courses.forEach(item => {
          helpCourseList.push({
            appid: '',
            name: item.course_name,
            pic: item.course_pic,
            skipType: '',
            url: `/pages/courseDetail/courseDetail?id=${item.course_id}&isHelp=1`
          });
        });
        this.setData({ helpCourseList });
      }
    });
  },
  // 获取用户数据
  getUserInfo () {
    return new Promise((resolve) => {
      ajax(userinfo,{failToast: false}).then(res=>{
        if (res.code === 0) {
          wx.setStorageSync('userinfo', res.data);
          // if (!res.data.pic) {
          //   wx.redirectTo({
          //     url: `/pages/authorized/authorized?scene=${1}`,
          //   });
          // } else {
          resolve();
          // }
        }
      });
    });
  },
  // 处理数据
  handleIndexData () {
    // 配置底部tabbar
    let indexMenu = wx.getStorageSync('indexMenu');
    this.setData({
      selected: this.data.selected === null ? indexMenu.menus[0].type : this.data.selected,
      color: indexMenu.color,
      selectedColor: indexMenu.selectedColor,
      tabBarList: indexMenu.menus
    });
    var index = 0;
    if (this.data.selected !== null) {
      let selectedIndex = indexMenu.menus.findIndex(item => {
        return item.type === this.data.selected;
      });
      index = selectedIndex;
    }
    // !机构特殊处理
    wx.setNavigationBarTitle({
      title: indexMenu.menus[index].name === '首页' ? getApp().globalData.appName : indexMenu.menus[index].name
    });
    // 获取数据
    this.setData({
      homeData: wx.getStorageSync('homeData'), // 首页数据
      tabAdsPostData: wx.getStorageSync('tabAdsPostData'), 
    });
  },
  // 获取当前身份 
  getCurRoleInfo () {
    return new Promise(resolve => {
      ajax(handleCurRole, {data: {}, method: 'get'}).then(res => {
        if (res.code === 0) {
          wx.setStorageSync('curRoleInfo', res.data.role);
        }
        resolve();
      });
    });
  },
  // 用户绑定引流公众号
  bindSubscriptionUser (unique_id) {
    let params = {
      unique_id: unique_id       // 公众号后台唯一标识
    };
    ajax(divertSubscription, {data: params, method: 'POST', failToast:false}).then((res) => {
      if (res.Code === 0) {
        console.log('用户绑定引流公众号');
      }
    });
  },
  onLoad(options) {
    console.log('index的options', options);
    wx.setNavigationBarTitle({
      title: getApp().globalData.appName
    });
    // 跳转分享链接-(当前为首页的逻辑)
    // let shareLink = wx.getStorageSync('shareLink');
    // if (shareLink) {
    //   wx.navigateTo({
    //     url: `/${shareLink}`,
    //     success: ()=>{
    //       wx.removeStorageSync('shareLink');
    //     }
    //   });
    // }
    // from 1(知识图谱)/2(课程详情)
    if (+options.from === 1) {
      wx.navigateTo({
        url: `/pages/knowledgeGraph/knowledgeGraph?id=${options.id}`
      });
    } else if (+options.from === 2){
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${options.id}`
      });
    }
    
    // token、引流-(当前为首页的逻辑)
    if (wx.getStorageSync('__token__')) {
      this.getUserInfo().then(() => {
        this.getHelpCourseList();
        if (options.unique_id) {
          this.bindSubscriptionUser(options.unique_id);      
        }
        getIndexConfig().then(() => {
          this.handleIndexData();
          this.setData({
            functionConfig: wx.getStorageSync('functionConfig')
          });
        });
        if (getApp().globalData.appName === '沃家园通') { // todo 隐藏班级模块(除家园通外)
          // this.getCurRoleInfo().then(() => {
          //   if (!options.next) {
          //     if (JSON.stringify(wx.getStorageSync('curRoleInfo')) === '{}') {
          //       wx.reLaunch({
          //         url: '/pages/ClassModule/firstEntry/firstEntry'
          //       });
          //     }
          //   }
          // 选中tabbar
          if (options.selected) {
            this.setData({
              selected: +options.selected
            });
          }
          // });
        } else {
          // 选中tabbar
          if (options.selected) {
            this.setData({
              selected: +options.selected
            });
          }
        }
      });
    } else {
      getToken();
    }
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    setTimeout(() => {
      wx.removeStorageSync(`tree_${wx.getStorageSync('section_id')}`);
      wx.removeStorageSync('section_id');
    }, 500);
    wx.removeStorageSync('courseInfo');
    wx.removeStorageSync('curPlayId');
  },
  onHide() {
    // Do something when page hide.
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff'
    });
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
    return commonShare(
      '',
      `/${getApp().globalData.homePageUrl}`,
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
