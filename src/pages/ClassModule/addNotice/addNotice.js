const {publishNotic,uploadFile} = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    role: null,           // 1教师 2家长
    class_id: null,       // 班级id
    title: '',            // 标题
    content: '',          // 内容
    pics: [],             // 图片链接数组
    uploadUrl: [], // 上传图片链接
    is_review: 0,         // 是否可回复 0不可 1可以
    is_watch: 1,          // 家长回复互不可见 0不可 1可以
  },
  onLoad() {
    let role = wx.getStorageSync('curRoleInfo');
    this.setData({
      role: role.type,
      class_id: role.class_id,
    });
  },
  // 标题
  inputTitle(e) {
    this.setData({
      title: e.detail.value
    });
  },
  // 内容
  inputContent(e) {
    this.setData({
      content: e.detail.value
    });
  },
  // 点击添加照片
  uploadAlbm() {
    let num = 6 - this.data.pics.length;
    wx.chooseImage({
      count: num,
      success: res => {
        res.tempFilePaths.reverse().forEach(item => {
          this.data.pics.unshift(item);
        });
        this.setData({
          pics: this.data.pics
        });
      }
    });
  },
  // 删除照片
  delPhoto(e) {
    console.log(e);
    let index = +e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否要删除该照片？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.data.pics.splice(index, 1);
          this.setData({
            pics: this.data.pics
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 改变是否需要回复
  changeReview() {
    if(this.data.is_review) {
      this.setData({
        is_review: 0,
        is_watch: 1
      });
    } else {
      this.setData({
        is_review: 1
      });
    }
  },
  // 改变是否家长回复不可见
  changeWatch() {
    if(!this.data.is_review) {
      return;
    }
    if(this.data.is_watch) {
      this.setData({
        is_watch: 0
      });
    } else {
      this.setData({
        is_watch: 1
      });
    }
  },
  // 提交
  submitPhoto() {
    if(!this.data.title) {
      wx.showToast({
        title: '请输入标题',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    if(!this.data.content) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要发布通知吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.uploadimg(this.data.pics, 0, 0, 0);
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 多张图片上传
  /**
   * @param {Array} data: 选取的图片的地址数组
   * @param {Number} num: 图片的索引，在调用方法之前声明
   * @param {Number} success：用来记录上传成功的数目,在调用方法之前声明
   * @param {Number} fail：用来记录上传失败的数目,在调用方法之前声明
   */
  uploadimg(data, num, success, fail){
    if(!data || data.length <= 0) {
      this.uploadPhoto();
      return;
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    let that = this;
    let formData = {
      'useof': 'RES_YSS_IMG',
      'source': 1,
      'file': data[num]
    };
    num = num ? num : 0;
    success = success ? success : 0; // 上传成功的个数
    fail = fail ? fail : 0; // 上传失败的个数
    wx.uploadFile({
      url: uploadFile,
      filePath: data[num],
      name: 'uploadfile_ant',
      formData: formData,
      header: {
        'Content-Type': 'multipart/form-data',
        'accept': 'application/json',
        'apiKey': getApp().globalData.uploadKey,
      },
      success: (res) => {
        let data = JSON.parse(res.data);
        if (data.code === 0) {
          success++;
          this.data.uploadUrl.push(data.data);
        }
        that.setData({
          uploadUrl: that.data.uploadUrl
        });
      },
      fail: () => {
        fail++;
      },
      complete: () => {
        num++; 
        if (num === data.length){   // 上传完
          wx.hideLoading(); 
          this.uploadPhoto(); 
        } else { 
          let data = that.data.pics;
          num = num;
          success = success;
          fail = fail;
          if (data && data.length>0) {
            that.uploadimg(data, num , success, fail);
          }
          
        }
      }
    });
  },
  uploadPhoto() {
    let params = {
      title: this.data.title,
      content: this.data.content,
      pics: this.data.uploadUrl,
      class_id: this.data.class_id,
      is_review: this.data.is_review,
      is_watch: this.data.is_watch
    };
    ajax(publishNotic, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 2000
        });
        // 跳转到通知tabs页
        wx.reLaunch({
          url: '/pages/index/index?selected=9'
        });
      }
    });
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
