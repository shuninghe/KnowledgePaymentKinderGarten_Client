const { handleCurRole, getDynamDetail,deleteDynamic,publishComment, deleteComment} = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
const { commonShare } =  require('../../../utils/common');
Page({
  data: {
    role: null,             // 1教师 2家长
    class_user_id: null,    // 班级用户id
    dynamic_id: null,       // 动态id
    dynamicDetail: {},      // 动态详情
    is_open: false,         // 是否展开
    activeTab: 0,           // tabs索引
    inputTxt: '',            // 发表评价
  },
  onLoad(option) {
    this.setData({
      dynamic_id: +option.id
    });
    this.getCurRoleInfo();
  },
  // 获取当前身份 
  getCurRoleInfo () {
    ajax(handleCurRole, {data: {}, method: 'get'}).then(res => {
      if (res.code === 0) {
        wx.setStorageSync('curRoleInfo', res.data.role);
        if (JSON.stringify(res.data.role) === '{}') {
          wx.redirectTo({
            url: '/pages/ClassModule/firstEntry/firstEntry'
          });
        } else {
          let role = wx.getStorageSync('curRoleInfo');
          if (!role.class_id)  {
            wx.reLaunch({
              url: '/pages/index/index?selected=9'
            });
          } else {
            this.setData({
              role: role.type,
              class_user_id: role.class_user_id
            }); 
            this.getDynamicDetail();
          }
        }
      }
    });
  },
  // 获取动态详情
  getDynamicDetail () {
    wx.showLoading({
      title: '加载中...'
    }); 
    let params = {
      dynamic_id: this.data.dynamic_id, // 动态id
      class_user_id: this.data.class_user_id  // 班级用户id
    };
    ajax(getDynamDetail, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        wx.hideLoading();
        this.setData({
          dynamicDetail: res.data
        });
      }
    });
  },
  // 删除该通知动态
  delNotice() {
    wx.showModal({
      title: '提示',
      content: '是否要删除该通知动态？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let params = {
            dynamic_id: this.data.dynamic_id // 动态id
          };
          ajax(deleteDynamic, {data: params, method: 'delete'}).then(res => {
            if (res.code === 0) {
              // 跳转到通知tabs页
              wx.reLaunch({
                url: '/pages/index/index?selected=9'
              });
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 删除评论
  delComment(e) {
    let comment_id = +e.currentTarget.dataset.id;
    let index = +e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否要删除该评论？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let params = {
            comment_id: comment_id // 动态id
          };
          ajax(deleteComment, {data: params, method: 'delete'}).then(res => {
            if (res.code === 0) {
              let dynamicDetail = this.data.dynamicDetail;
              dynamicDetail.comment_user.splice(index, 1);
              this.setData({
                dynamicDetail: dynamicDetail
              });
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 点击是否收起
  changeShow() {
    this.setData({
      is_open: !this.data.is_open
    });
  },
  // 教师切换tab
  changeTab (e) {
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      activeTab: index
    });
  },
  // 获取浏览内容
  bindKeyInput: function(e) {
    this.setData({
      inputTxt: e.detail.value
    });
  },
  // 添加评论
  sendMessage() {
    let result = this.data.inputTxt.replace(/(^\s+)|(\s+$)/g, '');
    if (result.length === 0) {
      wx.showToast({
        title: '请输入有效字符',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return;
    }
    let params = {
      class_user_id: this.data.class_user_id,
      dynamic_id: this.data.dynamic_id, // 动态id
      content: result // 留言消息
    };
    ajax(publishComment, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        this.setData({
          inputTxt: ''
        });
        this.getDynamicDetail();
      }
    });
    // let avatar = wx.getStorageSync('userinfo').head_pic;
    // let name = wx.getStorageSync('userinfo').name;
    // console.log(avatar, 'ppp')
    // let url = `${config.api_rootspath.api}/qh_api/course/msg`
    // http.ajax(url, params, 'post').then(res => {
    //   if (res.code === 0) {
    //     let sendMsg = {
    //       msg: this.data.inputTxt,
    //       isOneself: true,
    //       avatar: avatar,
    //       name: name,
    //       ctime: new Date().getTime()
    //     }
    //     console.log(sendMsg)
    //     let mesData = this.data.messagesData
    //     mesData.push(sendMsg)
    //     let sendNum = this.data.sendNum + 1
    //     this.setData({
    //       messagesData: mesData,
    //       sendNum: sendNum,
    //       inputTxt: '',
    //       intoview: 9999 + 200 * sendNum
    //     })
    //   }
    // })
  },
  // 打开图片
  openPhoto(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.dynamicDetail.urls // 需要预览的图片http链接列表
    });
  },
  stopVideo() {
    return false;
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
  onShareAppMessage() {
    return commonShare(
      this.data.dynamicDetail.title,
      `/pages/ClassModule/noticeDetail/noticeDetail?id=${this.data.dynamic_id}`,
      '',
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
