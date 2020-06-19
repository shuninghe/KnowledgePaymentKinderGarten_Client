const { pushLog, userinfo } = require('../../api.config');
const { ajax, getToken, getIndexConfig } = require('../../utils/util');

Page({
  data: {
    scene: 0, // 0分享邀请逻辑、1首页授权头像 
    mode: 0, // 0家园通、1园所、2职教、3阅读写作、4考证、5机构
    allData: [
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589600737560.0845wjyt_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589601221176.226wjyt_mid.jpg',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589600952503.6394wjyt_bt.jpg',
        'textList': [
          '班级通知、班级相册、学习圈...',
          '你想要的都在这里！'
        ],
        'subtitle': '沃家园通—实现家园美好共育！',
        'color': '#107e7d'
      },
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589602676259.438wys_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589602768399.6406wys_mid.png',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589603016725.8735wys_bt.png',
        'textList': [
          '一日生活、日常教学、游戏活动、环境创设、',
          '进修学习、国培计划、家园共育,应有尽有！'
        ],
        'subtitle': '新教师入园培训、老教师能力提升',
        'color': '#fea718'
      },
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589604282030.8171wzj_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589602768399.6406wys_mid.png',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589604130695.1655wzj_bt.png',
        'textList': [
          '掌上幼儿园 + 全岗位实操课',
          'VR场景化培养方向 + STEAM探究游戏培养方向',
          '为职业院校学前专业提供一站式解决方案！'
        ],
        'subtitle': '一部手机“走进”幼儿园',
        'color': '#fea718'
      },
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589606457880.9202ydxz_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589607331798.4553ydxz_mid.png',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589606487189.4458ydxz_bt.png',
        'textList': [
          '小学、初中、高中',
          '语文+英语阅读全系列课程',
        ],
        'subtitle': '',
        'color': '#3070ce'
      },
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589608433191.706wkz_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589608449886.4026wkz_mid.png',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589608464483.9238wkz_bt.png',
        'textList': [
          '幼儿园全岗位系列认证课程',
        ],
        'subtitle': '',
        'textList2': [
          '早教师、幼儿教师、保育员、园长、',
          '后勤园长、才艺教师、保健医、炊事员、',
          '北师大学前教育专业研究生……'
        ],
        'color': '#51beab'
      },
      {
        'topImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590497144331.2576jigou_top.png',
        'midImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589602768399.6406wys_mid.png',
        'botImg': 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1589604130695.1655wzj_bt.png',
        'textList': [
          '为了给您提供更好的服务',
          '系统需要先获得用户授权',
          '请点击下方【立即授权】'
        ],
        'subtitle': '',
        'color': '#fea718'
      },
    ],
    url: '', // 分享跳转地址
    logId: null
  },
  pushShareLog() {
    let param = {
      log_id: this.data.logId
    };
    ajax(pushLog, {data: param, method: 'delete', failToast: false}).then(res=>{
      if (res.code === 0) {
        console.log('提交分享邀请logId');
      }
    });
  },
  getQueryString(url, name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let arr = url.split('?');
    if (arr && arr.length === 2) {
      var r = arr[1].match(reg);
      if (r != null) {
        return r[2];
      }
    }
    return null;
  },
  // 暂不授权
  chooseNext () {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },
  getUserInfo () {
    return new Promise(resolve => {
      ajax(userinfo, {failToast: false}).then(res => { 
        if (res.code === 0) {
          if (res.data.wx_nick_name) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      });
    });
  },
  onGotUserInfo (e) {
    this.getUserInfo().then(flag => {
      if (flag) {
        wx.reLaunch({
          url: this.data.url
        });
      } else {
        if (e.detail.userInfo) {
          wx.showLoading({
            title: '加载中',
            mask: true,
          });
          // 修改个人信息
          let params = {
            pic: e.detail.userInfo.avatarUrl,
            wx_nick_name: e.detail.userInfo.nickName
          };
          ajax(userinfo, {data: params, method:'PUT'}).then(res => {
            wx.hideLoading();
            if (res.code === 0) {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }
          });
        }
      }
    });
    
  },
  onLoad(options) {
    console.log(options, 'option');
    this.setData({
      mode: getApp().globalData.authorizedMode
    });
    if (options.q) {
      let qrcode_url= decodeURIComponent(options.q);
      this.setData({
        url: decodeURIComponent(this.getQueryString(qrcode_url, 'realUrl')),
        logId: +this.getQueryString(qrcode_url, 'logId')
      });
    } else if (+options.scene === 1) {
      this.setData({ scene: +options.scene });
    } else {
      this.setData({
        url: decodeURIComponent(options.realUrl),
        logId: +options.logId
      });
    }
    wx.showLoading({
      title: '加载中...',
      mask: false
    });
    if (wx.getStorageSync('__token__')) {
      this.pushShareLog();
      wx.hideLoading();
    } else {
      getToken(true).then(() => {
        this.pushShareLog();
        getIndexConfig().then(() => {
          wx.hideLoading();
        });
      });
    }
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
