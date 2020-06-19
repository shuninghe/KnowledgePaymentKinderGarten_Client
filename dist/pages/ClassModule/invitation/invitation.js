const { postTeacher, postParent, getRelationList, getUserBaby, handleCurRole } = require('../../../api.config');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    role: null,         // 1老师 2家长
    class_id: null,     // 班级id
    class_name: '',     // 班级名字
    relations: [],      // 亲属关系列表
    userBabyList: [],   // 该家长下所有宝宝
    classUserBaby: [],  // 该家长下在该班级的宝宝
    canChooseBaby: [],  // 该家长下不再该班级的宝宝（picker）
    relationIndex: null,// 亲属picker起始下标
    teacherName: '',    // 老师名字
    babyList: [{
      name: '', 
      relation_id: null 
    }]
  },
  onLoad(options) {
    this.setData({
      role: +options.role,
      class_id: +options.class_id,
      class_name: options.class_name
    });
  },
  // 获取该家长下所有宝宝信息
  getUserBaby (id) {
    return new Promise((resolve) => {
      let params = {
        class_id: id
      };
      ajax(getUserBaby, {
        data: id ? params : {}, 
        method: 'get'
      }).then(res => {
        if (res.code === 0) {
          if (id) {
            this.setData({
              classUserBaby: res.data.babys
            });
          } else {
            this.setData({
              userBabyList: res.data.babys
            });
          }
          resolve();
        }
      });
    });
  },
  // 获取亲属关系列表
  getRelationList () {
    ajax(getRelationList, {data: {}, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          relations: res.data.relations
        });
      }
    });
  },
  // input输入
  inputText (e) {
    let name = e.currentTarget.dataset.name;
    this.setData({
      [name]: e.detail.value.replace(/\s+/g, '')
    });
    var reg = new RegExp(/^babyList\[\d+(\]\.name)$/);
    if (reg.test(name)) {
      // let value = e.detail.value.replace(/\s+/g, '');
      // if (!value) {
      let setName = name.replace(/\.name/, '.relation_id');
      this.setData({
        [setName]: null
      });
      // }
    }
  },
  // 选择宝宝
  pickerChooseBaby (e) {
    let chooseBaby = this.data.canChooseBaby[+e.detail.value];
    let index = this.data.babyList.findIndex(item => {
      return item.name === '';
    });
    if (index > -1) {
      if (index === 0) {
        this.setData({
          relationIndex: this.data.relations.findIndex(item => {
            return chooseBaby.relation_id === item._id;
          })
        });
      }
      this.setData({
        [`babyList[${index}]`]: {
          name: chooseBaby.name,
          relation_id: chooseBaby.relation_id
        }
      });
    } else {
      this.setData({
        ['babyList[0]']: {
          name: chooseBaby.name,
          relation_id: chooseBaby.relation_id,
          relationIndex: this.data.relations.findIndex(item => {
            return chooseBaby.relation_id === item._id;
          })
        }
      });
    }
  },
  // 选择亲属关系
  pickerRelation (e) {
    let obj = this.data.relations.find((item, index) => {
      return index === +e.detail.value;
    });
    this.setData({
      relationIndex: +e.detail.value,
      ['babyList[0].relation_id']: obj._id
    });
  },
  // 没有rid的宝宝使用一个宝宝的rid
  handleRelation () {
    let babyList = this.data.babyList;
    let rid = babyList[0].relation_id;
    babyList.forEach(item => {
      if (!item.relation_id) {
        item.relation_id = rid;
      }
    });
    this.setData({ babyList });
  },
  // 添加baby
  addBabyBtn () {
    let index = this.data.babyList.findIndex(item => {
      return item.name === '';
    });
    if (index > -1) {
      wx.showToast({
        title: '请输入宝宝姓名',
        icon: 'none'
      });
    } else if (!this.data.babyList[0].relation_id) {
      wx.showToast({
        title: '请选择亲属关系',
        icon: 'none'
      });
    } else {
      this.data.babyList.push({
        name: '', // 宝宝名字
        relation_id: null // 亲属关系id
      });
      this.setData({
        babyList: this.data.babyList
      });
    }
  },
  // 删除多余的孩子
  delMoreBaby (e) {
    let index = +e.currentTarget.dataset.index;
    let babyList = this.data.babyList;
    babyList.splice(index, 1);
    this.setData({
      babyList: babyList
    });
  },
  // 提交信息
  save () {
    if (this.data.role === 1) { // 老师
      let params = {
        class_id: this.data.class_id, 
        name: this.data.teacherName 
      };
      ajax(postTeacher, {data: params, method: 'post', failToast: false}).then(res => {
        if (res.code === 0) {
          wx.reLaunch({
            url: '/pages/index/index?selected=9'
          });
        }
      }).catch(res => {
        if (res.code === 4) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    } else if (this.data.role === 2) {  // 家长
      this.handleRelation();
      let params = {
        class_id: this.data.class_id, 
        babys: this.data.babyList
      };
      ajax(postParent, {data: params, method: 'post', failToast: false}).then(res => {
        console.log(res);
        if (res.code === 0) {
          wx.reLaunch({
            url: '/pages/index/index?selected=9'
          });
        }  
      }).catch(res => {
        if (res.code === 4) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    }
  },
  // 切换角色
  changeCurRole: function(e) {
    let params = {};
    if (this.data.class_id) {
      params.class_user_id = +e.currentTarget.dataset.uid;  // 当有班级的时候传此参数
    } else {
      params.baby_id = this.data.curUserId;        // 宝宝id 无班级时传baby_id
    }
    ajax(handleCurRole, {data: params, method: 'put'}).then(res => {
      if (res.code === 0) {
        this.getCurRoleInfo().then(() => {
          wx.reLaunch({
            url: '../../index/index?selected=9'
          });
        });
      }
    });
  },
  // 获取当前身份 
  getCurRoleInfo () {
    return new Promise((resolve) => {
      ajax(handleCurRole, {data: {}, method: 'get'}).then(res => {
        if (res.code === 0) {
          wx.setStorageSync('curRoleInfo', res.data.role);
          resolve();
        }
      });
    });
  },
  // 编辑
  switchShowEdit () {
    this.setData({
      showEdit: !this.data.showEdit
    });
  },
  // 对象数组相减 arr1-arr2
  subObjArr (arr1, arr2, key) {
    var result_arr = [];
    arr1.forEach(item1 => {
      let index2 = arr2.findIndex(item2 => {
        return item1[key] === item2[key];
      });
      if (index2 === -1) {
        result_arr.push(item1);
      }
    });
    return result_arr;
  },

  onReady() {
    // Do something when page ready.
  },
  onShow() {
    if (this.data.role === 1) {
      wx.setNavigationBarTitle({
        title: '邀请老师'
      });
    } else {
      wx.setNavigationBarTitle({
        title: '邀请家长'
      });
      this.getUserBaby();
      let _this = this;
      Promise.all([
        _this.getUserBaby(),
        _this.getUserBaby(_this.data.class_id)
      ]).then(() => {
        this.setData({
          canChooseBaby: this.subObjArr(_this.data.userBabyList, _this.data.classUserBaby, 'baby_id')
        });
      });
      this.getRelationList();
    }
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
