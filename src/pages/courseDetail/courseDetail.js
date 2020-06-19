const { courseDetail, joinGroup,getData, userinfo, updateRecord, getActivityDetail, checkGroup,creatOrder, groupDetail, needFriendHelp, getShareData, getCourseDynamicList, deleteCourseDynamic, publishCourseDynamic, getRegistrationConfigList, checkSensitiveWord, pay, getPayStatus, packageGoods, getGroupList } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { tree2arr, commonShare ,dealPrice } = require('../../utils/common.js');
const { othersImage } = require('../../utils/images');

let clickTime = 0;
Page({
  data: {
    smallJoin: 1,
    activeTab: 0,
    activityType: null, //营销类型：1拼团、2秒杀、3助力
    product_id: null,   //商品编号
    course_id: null,    //课程id
    pic: '',            //课程封面
    square_course_pic: '',
    name: '',           //课程名字
    sections_num: 0,    //总课时数
    price: null,        //课程价格
    course_detail: '',  //课程详情
    course_resume: '',  //课程简介   【v2.4新增】
    isbuy: null,        //0 未购买(或已过期) 1已购买
    is_series: null,    //是否是系列 0、不是 1、是 ----(全部为课时)
    foruseId: null,     // 第一个试听课id   没有返回0
    studying_num: 0,    // 在学人数
    trees: [],
    type: null,          // 课程类型   0 普通课程 1 vip可查看课程   （新增）
    category: null,     // 课程分类详情   无分类不返回
    categoryBg: othersImage.categoryBg, // 备用默认图
    showPhonePopup: false, // 显示购买绑定手机号弹窗
    showBuyPopup: false, // 显示未购买提示弹窗
    isShowBottomPrice: true,
    showList: [],          // 系列展开状态 
    isShowMask: false,     // 是否显示遮盖层
    dynamicList: [],  // 评价列表
    contentValue: '', // input框的值
    iosConfig: false, // ios的报名配置
    androidConfig: false, // android的报名配置
    hasSignUp: false, // 是否报过名
    isHelp: 0, // 是否是助力课程
    pal_assistant: {},  // 助力数据
    helpId: null, // 助力id
    showForuseVideo: false, // 是否显示试听播放器
    foruse_url: null, // 试听播放器视频地址
    vipGoodId: null, // vip商品id
    vipGoodPrice: 0, 
    theme: {
      buttonColorOne: {background: '#ffd456', backcolor: '#282828'},
      buttonColorTwo: {background: '#74b7ff', backcolor: '#fff'},
      themeColorOne: '#ffa300',
      themeColorTwo: '#ffdea8'
    },
    finishList: [],         // 已完成拼团列表
    allPintuanNum: 0,       // 正在拼团总数
    abilityNum: [],         // 可拼团的数量
    allPintuanList: [],     // 全部正在拼团列表（用于轮播，已转为二维数组）
    isShowAssemble: false,  // 是否显示拼团弹窗
    pintuanList: [],        // 正在拼团列表（用于更多分页弹窗）
    pintuanOffset: 0,       // 正在拼团列表偏移量
    noPintuanMore: false,  // 正在拼团列表没有更多
    isCanAllFee: false,  // 是否可以原价购买
    groupData: { // 页面传参
      selectNum: null,
      cloudId: null
    },
    pintuanInfo: {},
    finalFee: null,
    groupfinalFee: null,
    activityInfo: {},
    curPage: 1
  },
  setShowWinwos() {
    if (this.data.isShowAssemble) {
      this.setData({
        isShowAssemble: false,
        noPintuanMore: false
      });
    } else {
      this.setData({ isShowAssemble: true });
    }
  },
  // 获取活动详情
  getActivityDetail() {
    let params = {
      activity_id: this.data.activityId
    };
    ajax(getActivityDetail, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        this.setData({
          activityInfo: res.data,
          groupConfig: res.data.config.group_config,
          finalFee: dealPrice(res.data.price)
        });
      } 
    }).catch(err => {
      wx.showToast({
        title: err.msg,
        icon: 'none',
      });
      this.setData({ activityType: null });
    });
  },
  // 去支付
  handleApply(e) { // btntype: 1原价购买 2加入拼团、去拼团 3创建拼团 4秒杀其他
    console.log(e, 'uuu');
    let btntype = Number(e.currentTarget.dataset.btntype);
    if (btntype === 1) {
      if (!this.data.isCanAllFee) {
        return wx.showToast({
          title: '该商品暂不支持原价购买,快去拼团吧',
          icon: 'none',
          duration: 1500,
        });
      } else {
        let obj = {
          selectNum: null,
          cloudId:null
        };
        this.setData({
          groupData: obj
        });
        this.toPay({pid: this.data.product_id});
      }
    } else if (btntype === 2) {
      let obj = {};
      if (this.data.isShare) {
        obj.selectNum = this.data.pintuanInfo.num;
        obj.cloudId = this.data.cloudId;
      } else {
        obj.selectNum = e.currentTarget.dataset.num;
        obj.cloudId = e.currentTarget.dataset.cloudid;
      }
      this.setData({
        groupData: obj
      });
      this.checkGroupQual().then((res) => {
        if (res.data.status === 3) {
          return wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500,
          });
        } else {
          this.setData({
            groupfinalFee:  this.getSelectGroupPrice() / 100 
          });
          this.judgePhone().then(() => {
            this.createdOrder().then((res) => {
              let fee = this.data.groupfinalFee*100;
              if (this.data.isShare) {
                wx.navigateTo({
                  url:  `/pages/orderPay/orderPay?price=${this.data.price}&atype=${this.data.activityType}&pid=${this.data.product_id}&cloudId=${this.data.cloudId}&selectNum=${this.data.pintuanInfo.num}&actId=${this.data.activityId}&id=${this.data.course_id}&isHeader=${0}&orderId=${res.data.order_id}&name=${this.data.name}&pic=${this.data.pic}&payPrice=${fee}&from=2`
                });
              } else {
                wx.navigateTo({
                  url:  `/pages/orderPay/orderPay?price=${this.data.price}&atype=${this.data.activityType}&pid=${this.data.product_id}&cloudId=${this.data.groupData.cloudId}&selectNum=${this.data.groupData.selectNum}&actId=${this.data.activityId}&id=${this.data.course_id}&isHeader=${0}&orderId=${res.data.order_id}&name=${this.data.name}&pic=${this.data.pic}&payPrice=${fee}&from=2`
                });
              }
            });
          });
          
        }
      });
    } else if (btntype === 3) { //3创建拼团
      this.checkGroupQual().then(() => {
        wx.navigateTo({
          url: `/pages/paymentOrderTwo/paymentOrderTwo?actId=${this.data.activityId}&course_id=${this.data.course_id}&productId=${this.data.product_id}`
        });
      });
    } else { // 秒杀
      this.judgePhone().then(() => {
        let fee = this.data.finalFee*100;
        this.createdOrder().then((res) => {
          wx.navigateTo({
            url: `/pages/orderPay/orderPay?price=${this.data.price}&atype=${this.data.activityType}&pid=${this.data.product_id}&orderId=${res.data.order_id}&atype=${this.data.activityType}&actId=${this.data.activityId}&name=${this.data.name}&pic=${this.data.pic}&payPrice=${fee}&from=2`
          });
          // this.toPay({pid: this.data.product_id});
        });
      });
      
    }
  },
  // 获取选择拼团的价格
  getSelectGroupPrice() {
    let temp = 0;
    this.data.groupConfig.forEach(v => {
      if (v.num.indexOf(this.data.groupData.selectNum) > -1) {
        
        temp = v.activity_price;
      }
    });
    return temp;
  },
  // 创建活动订单
  createdOrder(){
    let cloudId = this.data.cloudId ? this.data.cloudId : this.data.groupData.cloudId ? this.data.groupData.cloudId: '';
    return new Promise((resolve,reject) => {
      let parmas = {
        activityId: Number(this.data.activityId),
        goodsNo: 1001,
        price: cloudId ?this.data.groupfinalFee * 100: this.data.finalFee *100,
        payThrough: 2,
        ip: '',
        goodsType: 5
      };
      cloudId && (parmas.cloudId = Number(cloudId));
      ajax(creatOrder, {data:parmas , method: 'post'}).then(res => {
        if(res.code === 0){
          resolve(res);
        }else{
          wx.showToast({
            title: res.msg
          });
          reject(res);
        }
      }).catch( err=> {
        wx.showToast({
          title: err.msg
        });
        reject(err);
      });
    });
  },
  // 获取拼团详情
  getGroupReslt() {
    ajax(`${groupDetail}/${this.data.cloudId}`, {}).then(res => {
      if (res.code === 0) {
        let { status, end_time, num, surplus_num } = res.data;
        let obj = { status, end_time, num, surplus_num };
        if (res.data.members.length) {
          let list = res.data.members;
          let nullList, newList = [];
          if (res.data.num - res.data.members.length) {
            nullList = new Array(res.data.num - res.data.members.length);
            newList = [...list, ...nullList];
            obj.headpicList = newList;
          } else {
            obj.headpicList = list;
          }
        }
        this.setData({
          pintuanInfo: obj
        });
      }
    });
  },
  // 验证是否有拼团/发起拼团资格
  checkGroupQual() {
    let cloudId = this.data.cloudId ? this.data.cloudId : this.data.groupData.cloudId ? this.data.groupData.cloudId: null;
    return new Promise((resolve, reject) => {
      let params = {
        activityId: this.data.activityId
      };
      cloudId && (params.cloudId = cloudId);
      ajax(checkGroup, {data: params, method: 'post'}).then(res => {
        if (res.code === 0) {
          resolve(res);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1500
          });
          reject();
        }
      }).catch(rep => {
        wx.showToast({
          title: rep.Msg,
          icon: 'none',
          duration: 1500
        });
        reject();
      });
    });
  },
  // 获取拼团列表
  getPintuanList(status = 1, all = 0, type = 1) { // all:1全部 type:0代表重新获取，1代表上拉加载拼接
    typeof status === 'object' && status.constructor === Object ? status = 1 : status; // scroll-view bindscrolltolower事件触发调用方法是第一个参数是事件源对象，防止传值错误
    let params = {
      goodsId: this.data.course_id,                                        
      type: 5,       //商品类型       1标准课时包 2教学课时包  3直播课  4录播课   
      status: status,                //团状态         1一般   2（紧急，已完成）  可选
    };
    const { pintuanOffset } = this.data;
    if (!all) {
      params.limit = 10;
      params.offset = pintuanOffset;
      if (this.data.noPintuanMore) return;
    }
    ajax(getGroupList, {data: params, method: 'get', falseToast: false}).then(res => {
      if (res.code === 0) {
        if (status === 2) {
          this.setData({
            urgent: res.data.urgent,
            finishList: res.data.list.splice(0,20)
          });
        } else {
          this.setData({
            allPintuanNum: res.data.total_num,
          });
          if (!all) {
            const obj = {};
            obj.pintuanOffset = pintuanOffset + 10;
            if (type) {
              const { pintuanList: arr } = this.data;
              obj.pintuanList = [...arr, ...res.data.list];
              obj.noPintuanMore = res.data.total_num > obj.pintuanOffset ? false : true;
            } else {
              obj.pintuanList = res.data.list;
              obj.noPintuanMore = res.data.total_num >= 10 ? false : true;
            }

            console.log('obj', obj);
            this.setData(obj);
          } else {
            // 转二维数组，用于轮播
            let list = res.data.list;
            let len = list.length;
            let n = 2;
            let lineNum = len % n === 0 ? len / n : Math.floor((len / n) + 1);
            let newList = [];
            for (let i = 0; i < lineNum; i++) {
              let temp = list.slice(i * n, i * n + n);
              newList.push(JSON.parse(JSON.stringify(temp)));
            }
            this.setData({
              allPintuanList: newList,
              pintuanList: res.data.list,
              pintuanOffset: res.data.list.length
            });
          }
        }
      }
    });
  },
  arrTrans(num, arr) { // 一维数组转换为二维数组
    const newArr = [];
    arr.forEach((item, index) => {
      const page = Math.floor(index / num);
      if (!newArr[page]) {
        newArr[page] = [];
      }
      newArr[page].push(item);
    });
    return newArr;
  },
  toSharePost (e) {
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '加载中',
        mask: true,
      });
      let params = {
        pic: e.detail.userInfo.avatarUrl,
        wx_nick_name: e.detail.userInfo.nickName
      };
      ajax(userinfo,{data:params,method:'PUT'}).then(()=>{
        this.getUserInfo();
      });
    }
  },
  // 获取用户数据
  getUserInfo () {
    ajax(userinfo,{failToast: false}).then(res=>{
      if (res.code === 0) {
        wx.hideLoading();
        wx.setStorageSync('userinfo', res.data);
        wx.navigateTo({
          url: `/pages/sharePost/sharePost?activityId=${this.data.activityId}&activityType=${this.data.activityType}`
        });
      }
    });
  },
  // 获取分享数据
  getShareData (log) {
    return new Promise((resolve) => {
      let params = {
        id: log // 分享记录id
      };
      ajax(getShareData, {data: params, method: 'get', falseToast: false}).then(res => {
        if (res.code === 0) {
          this.setData({
            course_id: res.data.data.course_id,
            isHelp: res.data.data.isHelp
          });
          resolve();
        }
      }).catch(err => {
        console.log(err);
        resolve();
        // wx.showToast({
        //   title: res.msg,
        //   icon: 'none'
        // });
      });
    });
  },
  // 发起好友助力
  needFriendHelp () {
    if (this.data.pal_assistant.status === 0) {
      let params = {
        course_id: this.data.course_id
      };
      ajax(needFriendHelp, {data: params, method: 'post'}).then(res => {
        if (res.code === 0) {
          this.setData({
            helpId: res.data._id
          });
          this.goFriendHelp(res.data._id);//助力编号
        }
      });
    } else if (this.data.pal_assistant.status === 1) {
      this.goFriendHelp(this.data.helpId);
    } else {
      this.judgeBindPhone(1);
    }
  },
  // 好友助力页面 
  goFriendHelp (id) {
    wx.navigateTo({
      url: `../friendHelp/friendHelp?par_id=${id}`,
    });
  },

  // 切换tab
  changeTab (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index
    });
  },
  // 跳转至目录章节页
  toTreeList (e) {
    let tree = e.currentTarget.dataset.tree;
    wx.setStorageSync('section_id', tree.section_id);
    wx.setStorageSync(`tree_${tree.section_id}`, {
      section_name: tree.section_name,
      child_trees: tree.child_trees
    });
    let list = new Array();
    list.push(tree.section_id);
    wx.setStorageSync('section_id_list', list);
    let { product_id, course_id, name, pic, course_resume, price, isbuy } = this.data;
    wx.setStorageSync('courseInfo', {
      product_id, course_id, name, pic, course_resume, price, isbuy
    });
    wx.navigateTo({
      url: `/pages/treeList/treeList?section_id=${tree.section_id}`
    });
  },
  // 展开、收起
  changeStatus (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      [`showList[${index}]`]: this.data.showList[index] ? 0 : 1
    });
  },
  // 跳转至课程视频页
  toCourseVideo (e) {
    let now = new Date().getTime();
    if (now - clickTime < 500) {
      return;
    } else {
      clickTime = now;
    }
    let sectionId = e.currentTarget.dataset.sectionid;
    if (!sectionId) {
      sectionId = wx.getStorageSync('section_id');
    } 
    let course = e.currentTarget.dataset.course;
    let curPlayId = e.currentTarget.dataset.course.section_id;
    let type = e.currentTarget.dataset.type;
    wx.setStorageSync('curPlayId', parseInt(curPlayId));
    // 强制报名配置
    if (wx.getStorageSync('functionConfig').isForceEnroll) {
      wx.navigateTo({
        url: `/pages/signUpInfo/signUpInfo?id=${this.data.course_id}`
      });
      return;
    }
    if (this.data.isbuy || course.foruse || this.data.type===1&&this.data.vipInfo) {
      if (course.status) {
        wx.navigateTo({
          url: `/pages/courseVideo/courseVideo?course_id=${this.data.course_id}&section_id=${sectionId}&curPlayId=${curPlayId}&fromType=${type}`
        });
      } else {
        wx.showToast({
          title: '资源更新中',
          icon: 'none',
        });
      }
    } else if (!this.data.price) {
      this.setData({ 
        showBuyPopup: true 
      });
    } else {
      let { isIOS, iosConfig, androidConfig, hasSignUp } = this.data;
      /*
       * isIOS：是IOS机型
       * iosConfig：开启IOS报名
       * androidConfig：开启android报名
       * hasSignUp：是否已报名
       */
      if (!hasSignUp && (isIOS && iosConfig || !isIOS && androidConfig)) {
        wx.navigateTo({
          url: `/pages/signUpInfo/signUpInfo?id=${this.data.course_id}`
        });
      // } else if (isIOS && (iosConfig && hasSignUp || !iosConfig)) {
      // } else if (isIOS && !iosConfig) {
      //   wx.navigateTo({
      //     url: '/pages/studyCenter/studyCenter'
      //   });
      } else if (hasSignUp) {
        wx.showToast({
          title: '您已报名成功，请耐心等待客服与您联系，或点击左下角立即咨询客服。',
          icon: 'none'
        });
      } else {
        this.setData({ 
          showBuyPopup: true 
        });
      }
    }
  },
  // 点击封面播放第一个试听课视频
  playForuseVideo () {
    // 强制报名配置
    if (wx.getStorageSync('functionConfig').isForceEnroll) {
      return;
    }
    if (this.data.foruse_url) {
      this.setData({
        showForuseVideo: true
      });
    } else {
      console.log('暂无试听视频');
      return;
    }
  },
  videoEnd () {
    this.setData({
      showForuseVideo: false
    });
  },
  videoError () {
    wx.showToast({
      title: '视频播放出错',
      icon: 'none'
    });
  },
  // 支付成功后加入拼团回调
  joinGroup(id){
    let params = {
      cloudId: id
    };
    return new Promise((resole,reject)=>{
      ajax(joinGroup, { data: params, method: 'POST',failToast: false }).then(res=>{
        if(res.code === 0){
          resole(res);
        }else{
          reject(res);
        }
      });
    }); 
  },
  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.status === 2) { 
          console.log('支付成功');
          // if (this.data.activityType) {
          //   if (this.data.activityType === 1) { // 加入拼团
          //     if (this.data.isShare) {
          //       this.joinGroup(this.data.cloudId);
          //       wx.navigateTo({
          //         url:  `/pages/groupResult/groupResult?cloudId=${this.data.cloudId}&selectNum=${this.data.pintuanInfo.num}&actId=${this.data.activityId}&course_id=${this.data.course_id}&isHeader=${0}&orderId=${orderId}`
          //       });
          //     } else {
          //       this.joinGroup(this.data.groupData.cloudId);
          //       wx.navigateTo({
          //         url:  `/pages/groupResult/groupResult?cloudId=${this.data.groupData.cloudId}&selectNum=${this.data.groupData.selectNum}&actId=${this.data.activityId}&course_id=${this.data.course_id}&isHeader=${0}&orderId=${orderId}`
          //       });
          //     }
          //   } else { //秒杀
          //     wx.navigateTo({
          //       url: `/pages/orderPay/orderPay?orderId=${orderId}&atype=${this.data.activityType}`
          //     });
          //   }
          // } else {
          this.setData({
            isbuy: 1
          });
          // }
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  // 发起支付-调用辅导支付
  toPay (obj) {
    let params = {
      payment_type: 14,
      pids: [{
        pid: +obj.pid || parseInt(this.data.product_id) , //    商品编号
        num: 1, //    购买数量
      }]
      
    };
    if (this.data.activityType) {
      params.discount = (this.data.activityType == 1 ? 2 : (this.data.activityType == 2 ? 3 : 0));
      params.client_id = getApp().globalData.client_id;
      params.goodsType = 5;
      params.extra ={ //  扩展参数可选
        activity:{
          id: this.data.activityId, //活动编号
        },
        buyer_phone: this.data.buyPhone,     // 购买人手机号
      };
    }
    let that = this;
    if (wx.getStorageSync('openId')) {
      ajax(pay, { data: params, method: 'POST' }).then(res => {
        if (res.code === 0) {
          // 订单是否已支付成功 若为true则意为已完成支付而无需后续支付流程  主要用于免费内容
          if (!res.data.complete) {
            wx.requestPayment({
              timeStamp: res.data.params.timeStamp,
              nonceStr: res.data.params.nonceStr,
              package: res.data.params.package,
              signType: res.data.params.signType,
              paySign: res.data.params.paySign,
              success: () => {
                that.getPayStatus(res.data.orderId);
              },
              fail: () => {
                wx.hideLoading();
                wx.showToast({
                  title: '支付失败',
                  icon: 'none'
                });
              }
            });
          } else if (res.code === 0 && res.data.complete) {
            this.getPayStatus(res.data.orderId);
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.msg,
            icon: 'none'
          });
        }
      });
    }
  },
  judgePhone() {
    // 获取手机号
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    return new Promise((resolve) => {
      ajax(userinfo, {failToast: false}, 'get').then(res => {
        if (res.code === 0) {
          if (res.data.phone) {
            this.setData({
              buyPhone: res.data.phone
            });
            wx.setStorageSync('userinfo', res.data);
            resolve();
          } else {
            wx.login({
              success:(res)=> {
                wx.setStorageSync('loginCode', res.code);
                this.setData({ 
                  showPhonePopup: true 
                });
              }
            });        
          }
        }
        wx.hideLoading();
      });
    });
    
  },
  // 判断是否已绑定手机号-获取个人信息
  judgeBindPhone (type) {
    if (this.data.flag) return;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({ flag: true });
    ajax(userinfo, {failToast: false}, 'get').then(res => {
      if (res.code === 0) {
        setTimeout(() => {
          this.setData({ flag: false });          
        }, 500);
        if (res.data.phone) {
          let { product_id, course_id, name, price, pic } = this.data;
          if (price) {
            wx.hideLoading();
            // 跳转至订单详情页
            if (type === 1) {
              wx.navigateTo({
                url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${this.data.pic}&payPrice=${this.data.pal_assistant.price}&from=2&isHelp=1`
              });
            } else {
              wx.navigateTo({
                url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${this.data.pic}&payPrice=${price}&from=2`
              });
            }
          } else {
            // 0元立即学习隐式支付
            let obj = {
              pid: product_id,
              id: course_id,
              name: name,
              pic: pic,
              payPrice: price,
              from: 2 
            };
            this.toPay(obj);
          }
        } else {
          wx.hideLoading();
          let _this = this;
          wx.login({
            success (res) {
              wx.setStorageSync('loginCode', res.code);
              _this.setData({ 
                showPhonePopup: true 
              });
            }
          });        
        }
      }
    });
  },
  // 一键获取手机号
  getWxPhone() {
    this.setData({ 
      showPhonePopup: false 
    });
    if (!this.data.activityType) {
      // 0元立即学习隐式支付
      if (!this.data.price) {
        this.setData({
          showBuyPopup: true
        });
        return;
      }
      let { product_id, course_id, name, price } = this.data;
      // 跳转至订单详情页
      wx.navigateTo({
        url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${this.data.pic}&payPrice=${price}&from=2`
      });
    }
    
  },
  // 绑定其他手机号
  toBindPhone() {
    this.setData({ 
      showPhonePopup: false 
    });
    wx.navigateTo({
      url: '/pages/bindPhone/bindPhone'
    });
  },
  // 关闭购买绑定手机号弹窗
  closePhonePopup () {
    this.setData({ 
      showPhonePopup: false 
    });
  },
  // 确认购买
  confirmBuy() {
    this.setData({ 
      showBuyPopup: false 
    });
    this.judgeBindPhone();
  },
  // 取消购买
  cancelBuy() {
    this.setData({ 
      showBuyPopup: false 
    });
  },
  // 处理目录数据
  handleTrees (isUpdata) {
    // 判断是否是【最后一级系列】 - 数组添加标识 hasCourse
    let trees = this.data.trees;
    let showList = this.data.showList;
    trees.forEach(item => {
      let hasCourse = 0;
      if (item.is_series) {
        if (item.child_trees.length) {
          item.child_trees.forEach(i => {
            if (i.is_series === 0) {
              hasCourse = 1;
            }
          });
        } else {
          hasCourse = 1;
        }
      }
      item.hasCourse = hasCourse;
      if (!isUpdata) {
        showList.push(0);
      } 
    });
    this.setData({ trees, showList });
    // 默认展开第一个【最后一级系列】
    let index = trees.findIndex(item => {
      return item.hasCourse === 1;
    });
    if (index > -1 && !isUpdata) { // 若找不到，返回的index为-1
      this.setData({
        [`showList[${index}]`]: 1
      });
    }
  },
  // 获取课程详情
  getCourseDetail (isUpdata = false) {
    let params = {
      course_id: this.data.course_id, //课程id
      type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
    };
    ajax(courseDetail, {data: params}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        let { product_id, pic, square_course_pic,  name, sections_num, price, course_detail, course_resume, isbuy, is_series, trees, type, validity, foruseId, studying_num } = res.data;
        this.setData({
          product_id, pic, square_course_pic, name, sections_num, price, course_detail, course_resume, is_series, trees, type, foruseId, studying_num,
          isbuy: isbuy ? (validity < Date.parse(new Date()) ? 0 : 1) : 0,
          category: res.data.category || null
        });
        if (this.data.activityType) {
          this.postVisitRecord();
          this.getActivityDetail();
        }
        if (!isUpdata && this.data.activityType === 1) {
          
          if (!this.data.isShare) {
            this.getPintuanList(1, 1);
            this.getPintuanList(1,0,0);
          } else {
            this.getGroupReslt();
          }
          
        }
        // 缓存海报数据
        wx.setStorageSync('postData', {
          pic, name, 
          isHelp: this.data.isHelp,
          course_id: this.data.course_id
        });
        this.handleTrees(isUpdata);
        // 课程下无系列直接是课时
        if (!is_series) {
          let { course_id } = this.data;
          wx.setStorageSync('courseInfo', {
            product_id, course_id, name, pic, course_resume, price, 
            isbuy: this.data.isbuy
          });
        }
        // onload进来自动播放
        if (!isUpdata) {
          this.video = wx.createVideoContext('video', this);
          let treeAllData = tree2arr(trees, 'child_trees');
          treeAllData.forEach(item => {
            if (item.status && item.foruse && !item.is_series && item.video_url) {
              this.setData({
                foruse_url: item.video_url
              });
            }
          });
          this.playForuseVideo();
        }
        // 是否报过名
        this.setData({
          pic,
          hasSignUp: res.data.is_signUp,
          pal_assistant: res.data.pal_assistant
        });
        
      }
    }).catch((err) => {
      wx.showToast({
        title: err.msg,
        icon: 'none',
        mask: true,
        duration: 1500,
        success () {
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        }
      });
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
  // 是否显示input的遮盖层
  setInputClass() {
    this.setData({
      isShowMask: true
    });
  },
  // 删除动态
  deleteComment(e) {
    wx.showModal({
      title: '提示',
      content: '确认删除该条评论信息吗',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#999999',
      confirmText: '确定',
      confirmColor: '#79d98b',
      success: (result) => {
        if(result.confirm){
          const data = {
            id: e.currentTarget.dataset.id,
            status: 1,
            type: 2
          };
          ajax(deleteCourseDynamic, {data, method: 'DELETE', failToast:false}).then(res => {
            if (res.code === 0) {
              this.data.dynamicList.splice(e.currentTarget.dataset.index, 1);
              this.setData({
                dynamicList: this.data.dynamicList
              });
              wx.showToast({
                title: '删除成功',
                icon: 'none'
              });
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none'
              });
            }
          }).catch(rep => {
            wx.showToast({
              title: rep.msg,
              icon: 'none'
            });
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 发表动态
  publishDynamic() {
    if (!this.data.contentValue.trim()) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none',
        success: () => {
          this.setData({
            contentValue: this.data.contentValue.trim()
          });
        }
      });
      return;
    } 
    this.checkTxt(this.data.contentValue).then(() => {
      const data = {
        course_id: this.data.course_id,
        content: this.data.contentValue
      };
      ajax(publishCourseDynamic, {data, method: 'POST', failToast: false}).then(res => {
        if (res.code === 0) {
          this.setData({
            contentValue: ''
          });
          wx.showToast({
            title: '发表成功',
            icon: 'none'
          });
          this.getDynamicList();
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
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
  // 检测敏感词
  checkTxt(content) {
    return new Promise((resolve, reject) => {
      const data = {
        content: content,
        type: 1
      };
      ajax(checkSensitiveWord, {data, method: 'POST', failToast: false}).then(res => {
        if (res.code === 0) {
          if (res.data.status !== 1) {
            wx.showToast({
              title: '请不要输入敏感词汇哦',
              icon: 'none',
              duration: 1500
            });
            reject();
          } 
          resolve();
        }
      }).catch(() => {
        wx.showToast({
          title: '请不要输入敏感词汇哦',
          icon: 'none'
        });
        reject();
      });
    });
    
  },
  // 获取动态列表
  getDynamicList(offset = 0) {
    !offset && this.setData({ curPage: 1 });
    const data = {
      course_id: this.data.course_id,
      offset: offset || 0,
      limit: 10
    };
    ajax(getCourseDynamicList, {data, method: 'GET',failToast: false}).then(res => {
      if (res.code === 0) {
        if (offset) {
          let dynamicList = this.data.dynamicList.concat(res.data.dynamic);
          this.setData({
            dynamicList: dynamicList
          });
        } else {
          this.setData({
            dynamicList: res.data.dynamic
          });
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 设置input框的值
  setInputValue(e) {
    this.setData({
      contentValue: e.detail.value
    });
  },
  // 关闭input
  blurInput() {
    this.setData({
      isShowMask: false
    });
  },
  // 获取报名配置
  getConfigList() {
    const data = {
      course_id: this.data.course_id
    };
    ajax(getRegistrationConfigList, {data, method: 'GET',failToast: false}).then(res => {
      if (res.code === 0) {
        if (res.data.Aircraft.length >= 2) {
          this.setData({
            iosConfig: true,
            androidConfig: true
          });
        } else if (res.data.Aircraft.length === 1) {
          if (res.data.Aircraft[0] === 1) {
            this.setData({
              iosConfig: false,
              androidConfig: true
            });
          } else {
            this.setData({
              iosConfig: true,
              androidConfig: false
            });
          }
        } else {
          this.setData({
            iosConfig: false,
            androidConfig: false
          });
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none'
      });
    });
  },
  // 获取vip商品信息
  getVipGoodInfo() {
    const data = {
      pid: this.data.vipGoodId
    };
    ajax(packageGoods, {data, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          vipGoodPrice: (res.data.sell_price / 100).toFixed(2)
        });
      }
    });
  },
  // 购买VIP
  toPaymentOrder () {
    wx.navigateTo({
      url: `/pages/paymentOrder/paymentOrder?pid=${this.data.vipGoodId}&mode=2`,
    });
  },
  // 游览详情
  postVisitRecord() {
    let params = {
      goodsId: this.data.course_id,
      openId: wx.getStorageSync('openId')
    };
    ajax(updateRecord, {data: params, method: 'post', failToast: false}).then(() => {
      console.log('游览详情');
    });

  },

  getData(id) {
    return new Promise((resolve) => {
      let params = {
        id: id
      };
      ajax(getData, {data: params, method: 'get', falseToast: false}).then(res => {
        this.setData({
          activityId: +res.data.info.activityId,
          activityType: +res.data.info.activityType,
          course_id: +res.data.info.id
        });
        resolve();
      });
    });
    
  },
  onLoad(option) {
    console.log(option, 'option-detail');
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    if (option.q) {
      let qrcode_url= decodeURIComponent(option.q);
      this.setData({
        log: this.getQueryString(qrcode_url, 'log')
      });
      console.log(this.data.log, '分享记录log');
      if (this.data.course_id) {
        this.getCourseDetail();
        this.getConfigList();
        this.getDynamicList();
      } else {
        this.getShareData(this.data.log).then(() => {
          this.getCourseDetail();
          this.getConfigList();
          this.getDynamicList();
        });
      }
    } else {
      if (option.qrId) {
        this.setData({
          log: +option.log,
        });
        this.getData(+option.qrId).then(() => {
          if (this.data.course_id) {
            this.getCourseDetail();
            this.getConfigList();
            this.getDynamicList();
          } 
        });
      } else {
        this.setData({
          log: +option.log,
          course_id: parseInt(option.id),
          activityType: +option.activityType===3?0:+option.activityType,
          isHelp: parseInt(option.isHelp) || (parseInt(option.activityType)===3?1:0),
          isShare: option.isShare || null,
          cloudId: +option.cloudId || null,
          activityId: +option.activityId
        });
        this.getCourseDetail();
        this.getConfigList();
        this.getDynamicList();
      }
    }
    // 开启ios虚拟隐藏
    this.setData({
      isIOS: wx.getStorageSync('isIOS'),
      commentConfig: wx.getStorageSync('functionConfig').courseComments,
      vipGoodId: wx.getStorageSync('functionConfig').vipGoodId || null,
      theme: wx.getStorageSync('homeData').theme,
      backPic: wx.getStorageSync('homeData').theme ? wx.getStorageSync('homeData').theme.pic : ''
    });
    if (this.data.vipGoodId) {
      this.getVipGoodInfo();
    }
    // if (this.data.course_id) {
    //   this.getCourseDetail();
    //   this.getConfigList();
    //   this.getDynamicList();
    // } else {
    //   this.getShareData(this.data.log).then(() => {
    //     this.getCourseDetail();
    //     this.getConfigList();
    //     this.getDynamicList();
    //   });
    // }
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    if (this.data.course_id && this.data.showList.length) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      setTimeout(() => {
        this.getCourseDetail(true);
      }, 500); // 异步提交学习记录
    }
    this.setData({
      vipInfo: wx.getStorageSync('userinfo').vipInfo
    });
  },
  onHide() {
    wx.removeStorageSync('loginCode');  
    this.video.pause();
  },
  onUnload() {
    wx.removeStorageSync(`tree_${wx.getStorageSync('section_id')}`);
    // wx.removeStorageSync('section_id');
    wx.removeStorageSync('courseInfo');
    wx.removeStorageSync('curPlayId');
    wx.removeStorageSync('section_id_list');
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    let curPage = this.data.curPage;
    this.getDynamicList(curPage*10);
    this.setData({ curPage: curPage + 1 });
  },
  onShareAppMessage() {
    let { course_id, name, pic, isHelp} = this.data;
    return commonShare(
      name,
      `/pages/courseDetail/courseDetail?id=${course_id}&isHelp=${isHelp?1:0}`,
      pic,
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
