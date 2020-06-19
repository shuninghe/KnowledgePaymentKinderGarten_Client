const { getHelpDetail, giveFriendHelp, needFriendHelp, userinfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { commonShare } = require('../../utils/common');
let interval = null;
Page({
  data: {
    par_id: '',  //助力编号
    // 倒计时
    countDownDay: '',
    countDownHour: '',
    countDownMinute: '',
    countDownSecond: '',
    mask: false,
    helpInfo: {},
    isAuthorized: false
  },
  // 获取助力详情
  getHelpDetail: function () {
    let params = {
      par_id: this.data.par_id
    };
    console.log(params, 'params');
    ajax(getHelpDetail, {data: params, method: 'get'})
      .then(res => {
        if (res.code == 0) {
          console.log('获取助力详情', res.data);
          wx.hideLoading();   
          let helpInfo = res.data;
          if (helpInfo.selling_price && helpInfo.selling_price < 1000000) {
            helpInfo.selling_price = (helpInfo.selling_price / 100).toFixed(2);
          } else {
            helpInfo.selling_price = helpInfo.selling_price / 100;
          }
          helpInfo.rest = helpInfo.require_num - helpInfo.pals_num;
          let recommendList = res.data.courses_recommended;
          if (!recommendList) {
            return;
          }
          if (recommendList.length) {
            recommendList.forEach((item, index) => {
              if (recommendList[index].selling_price && recommendList[index].selling_price < 1000000) {
                recommendList[index].selling_price = (recommendList[index].selling_price / 100).toFixed(2);
              } else {
                recommendList[index].selling_price = recommendList[index].selling_price / 100;
              }
            });
          }
          this.setData({
            helpInfo: res.data
          });
          this.countDown(); 
          this.openMask(); 
        }
      })
      .catch(err => {
        console.log('err', err);
      }); 
  },

  // 倒计时
  countDown: function () {
    if (interval) clearInterval(interval);
    if(this.data.helpInfo.status == 1) {
      clearInterval(interval);
      this.setData({
        countDownDay: '00',
        countDownHour: '00',
        countDownMinute: '00',
        countDownSecond: '00',
      });
    } else {
      var totalSecond = this.data.helpInfo.end_time / 1000 - this.data.helpInfo.current_time / 1000;
      interval = setInterval(function () {
        // 秒数
        var second = totalSecond;
        // 天数位
        var day = Math.floor(second / 3600 / 24);
        var dayStr = day.toString();
        // 小时位
        var hr = Math.floor((second - day * 3600 * 24) / 3600);
        var hrStr = hr.toString();
        if (hrStr.length == 1) hrStr = '0' + hrStr;

        // 分钟位
        var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
        var minStr = min.toString();
        if (minStr.length == 1) minStr = '0' + minStr;

        // 秒位
        var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
        var secStr = String(Math.round(sec.toString()));
        if (secStr.length == 1) {
          secStr = '0' + secStr;
        }
        this.setData({
          countDownDay: dayStr,
          countDownHour: hrStr,
          countDownMinute: minStr,
          countDownSecond: secStr,
        });
        totalSecond--;
        if (totalSecond < 0) {
          clearInterval(interval);
          this.setData({
            countDownDay: '00',
            countDownHour: '00',
            countDownMinute: '00',
            countDownSecond: '00',
          });
        }
      }.bind(this), 1000);
    }
  },

  // 点击为好友助力
  onGotUserInfo (e) {
    if (e.detail.userInfo) {
      this.setData({
        userPic: e.detail.userInfo.avatarUrl,
        userNickname: e.detail.userInfo.nickName
      });
      this.updateHelpPic().then(() => {
        let params = {
          pal_id: parseInt(this.data.par_id)
        };
        ajax(giveFriendHelp, {data: params, method: 'POST'})
          .then(res => {
            if (res.code == 0) {
              if (res.data.pal_status == 1) {
                wx.showToast({ 
                  title: '该助力已完成',
                  icon: 'none',
                });
              }
              this.getHelpDetail();
            }
          })
          .catch(err => {
            console.log('err', err);
          }); 
      });
    }
    
  },
  // 设置助力人头像
  updateHelpPic() {
    return new Promise((resolve, reject) =>{
      const data = {
        pic: this.data.userPic,
        wx_nick_name: this.data.userNickname
      };
      ajax(userinfo, {data, method: 'PUT',failToast: false}).then(res => {
        if (res.code === 0) {
          resolve();
        } else {
          wx.showToast({
            title: '网络错误，请稍后再试',
            icon: 'none',
            duration: 1500,
          });
          reject();
        }
      }).catch(rep => {
        console.log(rep,'设置失败');
        wx.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none',
          duration: 1500,
        });
        reject();
      });
    });
  },
  // 点击再次发起助力
  openHelp: function () {
    let params = {
      course_id: this.data.helpInfo.course_id,
      uid: wx.getStorageSync('uid')
    };
    ajax(needFriendHelp, {data: params, method: 'POST'})
      .then(res => {
        if (res.code == 0) {
          this.setData({
            par_id: res.data._id,
            countDownDay: '',
            countDownHour: '',
            countDownMinute: '',
            countDownSecond: '',
            helpInfo: {}
          });
          this.getHelpDetail();
        } else {
          wx.showToast({ // 显示Toast
            title: '好友助力活动已过期',
            icon: 'none',
          });
        }
      })
      .catch(err => {
        console.log('err', err);
      }); 
  },
  goHome: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    });
  },

  // 进入课程详情页面
  goDetail: function (e) {
    console.log(e);
    let course_id = e.currentTarget.dataset.courseId;
    wx.navigateTo({
      url: `/pages/courseDetail/courseDetail?id=${course_id}&isHelp=1`,
    });
  },

  openMask() {
    if(this.data.helpInfo.status == 1 && this.data.helpInfo.is_self == 1) {
      setTimeout(() => {
        this.setData({
          mask: true
        });
      }, 1000);
    }
  },

  // 关闭弹框
  closeMask: function () {
    this.setData({
      mask: false
    });
    wx.redirectTo({
      url: '/pages/studyCenter/studyCenter'
    });
  },

  onLoad(options) {
    this.setData({
      par_id: options.par_id - 0
    });
    this.getHelpDetail();
  },
  onReady() {
  },
  onShow() {

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
    return commonShare(
      '我要领取免费学习课程，请求助力！',
      `/pages/friendHelp/friendHelp?par_id=${this.data.par_id}`,
      '/images/friendHelp/share.jpeg',
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
