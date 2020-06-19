// 全局app实例
const { settledGarden, userinfo, bindPhoneNumber } = require('../../api.config');
const { ajax } = require('../../utils/util');
let cityPick = require('../../utils/city');
Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    currentIndex: 0, // tab的索引
    multiArray: [],
    multiIndex: [0, 0, 0], // picker的索引
    timer: '', // 定时器
    name: '', // 园所名称
    liable: '', // 负责人
    phone: '', // 手机号
    region: '', // 地区
    address: '', // 详细地址
    position: [], // 经纬度
    studentNum: null, // 学生人数
    teacherNum: null, // 教师人数
    cdk: null, // 园所编码
    currentCity: '北京市 直辖区 东城区', // 当前所在城市
    currentArr: [0,0,0],
    isShowPhoneBtn: true,
    liable_kindergarten: null // 大于0为管理员
  },
  // 切换tab
  changeTab(e) {
    this.setData({
      currentIndex: + e.currentTarget.dataset.index
    });
  },
  // 详细地址
  goAddressDetail() {
    this.setData({
      currentCity: this.data.multiArray[1][this.data.multiIndex[1]].name
    });
    if (this.data.currentCity === '市辖区' || this.data.currentCity === '省直辖县级行政区划' || this.data.currentCity === '县') {
      this.setData({
        currentCity: this.data.multiArray[2][this.data.multiIndex[2]].name
      });
    }
    if (!this.data.currentCity.length) {
      wx.showToast({
        title: '您还没有选择地区～',
        icon: 'none'
      });
      return;
    }
    let city = this.data.currentCity;
    wx.navigateTo({
      url: `../addressDetail/addressDetail?city=${city}&from=2`
    });
  },
  // picker的值发生改变
  bindPickerChange(e) {
    if (JSON.stringify(this.data.currentArr) !== JSON.stringify(e.detail.value)) {
      this.setData({
        currentArr: e.detail.value,
        address: ''
      });
    }
  },
  // 每一列
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    let s, city, areas;
    switch (e.detail.column) {
    case 0:
      s = cityPick.provinces;
      city = cityPick.citys[cityPick.provinces[e.detail.value].id];
      areas = cityPick.areas[city[0].id];
      this.setData({
        multiIndex: [e.detail.value,0,0],
        multiArray: [s, city, areas]
      });
      break;
    case 1:
      s = cityPick.provinces;
      city = cityPick.citys[cityPick.provinces[this.data.multiIndex[0]].id];
      areas = cityPick.areas[city[e.detail.value].id];
      this.setData({
        multiIndex: [this.data.multiIndex[0],e.detail.value,this.data.multiIndex[2]],
        multiArray: [s, this.data.multiArray[1], areas]
      });
      break;
    case 2:
      s = cityPick.provinces;
      city = cityPick.citys[cityPick.provinces[this.data.multiIndex[0]].id];
      areas = cityPick.areas[city[e.detail.value]];
      this.setData({
        multiIndex: [this.data.multiIndex[0], this.data.multiIndex[1], e.detail.value],
        multiArray: [s, city, this.data.multiArray[2]]
      });
      break;

    }
  },
  // 点击入驻
  handleSubmit() {
    if (+this.data.currentIndex) {
      this.handleSettled();
    } else {
      this.checkValue().then(() => {
        this.handleSettled();
      });
    }
  },
  // 园所入驻
  handleSettled() {
    let params;
    if (+this.data.currentIndex === 1) {
      params = {
        type: this.data.type_name === '院校' ? 2 : 1,      // 类型(可选)   1.园所  2.职教      (1.9.5新增)
        cdk: parseInt(this.data.cdk),    // 激活码(可选) 入驻时使用激活码入驻       (1.9.5新增)
      };
    } else {
      params = {
        type: this.data.type_name === '院校' ? 2 : 1,      // 类型(可选)   1.园所  2.职教      (1.9.5新增)
        name: this.data.name,
        liable: this.data.liable,
        phone: this.data.phone,
        region: `${this.data.multiArray[0][this.data.multiIndex[0]].name} ${this.data.multiArray[1][this.data.multiIndex[1]].name} ${this.data.multiArray[2][this.data.multiIndex[2]].name}`,
        address: this.data.address,
        longitude_latitude: this.data.position
      };
      params.header_pic = 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587441309794.0718school.png';
      this.data.studentNum && (params.student_num = +this.data.studentNum);
      this.data.teacherNum && (params.teacher_num = +this.data.teacherNum);
    }
    ajax(settledGarden,{data: params, method: 'POST', failToast: false}).then(res => {
      if (res.code === 0) {
        if (this.data.timer) clearTimeout(this.data.timer);
        wx.showToast({
          title: '入驻成功',
          icon: 'none',
          mask: true
        });
        this.data.timer = setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1500);
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 输入框的值
  handleInput(e) {
    this.setData({
      [ e.currentTarget.dataset.mode ]:e.detail.value
    });
  },
  // 获取用户信息
  getUserInfo() {
    return new Promise(resolve => {
      ajax(userinfo, {failToast: false}).then((res)=>{
        if(res.code === 0){
          wx.setStorageSync('userinfo', res.data);
          this.setData({
            isShowPhoneBtn: res.data.phone ? false: true,
            liable_kindergarten: res.data.liable_kindergarten
          });
          resolve();
        }
      });
    });
  },
  // 获取手机号
  setInformation(e) {
    let _this = this;
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      if (e.detail.iv) {
        wx.checkSession({
          success() {
            let data = {
              code: wx.getStorageSync('signCode'),    //wx.login获取的code
              iv: e.detail.iv,           //加密算法的初始向量
              encrypted_data: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
            };
            ajax(bindPhoneNumber, {data, method: 'POST',failToast: false}).then(res => {
              if (res.code === 0) {
                wx.removeStorageSync('signCode');
                // _this.setData({
                //   isShowPhoneBtn: false
                // });
                _this.handleSubmit();
              }
            });
          },
          fail() {
            console.log('checkSession过期');
          }
        });
      } 
    }
  },
  // 验证
  checkValue() {
    this.setData({
      region: `${this.data.multiArray[0][this.data.multiIndex[0]].name} ${this.data.multiArray[1][this.data.multiIndex[1]].name} ${this.data.multiArray[2][this.data.multiIndex[2]].name}`
    });
    return new Promise((reslove, reject) => {
      let {name, liable, phone, region, address} = this.data;
      if (!(+this.data.currentIndex)) {
        if (!name.replace(' ','').length || !liable.replace(' ','').length || !phone.replace(' ','').length || !region.length || !address.length) {
          wx.showToast({
            title: '必填信息不能为空哦～',
            icon: 'none',
            duration: 1500
          });
          reject();
          return;
          
        }
        const reg = /^(0|86|17951)?(13[0-9]|12[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|14[0-9])[0-9]{8}$/;
        if(phone.replace(/^\s+|\s+$/g,'') === '' || !reg.test(phone.replace(/^\s+|\s+$/g,''))){
          wx.showToast({
            title: '请输入正确的手机号',
            icon: 'none',
            duration: 2000
          });
          reject();
          return;
        }
      }
      
      reslove();
    });
    
  },
  onLoad() {
    wx.login({
      success (reso) {
        wx.setStorageSync('signCode', reso.code);
      }
    });
    let s = cityPick.provinces;
    let city = cityPick.citys[cityPick.provinces[0].id];
    let areas = cityPick.areas[city[0].id];
    this.setData({
      multiArray: [s, city, areas],
      type: getApp().globalData.appName==='沃职教' ? 2:1
    });
    wx.setNavigationBarTitle({
      title: this.data.type_name + '入驻'
    });
    wx.showLoading({
      title: '加载中',
      mask: true
    });
  },
  onReady() {
  },
  onShow() {
    this.getUserInfo().then(() => {
      if (this.data.liable_kindergarten > 0) {
        wx.showToast({
          title: '您已入驻院校',
          icon: 'none',
          duration: 1500,
          mask: true,
          success: () => {
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/kindergarten/kindergarten?from=1&id=${this.data.liable_kindergarten}`
              });
            }, 1500);
          }
        });
      } else {
        wx.hideLoading();
      }
    });
    if (wx.getStorageSync('positionInfo')) {
      this.setData({
        address: wx.getStorageSync('positionInfo').address,
        position: wx.getStorageSync('positionInfo').position,
        longitude_latitude: wx.getStorageSync('positionInfo').position
      });
    }
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
