const { bindPhoneNumber, applySaleman, settledGarden, getLevelList, postPartnerJoin } = require('../../api.config');
const { ajax } = require('../../utils/util');
let cityPick = require('../../utils/city');

Page({
  data: {
    mode: 0, // 0园所入驻、1机构入驻、2合伙人
    logoPic: getApp().globalData.logoPic,
    levelId: null, // 等级id
    liable: '', // 负责人
    phone: '', // 手机号
    name: '', // 园所名称
    region: ['北京市', '直辖区', '东城区'], // 地区
    address: '', // 详细地址
    longitude_latitude: [], // 经纬度
    password: '',       // 密码
    passwordAgain: '',  // 二次密码
    disabled: true,     // 登录、提交按钮禁用状态
    btnLoading: false,  // 登录、提交按钮loading
    multiArray:[],
    multiIndex: [0, 0, 0],
    currentCity: '北京市 直辖区 东城区', // 当前所在城市
    currentArr: [0,0,0], 
    isEdit: false, // 是否是编辑
    parent_id: null,
    parent_name: ''
  },
  // input输入
  inputText (e) {
    var name = e.currentTarget.dataset.name;
    if (name === 'phone') {
      if (e.detail.value.length === 11) {
        let checkedNum = this.checkPhoneNum(e.detail.value);
        if (checkedNum) {
          this.setData({
            [name]: e.detail.value
          });
          this.activeButton();
        }
      }
    } else {
      this.setData({
        [name]: e.detail.value.replace(/\s+/g, '')
      });
    }
    this.activeButton();
  },
  // 一键获取手机号
  getPhoneNumber (e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      if (e.detail.iv) {
        let _this = this;
        wx.checkSession({
          success() {
            let data = {
              code: wx.getStorageSync('loginCode'),    //wx.login获取的code
              iv: e.detail.iv,                         //加密算法的初始向量
              encrypted_data: e.detail.encryptedData,  //包括敏感数据在内的完整用户信息的加密数据
            };
            ajax(bindPhoneNumber, {data, method: 'POST'}).then(res => {
              if (res.code === 0) {
                _this.setData({
                  phone: res.data.phone
                });
                _this.activeButton();
              }
            });
          },
          fail() {
            console.log('checkSession过期');
          }
        });
      } else {
        return false;
      }     
    }
  },
  // 输入手机号
  // inputPhoneNum (e) {
  //   let phone = e.detail.value;
  //   if (phone.length === 11) {
  //     let checkedNum = this.checkPhoneNum(phone);
  //     if (checkedNum) {
  //       this.setData({
  //         phone: phone
  //       });
  //       console.log('phone' + this.data.phone);
  //       this.activeButton();
  //     }
  //   } 
  // },
  // 验证手机号格式
  checkPhoneNum (phone) {
    let str = /^1\d{10}$/;
    if (str.test(phone)) {
      return true;
    } else {
      wx.showToast({
        title: '手机号不正确',
        icon: 'none',
      });
      return false;
    }
  },
  // 选择所在地区
  // bindRegionChange (e) {
  //   this.setData({
  //     region: e.detail.value
  //   });
  //   this.activeButton();
  // },
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
  // 选择器的值发生改变
  bindPickerChange(e) {
    if (JSON.stringify(this.data.currentArr) !== JSON.stringify(e.detail.value)) {
      let { multiArray, multiIndex } = this.data;
      this.setData({
        currentArr: e.detail.value,
        region: [multiArray[0][multiIndex[0]].name,  multiArray[1][multiIndex[1]].name, multiArray[2][multiIndex[2]].name]
      });
      this.setData({
        address: ''
      });
    }
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
      url: `/pages/addressDetail/addressDetail?city=${city}&from=1`
    });
  },
  // 验证
  checkValue() {
    return new Promise((resolve, reject) => {
      let { mode, liable, phone, name, region, address } = this.data;
      if (mode === 1) {
        if (!(liable && phone && name && region && address)) {
          wx.showToast({
            title: '必填信息不能为空哦～',
            icon: 'none'
          });
          reject();
          return;    
        }
      }
      if (mode === 2) {
        if (!(liable && phone && region)) {
          wx.showToast({
            title: '必填信息不能为空哦～',
            icon: 'none'
          });
          reject();
          return;    
        }
      }
      resolve();
    });
  },
  // 点击提交
  handleSubmit () {
    this.checkValue().then(() => {
      let { mode, liable, phone, name, region, parent_id } = this.data;
      let params = {
        name: liable,               // 加盟商名称
        phone: phone,              // 手机号
        role: mode===1?3:2,                  // 角色   1.创始人  2.合伙人  3.机构
        parent_id: parent_id,             // 父级商户id   0为1级创始人
        region: region.join(' '),             // 地区
        organization_name: name,  // 机构名称
        regions:{                 
          province:region[0],        // 省
          city:region[1],            // 城市
          county:region[2]           // 县
        },
        latitude: this.data.longitude_latitude[1],     // 纬度
        longitude: this.data.longitude_latitude[0],   // 经度
      };
      ajax(postPartnerJoin, {data: params, method: 'POST', failToast: false}).then(res => {
        if (res.code === 0) {
          // wx.showToast({
          //   title: '申请成功，需1～3个工作日进行审核',
          //   icon: 'none',
          //   duration: 1500,
          // });
          // setTimeout(() => {
          //   wx.reLaunch({
          //     url: '/pages/index/index'
          //   });
          // }, 1500);
          wx.redirectTo({
            url: `/pages/settledSucces/settledSucces?mode=${this.data.mode}`,
          });
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
      });
    });
  },
  // 按钮
  activeButton () {
    let {liable, phone, name, region, address, password, passwordAgain} = this.data;
    this.setData({
      disabled: !(liable&&phone&&name&&region.length&&address&&password&&passwordAgain)
    });
  },
  // 登录、提交
  onSubmit () {
    this.setData({
      btnLoading: true
    });
    let {password, passwordAgain} = this.data;
    if (password !== passwordAgain) {
      wx.showToast({
        title: '二次密码输入不一样',
        icon: 'none'
      });
      this.setData({
        btnLoading: false
      });
    } else if (password.length < 6) {
      wx.showToast({
        title: '密码最少设置6位',
        icon: 'none'
      });
      this.setData({
        btnLoading: false
      });
    } else {
      this.handleSettled();
    }
  },
  // 园所入驻
  handleSettled() {
    let params = {
      type: 1,      // 类型(可选)   1.园所  2.职教      (1.9.5新增)
      name: this.data.name,
      liable: this.data.liable,
      phone: this.data.phone,
      region: this.data.region.join(''),
      address: this.data.address,
      longitude_latitude: this.data.longitude_latitude
    };
    ajax(settledGarden,{data: params, method: 'POST', failToast: false}).then(res => {
      if (res.code === 0) {
        this.applySaleman().then(() => {
          wx.redirectTo({
            url: `/pages/settledSucces/settledSucces?cdk=${res.data.cdk}`,
          }); 
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 获取分销等级列表
  getLevelList () {
    ajax(getLevelList, {data: {}, method: 'GET'}).then(res => {
      if (res.code === 0) {
        res.data.list.forEach(item => {
          if (item.name === '园长') {
            this.setData({
              levelId: item.id
            });
          }
        });
      }
    });
  },
  // 申请分销员
  applySaleman () {
    return new Promise((resolve) => {
      let params = {
        client_id: getApp().globalData.client_id,
        userName: this.data.liable,        // 姓名
        phone: this.data.phone,           // 手机号
        level_id: this.data.levelId,         // 等级id
        password: this.data.password,         // 初始密码 （选填） 
        type: 2,
      };
      ajax(applySaleman, {data: params, method: 'POST'}).then(res=>{
        if (res.code === 0) {
          if (res.data.status === 1) { //todo 分销身份审核
            wx.showToast({
              title: '申请成功，需1～3个工作日进行审核',
              icon: 'none',
              duration: 1500,
            });
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              });
            }, 1500);
          } else if (res.data.status === 2) {
            resolve();
            // wx.redirectTo({
            //   url: '/pages/saleLogin/saleLogin?mode=1',
            // });
          }
        }
      });
    });
  },
  onLoad(options) {
    let s = cityPick.provinces;
    let city = cityPick.citys[cityPick.provinces[0].id];
    let areas = cityPick.areas[city[0].id];
    this.setData({
      multiArray: [s, city, areas]
    });
    if (+options.mode === 1) {
      wx.setNavigationBarTitle({
        title: '机构信息填写'
      });
      this.setData({
        mode: +options.mode,
        parent_id: +options.parent_id
      });
    } else if (+options.mode === 2) {
      wx.setNavigationBarTitle({
        title: '联合发起人信息填写'
      });
      this.setData({
        mode: +options.mode,
        parent_id: +options.parent_id,
        parent_name: options.parent_name || ''
      });
    } else {
      wx.setNavigationBarTitle({
        title: '园所入驻'
      });
      this.getLevelList();
    }
    wx.login({
      success (res) {
        wx.setStorageSync('loginCode', res.code);
      }
    });
  },
  onReady() {
    // Do something when page ready.
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
    // Do something when page hide.
  },
  onUnload() {
    wx.removeStorageSync('baseInfo');
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
