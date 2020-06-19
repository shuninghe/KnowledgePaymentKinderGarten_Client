
const { gardenInformation, uploadFile, addGardenIntro } = require('../../api.config');
const { ajax } = require('../../utils/util');
Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    imgArr: [], // 图片数组
    flag: true, // 是否显示加号
    inputValue: '', // 输入框的值
    delImgArr: [], // 网络图片地址
    totalArr: [], // 页面上的数组
    timer: '' // 定时器
  },
  // 获取详情
  getBriefDetail() {
    const path = `${gardenInformation}`;
    let params = {
      id: this.data.gardenId
    };
    ajax(path, {data: params, failToast: false} ).then(res => {
      wx.hideLoading();
      if (res.code === 0) {
        this.setData({
          inputValue: res.data.intro,
        });
        if (res.data.pics.length) {
          this.setData({
            delImgArr: JSON.parse(JSON.stringify(res.data.pics)),
            totalArr:  JSON.parse(JSON.stringify(res.data.pics))
          });
          if (this.data.totalArr.length === 6) {
            this.setData({
              flag: false
            });
          }
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        });
      }
    }).catch(rep => {
      wx.hideLoading();
      wx.showToast({
        title: rep.msg,
        icon: 'none',
        duration: 1500
      });
    });

  },
  // input框输入的值
  inputValue(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },
  // 删除图片
  cancelPhoto(e) {
    if (this.data.totalArr.length) {
      this.data.totalArr.splice(e.currentTarget.dataset.index, 1);
      if (e.currentTarget.dataset.index > this.data.delImgArr.length - 1) {
        this.data.imgArr.splice(e.currentTarget.dataset.index - this.data.delImgArr.length, 1);
      } else {
        this.data.delImgArr.splice(e.currentTarget.dataset.index, 1);
      }
      this.setData({
        totalArr: this.data.totalArr,
        imgArr: this.data.imgArr,
        delImgArr: this.data.delImgArr
      });
    }
    if (this.data.totalArr.length < 6) {
      this.setData({
        flag: true
      });
    }

  },
  // 点击添加图片
  uploadMyPhoto() {
    this.setData({
      totalArr: [...this.data.delImgArr,...this.data.imgArr]
    });
    wx.chooseImage({
      count: 6 - this.data.imgArr.length,
      success: res => {
        let totalLength = res.tempFilePaths.length + this.data.imgArr.length + this.data.delImgArr.length;
        if (totalLength > 6) {
          wx.showToast({
            title: '最多添加6张哦',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          this.data.totalArr.push(res.tempFilePaths[i]);
          this.data.imgArr.push(res.tempFilePaths[i]);
        }
        this.setData({
          imgArr: this.data.imgArr,
          totalArr: this.data.totalArr
        });
        if (totalLength >= 6) {
          this.setData({
            flag: false
          });
        }
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
          this.data.delImgArr.push(data.data);
        }
        that.setData({
          delImgArr: that.data.delImgArr
        });
      },
      fail: () => {
        fail++;
      },
      complete: () => {
        num++; 
        if (num === data.length){   // 上传完
          wx.hideLoading(); 
          this.addGardenIntro(); 
        } else { 
          let data = that.data.imgArr;
          num = num;
          success = success;
          fail = fail;
          that.uploadimg(data, num , success, fail);
        }
      }
    });

  },
  // 添加园所介绍
  addGardenIntro() {
    if (this.data.timer) clearTimeout(this.data.timer);
    const data = {
      intro: this.data.inputValue,
      pics: this.data.delImgArr,
      id: this.data.gardenId
    };
    ajax(addGardenIntro, {data, method: 'POST'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        this.data.timer = setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        },500);
      }
    });
  },
  // 点击提交
  handleSubmit() {
    if (!this.data.inputValue.replace(' ','').length || !(this.data.imgArr.length + this.data.delImgArr.length) ) {
      wx.showToast({
        title: '还有内容没填完整哦～',
        icon: 'none',
        duration: 1500,
      });
      return;
    }
    var num =0, success = 0 , fail = 0;
    if (this.data.imgArr.length) {
      this.uploadimg(this.data.imgArr, num, success, fail);
    } else {
      this.addGardenIntro();
    }
    
    
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      gardenId: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
    });
    wx.setNavigationBarTitle({
      title: this.data.type_name + '介绍'
    });
    this.getBriefDetail();
  },
  onReady() {
  },
  onShow() {
  },
  onHide() {
  },
  onUnload() {
  },
  onPullDownRefresh() {
  },
  onReachBottom() {
  },
  onPageScroll() {
  },
  onTabItemTap() {
  },
  customData: {}
});
