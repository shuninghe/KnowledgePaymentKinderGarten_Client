const { getShopInformation, getActivityGood } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { jiGouHomeIcon } = require('../../utils/images');
const Enums = require('../../utils/enum.js');
Component({

  behaviors: [],

  properties: {
    isForceEnroll: {
      type: Boolean,
      value: false
    }, 
    bannerList: {
      type: Array,
      value: []
    }, // banner图数据
    meunShowType: {
      type: Number,
      value: null
    }, // 菜单导航布局
    classifyList: {
      type: Array,
      value: []
    }, // 菜单导航数据
    newList: {
      type: Array,
      value: []
    }, // 广告数据
    classAreasData: {
      type: Array,
      value: []
    }, // 课程配置数据
    activityData: {
      type: Array,
      value: []
    }, // 营销课程配置数据
    moduleInfoCheck: Array,
    classAreasData2: {
      type: Array,
      value: []
    }, // 课程配置数据2
    helpCourseList: {
      type: Array,
      value: []
    } // 限时优惠课程列表
  },
  data: {
    skipTypeList: Enums.skipTypeList,
    activityList: [],
    moduleInfo: [],
    jiGouHomeIcon: jiGouHomeIcon
  },

  // 生命周期函数
  created() {
  },
  attached() {
    this.setData({
      isShowEnter: wx.getStorageSync('functionConfig').isShowEnter
    });
    this.getShopInformation();
  },
  ready() {
    this.getActivityGood();
  },
  moved() {},
  detached() {},

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    // 获取营销活动课程
    getActivityGood () {
      let ids = [];
      this.data.activityData[0].classify[0].course.forEach(item => {
        ids.push(item.id);
      });
      ajax(getActivityGood, {
        data:{
          ids: ids,                     //【可选】商品编号
        },
        method: 'POST'
      }).then(res => {
        if (res.code === 0) {
          let arr = [];
          for (let k in res.data) {
            let item = res.data[k];
            item.id = k;
            arr.push(item);
          }
          this.setData({ activityList: arr });   
        } 
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取店铺宣传信息
    getShopInformation () {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      ajax(getShopInformation, {
        data:{
          client_id: getApp().globalData.client_id,      // (可选)客户端id     小程序使用传递
        }
      }).then(res => {
        wx.hideLoading();
        if (res.Code === 0) {
          this.setData({
            phone: res.Data.service_phone,      // 客服电话
            weiXin: res.Data.wx_mark || '',
            ['moduleInfo[0]']: {
              title: '品牌介绍',
              show: false,
              icon: jiGouHomeIcon.pinpai,
              intro: res.Data.intro,
              video: res.Data.video,
              photoList: res.Data.pics
            },
            ['moduleInfo[1]']: {
              title: '师资力量',
              show: false,
              icon: jiGouHomeIcon.shizi,
              photoList: res.Data.teachers
            },
            ['moduleInfo[2]']: {
              title: '企业荣誉',
              show: false,
              icon: jiGouHomeIcon.rongyu,
              photoList: res.Data.honor
            },
            ['moduleInfo[3]']: {
              title: '学员风采',
              show: false,
              icon: jiGouHomeIcon.xueyuan,
              photoList: res.Data.students
            },
            // ['moduleInfo[4]']: {
            //   title: '联系我们',
            //   show: false,
            //   icon: jiGouHomeIcon.lianxi,
            //   // photoList: res.Data.students
            //   address: res.Data.address,            // 地址
            //   // official_website: string,   // 官网
            //   service_phone: res.Data.service_phone      // 客服电话
            // }
          });
          this.data.moduleInfoCheck.forEach(item => {
            let obj = this.data.moduleInfo[`${+item-1}`];
            obj.show = true;
            this.setData({
              [`moduleInfo[${+item-1}]`]: obj
            });
          });
          let { id, name, abbreviation, shop_pic, shop_intro, liable, phone, wx_mark } = res.Data;
          wx.setStorageSync('shopInfo', {
            id, name, abbreviation, shop_pic, shop_intro, liable, phone, wx_mark
          });
        }
      });
    },
    toShopInfo (e) {
      let mode = +e.currentTarget.dataset.index+1;
      wx.navigateTo({
        url: `/pages/ShopPackage/shopInformation/shopInformation?mode=${mode}`,
      });
    },
    // skipType配置跳转 - 首页
    toPage (e) {
      let item = e.currentTarget.dataset.item;
      if (+item.skipType===4) { // H5
        wx.navigateTo({
          url: `/pages/outHtml/outHtml?url=${item.url}`,
        });
      } else if (+item.skipType===5) { // 小程序
        wx.navigateToMiniProgram({
          appId: item.appid || '',
          path: item.url || '',
          extraData: {},
          envVersion: 'release',
        });
      } else if (+item.skipType===8) { // 广告海报
        wx.setStorageSync('adsPostImgs', item.content);
        wx.navigateTo({
          url: `${item.url}?title=${item.name}` || '',
        });
      } else {
        wx.navigateTo({
          url: item.url || '',
        });
      }
    },
    toAllGame () {
      this.triggerEvent('changeTab', {
        selected: 8
      });
    }
  }

});