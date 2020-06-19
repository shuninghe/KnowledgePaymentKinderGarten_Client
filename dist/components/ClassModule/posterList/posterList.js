const { getPosterCategoryList, getPosterList } = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');
Component({

  behaviors: [],

  properties: {
    conHeight: Number,
    curRoleInfo: Object
  },
  data: {
    posterCategoryList: [], // 海报分类列表
    categoryTotal_num: null, // 分类总数
    categoryLimit: 12, // 分类-页大小
    categoryCurrentPage: 1, // 分类-当前页
    categoryIsShowNoMore: false, // 分类-显示‘没有更多了’
    active: 0, // 默认开始
    activeId: null, // 默认开始id
    posterList: [], // 海报列表
    posterTotal_num: null, // 海报总数
    posterLimit: 10, // 海报-页大小
    posterCurrentPage: 1, // 海报-当前页
    posterIsShowNoMore: false, // 海报-显示‘没有更多了’
    leftList: [],
    rightList: [],
    posterPic: '', // 查看的海报地址
  },
  
  // 生命周期函数
  created() {},
  attached() {
    this.getPosterCategoryList();
  },
  ready() {},
  moved() {},
  detached() {},
  methods: {
    // 获取海报分类列表
    getPosterCategoryList () {
      let params = {
        limit: this.data.categoryLimit, 
        offset: (this.data.categoryCurrentPage - 1) * this.data.categoryLimit 
      };
      ajax(getPosterCategoryList, {data: params, method: 'get'}).then(res => {
        if (res.code === 0) {
          let posterCategoryList = this.data.posterCategoryList.concat(res.data.list);
          this.setData({
            posterCategoryList: posterCategoryList,
            categoryTotal_num: res.data.total_num,
          });
          if (!this.data.activeId) {
            this.setData({
              activeId: res.data.total_num ? res.data.list[0].id : null,
            });
            this.data.activeId && this.getPosterList();
          }
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    },
    // 分类列表上拉加载
    categoryPullUpLoading () {
      if (this.data.posterCategoryList.length < this.data.categoryTotal_num) {
        this.setData({
          categoryCurrentPage: this.data.categoryCurrentPage + 1
        });
        this.getPosterCategoryList();
      } else {
        this.setData({
          categoryIsShowNoMore: true
        });
      }
    },
    // 海报列表
    getPosterList (e) {
      let activeIndex = this.data.active, activeId = this.data.activeId;
      if (e) {
        activeIndex = +e.currentTarget.dataset.index;
        activeId = +e.currentTarget.dataset.id;
        this.setData({
          posterCurrentPage: 1,
          posterList: [],
          leftList: [],
          rightList: [],
          posterIsShowNoMore: false
        });
      }
      this.setData({
        active: activeIndex,
        activeId: activeId
      });
      let params = {
        id: activeId,
        limit: this.data.posterLimit,
        offset: (this.data.posterCurrentPage - 1) * this.data.posterLimit
      };
      ajax(getPosterList, {data: params, method: 'get'}).then(res => {
        if (res.code === 0) {
          let posterList = this.data.posterList.concat(res.data.list);
          res.data.list.forEach((val, index) => {
            if (index%2 === 0) {
              this.data.leftList.push(val);
            } else {
              this.data.rightList.push(val);
            }
          });
          this.setData({
            posterTotal_num: res.data.total_num,
            posterList: posterList,
            leftList: this.data.leftList,
            rightList: this.data.rightList,
          });
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    },
    // 海报上拉加载
    posterPullUpLoading () {
      if (this.data.posterList.length < this.data.posterTotal_num) {
        this.setData({
          posterCurrentPage: this.data.posterCurrentPage + 1
        });
        this.getPosterList();
      } else {
        this.setData({
          posterIsShowNoMore: true
        });
      }
    },
    // 保存图片到相册
    saveAlbm(e) {
      let pic = e.currentTarget.dataset.pic;
      console.log(pic);
      let that = this;
      //若二维码未加载完毕，加个动画提高用户体验
      wx.showToast({
        icon: 'loading',
        title: '正在保存图片',
        duration: 1000
      });
      //判断用户是否授权"保存到相册"
      wx.getSetting({
        success (res) {
          //没有权限，发起授权
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success () {//用户允许授权，保存图片到相册
                that.savePhoto();
              },
              fail () {//用户点击拒绝授权，跳转到设置页，引导用户授权
                wx.showModal({
                  title: '提示',
                  content: '请重新授权保存图片或视频到你的相册',
                  cancelText:'不授权',
                  cancelColor:'#999',
                  confirmText:'授权',
                  confirmColor:'#107E7D',
                  success(res) {
                    if (res.confirm) {
                      wx.openSetting({
                        success() {
                          that.savePhoto();
                        }
                      });                                
                    } else if (res.cancel) {
                      console.log('用户点击取消');
                    }
                  }
                });
                // wx.openSetting({
                //   success () {
                //     wx.authorize({
                //       scope: 'scope.writePhotosAlbum',
                //       success() {
                //         that.savePhoto();
                //       }
                //     });
                //   }
                // });
              }
            });
          } else {//用户已授权，保存到相册
            that.savePhoto();
          }
        }
      });
    },
    //保存图片到相册，提示保存成功
    savePhoto() {
      let that = this;
      wx.downloadFile({
        url: that.data.posterPic,
        success: function (res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success() {
              wx.showToast({
                title: '保存成功',
                icon: 'icon',
                duration: 1000
              });
              that.setData({
                posterPic: ''
              });
            }
          });
        }
      });
    },
    // 查看海报详情
    getPosterDetail (e) {
      this.setData({
        posterPic: e.currentTarget.dataset.pic
      });
    },
    // 关闭海报列表
    closePoster () {
      this.setData({
        posterPic: ''
      });
    }
  }

});