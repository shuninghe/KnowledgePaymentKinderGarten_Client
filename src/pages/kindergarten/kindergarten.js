const { getGardenPic, userinfo, gardenInformation, divertSubscription } = require('../../api.config');
const { ajax, getToken, getIndexConfig } = require('../../utils/util');
const { commonShare } = require('../../utils/common');

Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    from: null,  // 1个人中心, 2分享
    isShowManage: false, //是否显示信息管理
    url: ''
  },
  // 点击选项
  handleClick(e) {
    let gardenId = this.data.gardenId;
    switch(+e.currentTarget.dataset.num) {
    case 1:
      wx.navigateTo({
        url: `../gardenIntroduce/gardenIntroduce?gardenId=${gardenId}`
      });
      break;
    case 2:
      if (getApp().globalData.homePageUrl === 'pages/kindergarten/kindergarten') {
        wx.navigateTo({
          url: '../index/index'
        });
      } else {
        wx.reLaunch({
          url: '../index/index'
        });
      }
      break;
    case 3:
      wx.navigateTo({
        url: `../enrollmenList/enrollmenList?gardenId=${gardenId}`
      });
      break;
    case 4:
      wx.navigateTo({
        url: `../gardenTrends/gardenTrends?gardenId=${gardenId}`
      });
      break;
    case 5:
      wx.navigateTo({
        url: `../activityWorks/activityWorks?gardenId=${gardenId}`
      });
      break;
    case 6:
      wx.navigateTo({
        url: `../contactUs/contactUs?gardenId=${gardenId}`
      });
      break;
    case 7:
      wx.navigateTo({
        url: '../infoManage/infoManage'
      });
      break;
    }
  },
  // 获取园所头像
  getGardenPic () {
    return new Promise((resolve,reject) => {
      let data = {
        id: this.data.gardenId
      };
      ajax(getGardenPic, {data, method:'GET', failToast: false}).then(res => {
        if (res.code === 0) {
          this.setData({
            url: res.data.pic || '../../images/school.png'
          });
          resolve();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
          reject();
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
        reject();
      });
    });
  },
  // 获取个人信息
  getUserInfo () {
    return new Promise((resolve,reject) => {
      ajax(userinfo, {failToast:false}).then(res => {
        if (res.code === 0) {
          if (res.data.liable_kindergarten > 0) {
            if (res.data.liable_kindergarten === +this.data.gardenId) {
              this.setData({
                isShowManage: true
              });
              wx.setNavigationBarTitle({
                title: this.data.type_name + '管理'
              });
              resolve();
            } else {
              this.setData({
                isShowManage: false
              });
              wx.setNavigationBarTitle({
                title: this.data.type_name + '首页'
              });
              resolve();
            }
          } else {
            if (res.data.is_liable === 1) {
              this.setData({
                isShowManage: true
              });
              wx.setNavigationBarTitle({
                title: this.data.type_name + '管理'
              });
              resolve();
            } else {
              this.setData({
                isShowManage: false
              });
              wx.setNavigationBarTitle({
                title: this.data.type_name + '首页'
              });
              resolve();
            }
          }
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
        reject();
      });
    });
  },
  // 获取园所信息
  gardenInformation () {
    return new Promise((resolve,reject) => {
      const data = {
        id: this.data.gardenId
      };
      ajax(gardenInformation, {data, method: 'GET', failToast: false}).then(res => {
        if (res.code === 0) {
          this.setData({
            name: res.data.name
          });
          wx.setStorageSync('gardenName', res.data.name);
          resolve();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
          reject();
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
        reject();
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
    console.log(options);
    // 跳转分享链接-(当前为首页的逻辑)
    let shareLink = wx.getStorageSync('shareLink');
    if (shareLink) {
      wx.navigateTo({
        url: `/${shareLink}`,
        success: ()=>{
          wx.removeStorageSync('shareLink');
        }
      });
    }
    if (+options.from === 1) { // 个人中心
      this.setData({
        from: 1,
        isShowManage: true,
        gardenId: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
      });
      wx.setNavigationBarTitle({
        title: this.data.type_name + '管理'
      });
    } else if (+options.from === 2){ //分享
      this.setData({
        from: 2,
        gardenId: options.id
      });
    } else {
      getIndexConfig().then(() => {
        this.setData({
          gardenId: wx.getStorageSync('functionConfig').gardenId
        });
        this.getUserInfo();
        this.gardenInformation();
        this.getGardenPic();
      });
    }
    this.fromOnload = true;
    // token、引流-(当前为首页的逻辑)
    if (wx.getStorageSync('__token__')) {
      if (options.unique_id) {
        this.bindSubscriptionUser(options.unique_id);      
      }
    } else {
      getToken();
    }
  },
  onReady() {
  },
  onShow() {
    console.log('fromOnload', this.fromOnload);
    if (wx.getStorageSync('__token__') && !this.fromOnload) {
      this.getUserInfo();
      this.gardenInformation();
      this.getGardenPic();
    }
  },
  onHide() {
    this.fromOnload = false;
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
