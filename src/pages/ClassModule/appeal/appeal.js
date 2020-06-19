const {pushAppeal,uploadFile} = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    dynamic_id: 1, // 动态id
    urls: [],  // 图片链接数组
    uploadUrl: [], // 上传图片链接
    content: '', // 申诉理由
    showBigpic: false, // 点开大图
    url: '', // 查看大图地址
  },
  onLoad(options) {
    // Do some initialize when page load.
    this.setData({
      dynamic_id: +options.id
    });
  },
  // 输入文本
  inputValue(e) {
    this.setData({
      content: e.detail.value
    });
  },
  // 点击添加相册
  uploadAlbm() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.data.urls.unshift(res.tempFilePaths[0]);
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
  // 点击查看大图
  openPhoto(e) {
    this.setData({
      showBigpic: true,
      url: e.currentTarget.dataset.url
    });
  },
  // 关闭大图
  CancelPhoto() {
    this.setData({
      showBigpic: false,
      url: ''
    });
  },
  // 提交申诉
  submitPhoto() {
    if(!this.data.content.length) {
      wx.showToast({
        title: '请填写申诉理由',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定要提交申诉吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          if(this.data.urls.length) {
            this.uploadimg(this.data.urls, 0, 0, 0);
          } else {
            this.uploadPhoto();
          }
          
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
      dynamic_id: this.data.dynamic_id,
      pics: this.data.uploadUrl,
      content: this.data.content
    };
    ajax(pushAppeal, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '提交申诉成功',
          icon: 'none',
          duration: 2000
        });
        // 返回详情页
        wx.navigateBack({ delta: 1 });
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
