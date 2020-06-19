const {getPhoto,uploadFile,addPhoto,deletePhoto} = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    album_id: null, // 相册id
    role: null, // 1教师 2家长
    delBtn: false, // 删除按钮是否存在
    showMask: false, // 放大查看照片弹框
    showModal: false, // 添加图片or视频弹框
    // controls: false, // 是否显示视频
    url: '', // 点击查看图片/视频
    type: 1, // 图片or视频
    limit: 26, //每页显示相册数量
    skip: 1, // 当前页
    total_num: 0, // 总条数
    urls: [],
    uploadUrl: [], // 上传照片
    photoList: [] // 照片列表
  },
  onLoad: function (options) {
    console.log(options,uploadFile);
    let role = wx.getStorageSync('curRoleInfo');
    this.setData({
      role: role.type,
      class_id: role.class_id,
      album_id: +options.id
    });
    this.getAlbmPhoto();
  },
  // 获取照片
  getAlbmPhoto() {
    wx.showLoading({
      title: '加载中...'
    }); 
    let params = {
      album_id: this.data.album_id,
      limit: this.data.limit,      // [可选]
      skip: (this.data.skip - 1) * this.data.limit       //【可选】limit和skip都不传时获取全部
    };
    ajax(getPhoto, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        res.data.pics.forEach(item => {
          this.data.photoList.push(item);
        });
        this.setData({
          photoList: this.data.photoList,
          total_num: res.data.total_num
        });
        wx.hideLoading();
      }
    });
  },
  // 打开图片
  openPhoto(e) {
    let urls = [];
    this.data.photoList.forEach(item => {
      if (item.type === 1) {
        urls.push(item.url);
      } 
    });
    wx.previewImage({
      current: e.currentTarget.dataset.url, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    });
  },
  // 打开视频
  openVideo(e) {
    this.setData({
      showMask: true,
      url: e.currentTarget.dataset.url,
      type: +e.currentTarget.dataset.type
    });
    this.videoCont = wx.createVideoContext('video', this);
  },
  stopVideo() {
    return false;
  },
  // 关闭视频mask
  CancelGrade() {
    this.videoCont.pause();
    this.setData({
      url: '',
      showMask: false
    });
  },
  // 选择上传图片or视频
  upload() {
    this.setData({
      showModal: true
    });
  },
  // 添加图片or视频
  addPic(e) {
    this.setData({
      showModal: false
    });
    if(+e.currentTarget.dataset.type === 1) {
      this.uploadPhoto(); // 上传图片
    } else {
      this.uploadVideo(); // 上传视频
    }
  },
  // 关闭弹窗
  closeMask: function() {
    this.setData({
      showModal: false
    });
  },
  // 阻止冒泡点击
  stopClick:function(){
    return false;
  },
  // 点击添加照片
  uploadPhoto() {
    wx.chooseImage({
      success: res => {
        // this.uploadimg(res.tempFilePaths[0],1);
        this.setData({
          urls: res.tempFilePaths.reverse()
        });
        this.uploadimg(res.tempFilePaths.reverse(), 0, 0, 0);
      }
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
          this.submitPhoto(1);
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
  // 上传视频
  uploadimg1(data){
    wx.showLoading({
      title: '上传中',
      mask: true
    });
    let formData = {
      'useof': 'RES_YSS_IMG',
      'source': 1,
      'file': data
    };
    wx.uploadFile({
      url: uploadFile,
      filePath: data,
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
          wx.hideLoading();
          this.submitPhoto1(data.data,2);
        }
      },
      fail: () => {
      },
      complete: () => {
      }
    });
  },
  // 添加照片
  submitPhoto(type) {
    let resources = [];
    this.data.uploadUrl.forEach(item => {
      resources.push({
        url: item,
        type: type
      });
    });
    let params = {
      album_id: this.data.album_id,
      resources: resources
    };
    ajax(addPhoto, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        this.setData({
          photoList: [],
          skip: 1
        });
        this.getAlbmPhoto();
      }
    });
  },
  // 添加视频
  submitPhoto1(data,type) {
    let resources = [{
      url: data,
      type: type
    }];
    let params = {
      album_id: this.data.album_id,
      resources: resources
    };
    ajax(addPhoto, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        this.setData({
          photoList: [],
          skip: 1
        });
        this.getAlbmPhoto();
      }
    });
  },
  // 上传视频
  uploadVideo() {
    wx.chooseVideo({
      success: res => {
        this.uploadimg1(res.tempFilePath,2);
      }
    });
  },
  // 删除照片
  delPhoto(e) {
    let id = +e.currentTarget.dataset.id; // 相册id
    let index = +e.currentTarget.dataset.index;
    let type = +e.currentTarget.dataset.type;
    let title = '';
    if(type === 1) {
      title = '是否要删除该照片？';
    } else {
      title = '是否要删除该视频？';
    }
    wx.showModal({
      title: '提示',
      content: title,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let params = {
            pic_id: id, // 照片id
            album_id: this.data.album_id // 相册id
          };
          ajax(deletePhoto, {data: params, method: 'delete'}).then(res => {
            if (res.code === 0) {
              this.data.photoList.splice(index, 1);
              this.setData({
                photoList: this.data.photoList,
                total_num: this.data.total_num - 1
              });
              let name = '';
              if(type === 1) {
                name = '删除照片成功';
              } else {
                name = '删除视频成功';
              }
              wx.showToast({
                title: name,
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 是否显示删除相册按钮
  changeBtn() {
    this.setData({
      delBtn: !this.data.delBtn
    });
  },
  // 列表上拉加载
  pullUpLoading () {
    console.log('上拉加载',this.data.total_num, this.data.photoList.length);
    if(!this.data.total_num) {
      return;
    }
    if(this.data.total_num > this.data.photoList.length) {
      this.setData({
        skip: this.data.skip + 1
      });
      this.getAlbmPhoto();
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.pullUpLoading();
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
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
