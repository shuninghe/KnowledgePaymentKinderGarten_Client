// 全局app实例
const { gardenInformation, updateGardenInfo } = require('../../api.config');
const { ajax } = require('../../utils/util');
let cityPick = require('../../utils/city');
Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    multiArray:[],
    multiIndex: [0, 0, 0],
    gardenId: null, // 园所id
    name: '', // 园所名称
    abbreviation: '', // 简称
    liable: '', // 负责人
    phone: '', // 电话
    region: [], // 地区
    address: '', // 详细地址
    position: [], // 经纬度
    studentNum: null, // 学生数
    teacherNum: null, // 老师数
    service: '', // 客服
    servicePhone: '', // 客服电话
    timer: '', // 定时器
    currentCity: '北京市 直辖区 东城区', // 当前所在城市
    currentArr: [0,0,0], 
    isEdit: false // 是否是编辑
  },
  // 获取园所信息
  getGardenInfo() {
    this.setData({
      isEdit: true
    });
    let params = {
      id: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
    };
    this.setData({
      gardenId: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
    });
    ajax(gardenInformation, {data: params}).then(res => {
      if (res.code === 0) {
        let {name, abbreviation, liable, phone, region, address, student_num: studentNum, teacher_num: teacherNum, longitude_latitude:position, customer_service: service, customer_phone: servicePhone} = res.data;
        this.setData({
          name, abbreviation, liable, phone, region, address, studentNum, teacherNum, position, service, servicePhone
        });
        this.setData({
          studentNum: studentNum || null,
          teacherNum: teacherNum || null
        });
      } else {
        wx.showToast({
          title: res,
          icon: 'none',
          duration: 1500
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.Msg,
        icon: 'none',
        duration: 1500
      });
    });
  },
  // 设置input框的值
  handleInput(e) {
    this.setData({
      [ e.currentTarget.dataset.mode ]:e.detail.value
    });
  },
  // 验证
  checkValue() {
    let str = JSON.stringify(this.data.multiIndex);
    if (str !== '[0,0,0]') {
      this.setData({
        region: `${this.data.multiArray[0][this.data.multiIndex[0]].name} ${this.data.multiArray[1][this.data.multiIndex[1]].name} ${this.data.multiArray[2][this.data.multiIndex[2]].name}`
      });
    }
    return new Promise((reslove, reject) => {
      let {name, liable, phone, region, address} = this.data;
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
      reslove();
    });
  },
  // 点击提交
  handleSubmit() {
    this.checkValue().then(() => {
      let params = {
        id: +this.data.gardenId,
        name: this.data.name,
        liable: this.data.liable,
        phone: this.data.phone,
        region: this.data.region,
        address: this.data.address,
        longitude_latitude: this.data.position
      };
      this.data.studentNum && (params.student_num = +this.data.studentNum);
      this.data.teacherNum && (params.teacher_num = +this.data.teacherNum);
      this.data.abbreviation && (params.abbreviation = this.data.abbreviation);
      this.data.service && (params.customer_service = this.data.service);
      this.data.servicePhone && (params.customer_phone = this.data.servicePhone);
      ajax(updateGardenInfo, {data: params, method: 'PUT'}).then(res => {
        if (res.code === 0) {
          if (this.data.timer) clearTimeout(this.data.timer);
          wx.showToast({
            title: '修改成功',
            icon: 'none',
            duration: 1500
          });
          this.data.timer = setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          });
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none',
          duration: 1500
        });
      });
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
      url: `../addressDetail/addressDetail?city=${city}&from=1`
    });
  },
  // 选择器的值发生改变
  bindPickerChange(e) {
    this.setData({
      isEdit: false
    });
    if (JSON.stringify(this.data.currentArr) !== JSON.stringify(e.detail.value)) {
      this.setData({
        currentArr: e.detail.value
      });
      this.setData({
        address: ''
      });
    }
  },
  // 每一列改变
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
  onLoad() {
    let s = cityPick.provinces;
    let city = cityPick.citys[cityPick.provinces[0].id];
    let areas = cityPick.areas[city[0].id];
    this.setData({
      multiArray: [s, city, areas]
    });
    wx.setNavigationBarTitle({
      title: this.data.type_name + '基本信息'
    });
    this.getGardenInfo();
  },
  onReady() {
  },
  onShow() {
    if (wx.getStorageSync('baseInfo')) {
      this.setData({
        address: wx.getStorageSync('baseInfo').address,
        longitude_latitude: wx.getStorageSync('baseInfo').position
      });
    }
  },
  onHide() {
  },
  onUnload() {
    wx.removeStorageSync('baseInfo');
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
