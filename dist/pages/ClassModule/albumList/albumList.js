const { getAlbmList,uploadFile,creatAlbm, getPhoto } = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Page({
  data: {
    role: null,           // 1教师 2家长
    class_id: null,       // 班级id
    delBtn: false,        // 相册删除按钮是否存在
    limit: 22,            //每页显示相册数量
    skip: 1,              // 当前页
    total_num: 0,         // 总条数
    albmList: [],         // 全部相册列表
    albmPhoto: []
  },
  onLoad: function (options) {
    let role = wx.getStorageSync('curRoleInfo');
    this.setData({
      role: role.type,
      class_id: role.class_id,
    });
    console.log(options);
    this.getAlbmList();
  },
  // 获取全部相册列表
  getAlbmList() {
    wx.showLoading({
      title: '加载中...'
    }); 
    let params = {
      class_id: this.data.class_id, 
      limit: this.data.limit,  
      skip: (this.data.skip - 1) * this.data.limit      
    };
    ajax(getAlbmList, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        let id = null;
        res.data.albums.forEach(item => {
          this.data.albmList.push(item);
          if(item.type === 1) {
            id = item.album_id;
          }
        });
        if(id) {
          this.getPhoto(id);
        }
        this.setData({
          albmList: this.data.albmList,
          total_num: res.data.total_num
        });
        wx.hideLoading();
      }
    });
  },
  // 获取默认相册照片
  getPhoto(id) {
    let params = {
      album_id: id,
      limit: 10,      // [可选]
      skip: 0       //【可选】limit和skip都不传时获取全部
    };
    ajax(getPhoto, {data: params, method: 'get'}).then(res => {
      if (res.code === 0) {
        this.setData({
          albmPhoto: res.data.pics
        });
      }
    });
  },
  // 删除相册
  delAlbm(e) {
    let id = +e.currentTarget.dataset.id; // 相册id
    let index = +e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否要删除该相册？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let params = {
            album_id: id // 动态id
          };
          ajax(creatAlbm, {data: params, method: 'delete'}).then(res => {
            if (res.code === 0) {
              this.data.albmList.splice(index, 1);
              this.setData({
                albmList: this.data.albmList,
                total_num: this.data.total_num - 1
              });
              wx.showToast({
                title: '删除相册成功',
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
  // 点击添加相册
  uploadAlbm() {
    for(let i = 0; i<this.data.albmList.length; i++) {
      if(!this.data.albmList[i].name) {
        wx.showToast({
          title: '请先设置相册名称',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }
    wx.chooseImage({
      count: 1,
      success: res => {
        this.uploadimg(res.tempFilePaths[0]);
      }
    });
  },
  // 上传图片
  uploadimg(data){
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
          this.submitPhoto(data.data);
        }
      },
      fail: () => {
      },
      complete: () => {
      }
    });
  },
  // 创建相册
  submitPhoto(data) {
    let params = {
      class_id: this.data.class_id, // 动态id
      name: '',
      pic: data
    };
    ajax(creatAlbm, {data: params, method: 'post'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '添加相册成功',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          albmList: [],
          skip: 1
        });
        this.getAlbmList(); //重新获取相册列表
      }
    });
  },
  // 修改相册
  inputValue(e) {
    if(!e.detail.value.trim()) {
      wx.showToast({
        title: '相册名不能为空',
        icon: 'none',
        duration: 2000
      });
      this.data.albmList[e.currentTarget.dataset.index].name = '';
      this.setData({
        albmList: this.data.albmList
      });
      return;
    }
    if(e.detail.value.trim().length > 8) {
      wx.showToast({
        title: '相册名不能大于8',
        icon: 'none',
        duration: 2000
      });
      this.data.albmList[e.currentTarget.dataset.index].name = '';
      this.setData({
        albmList: this.data.albmList
      });
      return;
    }
    for(let i = 0; i<this.data.albmList.length; i++) {
      if(this.data.albmList[i].name === e.detail.value.trim()) {
        wx.showToast({
          title: '该相册名已存在',
          icon: 'none',
          duration: 2000
        });
        this.setData({
          albmList: this.data.albmList
        });
        return;
      }
    }
    let params = {
      album_id: this.data.albmList[e.currentTarget.dataset.index].album_id,
      name: e.detail.value
    };
    ajax(creatAlbm, {data: params, method: 'put'}).then(res => {
      if (res.code === 0) {
        this.data.albmList[e.currentTarget.dataset.index].name = e.detail.value;
        this.setData({
          albmList: this.data.albmList
        });
        wx.showToast({
          title: '修改相册成功',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  // 跳转相片页面
  goPhoto(e) {
    let id = +e.currentTarget.dataset.id; // 相册id
    wx.navigateTo({
      url: `/pages/ClassModule/albumPhoto/albumPhoto?id=${id}`
    });
  },
  // 列表上拉加载
  pullUpLoading () {
    console.log('上拉加载',this.data.total_num, this.data.albmList.length);
    if(!this.data.total_num) {
      return;
    }
    if(this.data.total_num > this.data.albmList.length) {
      this.setData({
        skip: this.data.skip + 1
      });
      this.getAlbmList();
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
