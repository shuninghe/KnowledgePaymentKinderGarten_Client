const { courseDetail, userinfo, needFriendHelp, getShareData, getCourseDynamicList, deleteCourseDynamic, publishCourseDynamic, getRegistrationConfigList, checkSensitiveWord, pay, getPayStatus } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { tree2arr } = require('../../utils/common.js');

Page({
  data: {
    activeTab: 0,
    product_id: null,   //商品编号
    course_id: null,    //课程id
    pic: '',            //课程封面
    name: '',           //课程名字
    sections_num: 0,    //总课时数
    price: null,        //课程价格
    course_detail: '',  //课程详情
    course_resume: '',  //课程简介   【v2.4新增】
    isbuy: null,        //0 未购买(或已过期) 1已购买
    is_series: null,    //是否是系列 0、不是 1、是 ----(全部为课时)
    foruseId: null,     // 第一个试听课id   没有返回0
    trees: [],
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
    foruse_url: null // 试听播放器视频地址
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
        wx.hideLoading();
        wx.setStorageSync('userData', e.detail.userInfo);
        wx.navigateTo({
          url: '/pages/sharePost/sharePost'
        });
      });
    } else {
      // wx.navigateTo({
      //   url: '/pages/sharePost/sharePost'
      // });
    }
  },
  // 获取分享数据
  getShareData (log) {
    return new Promise((resolve, reject) => {
      let params = {
        id: log // 分享记录id
      };
      ajax(getShareData, {data: params, method: 'get'}).then(res => {
        if (res.code === 0) {
          this.setData({
            course_id: res.data.data.course_id,
            isHelp: res.data.data.isHelp
          });
          resolve();
        }
      }).catch(err => {
        reject(err);
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
    if (this.data.isbuy || course.foruse) {
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
      } else if (isIOS && (iosConfig && hasSignUp || !iosConfig)) {
        wx.navigateTo({
          url: '/pages/studyCenter/studyCenter'
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

  // 判断支付状态
  getPayStatus (orderId) {
    ajax(`${getPayStatus}/${orderId}/status`, {}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        if (res.data.status === 2) { 
          console.log('支付成功');
          this.setData({
            isbuy: 1
          });
        } else if (res.data.status === 0) {
          console.log('支付已取消');
        }
      }
    });
  },
  // 发起支付-调用辅导支付
  toPay (obj) {
    let params = {
      payment_type: 14,       // 付款方式(14 微信小程序 )，30 卡激活购买
      pids: [{
        pid: +obj.pid,        // 商品编号
        num: 1                // 购买数量
      }],
      client_id: getApp().globalData.client_id //客户端唯一编号
    };
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
  // 判断是否已绑定手机号-获取个人信息
  judgeBindPhone (type) {
    if (this.data.flag) return; 
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({ flag: true });
    ajax(userinfo, {}, 'get').then(res => {
      if (res.code === 0) {
        setTimeout(() => {
          this.setData({ flag: false });          
        }, 500);
        if (res.data.phone) {
          let { product_id, course_id, name, price } = this.data;
          let pic = escape(this.data.pic);
          if (price) {
            wx.hideLoading();
            // 跳转至订单详情页
            if (type === 1) {
              wx.navigateTo({
                url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${pic}&payPrice=${this.data.pal_assistant.price}&from=2&isHelp=1`
              });
            } else {
              wx.navigateTo({
                url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${pic}&payPrice=${price}&from=2`
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
    // 0元立即学习隐式支付
    if (!this.data.price) {
      this.judgeBindPhone();
      return;
    }
    let { product_id, course_id, name, price } = this.data;
    let pic = escape(this.data.pic);
    // 跳转至订单详情页
    wx.navigateTo({
      url: `/pages/orderPay/orderPay?pid=${product_id}&id=${course_id}&name=${name}&pic=${pic}&payPrice=${price}&from=2`
    });
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
        let { product_id, pic, name, sections_num, price, course_detail, course_resume, isbuy, is_series, trees, validity, foruseId } = res.data;
        this.setData({
          product_id, name, sections_num, price, course_detail, course_resume, is_series, trees, foruseId,
          isbuy: isbuy ? (validity < Date.parse(new Date()) ? 0 : 1) : 0
        });
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
      confirmColor: '#FF9D00',
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
  getDynamicList() {
    const data = {
      course_id: this.data.course_id
    };
    ajax(getCourseDynamicList, {data, method: 'GET',failToast: false}).then(res => {
      if (res.code === 0) {
        this.setData({
          dynamicList: res.data.dynamic
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
  onLoad(option) {
    console.log('option', option);
    if (option.q) {
      let qrcode_url= decodeURIComponent(option.q);
      this.setData({
        log: this.getQueryString(qrcode_url, 'log')
      });
      console.log(this.data.log, '分享记录log');
    } else {
      this.setData({ 
        course_id: parseInt(option.id),
        isHelp: parseInt(option.isHelp)
      });
    }
    // 开启ios虚拟隐藏
    this.setData({
      isIOS: wx.getStorageSync('isIOS'),
      commentConfig: wx.getStorageSync('functionConfig').courseComments
    });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
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
    // Do something when page reach bottom.
  },
  onShareAppMessage() {
    return {
      title: this.data.name,
      path: `/pages/courseDetail/courseDetail?id=${this.data.course_id}&isHelp=${this.data.isHelp}`
    };
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
