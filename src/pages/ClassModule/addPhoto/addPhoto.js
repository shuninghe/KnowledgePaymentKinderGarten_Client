const {publishPhoto,uploadFile,getAlbmList} = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    role: null,           // 1教师 2家长
    class_id: null,       // 班级id
    content: '',          // 发表内容
    urls: [],             // 图片链接
    uploadUrl: [],        // 上传图片链接
    showMask: false,      // 相册组件
    index: 0,             // 选中的相册index
    value: [0],
    albmList: [],         // 相册列表
    album_id: null,       // 相册id
    type: 1,              // 照片
  },
  onLoad() {
    let role = wx.getStorageSync('curRoleInfo');
    this.setData({
      role: role.type,
      class_id: role.class_id,
    });
    this.getAlbm();
  },
  // 输入文本
  inputValue(e) {
    this.setData({
      content: e.detail.value
    });
  },
  // 获取全部相册
  getAlbm() {
    let params = {
      class_id: this.data.class_id   // 班级id
    };
    ajax(getAlbmList, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          albmList: res.data.albums,
          album_id: res.data.albums[0].album_id
        });
      }
    });
  },
  // 点击添加相册
  uploadAlbm() {
    let num = 20 - this.data.urls.length;
    wx.chooseImage({
      count: num,
      success: res => {
        res.tempFilePaths.reverse().forEach(item => {
          this.data.urls.unshift(item);
        });
        this.setData({
          urls: this.data.urls
        });
      }
    });
  },
  // 删除照片
  delPhoto(e) {
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
          this.data.urls.splice(index, 1);
          this.setData({
            urls: this.data.urls
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 发布照片
  submitPhoto() {
    if(!this.data.urls.length) {
      wx.showToast({
        title: '请添加照片',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要发布照片吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          this.uploadimg(this.data.urls, 0, 0, 0);
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
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    console.log(data,num,uploadFile);
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
          let data = that.data.urls;
          num = num;
          success = success;
          fail = fail;
          that.uploadimg(data, num , success, fail);
        }
      }
    });
  },
  uploadPhoto() {
    let params = {
      urls: this.data.uploadUrl,
      content: this.data.content,
      album_id: this.data.album_id,
      type: 1,
      class_id: this.data.class_id
    };
    ajax(publishPhoto, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 2000
        });
        // 跳转到相册tabs页
        wx.reLaunch({
          url: '/pages/index/index?selected=9'
        });
      }
    });
  },
  // 点击查看大图
  openPhoto(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: this.data.urls // 需要预览的图片http链接列表
    });
  },
  // 打开弹框
  showClick() {
    this.setData({
      showMask: true
    });
  },
  // 保存选择相册数据
  gradeChange(e) {
    this.setData({
      value: e.detail.value
    });
  },
  // 取消弹框
  CancelGrade() {
    this.setData({
      showMask: false,
      value: [this.data.index]
    });
  },
  // 阻止冒泡点击
  stopClick: function () {
    return false;
  },
  // 完成选择相册
  ConfirmGrade() {
    this.setData({
      index: this.data.value[0],
      album_id: this.data.albmList[this.data.value[0]].album_id,
      showMask: false
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
