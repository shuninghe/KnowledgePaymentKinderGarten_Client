// 全局app实例
const { gardenInformation, uploadFile, addGardenWork} = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    imgArr: [], // 本地数组
    flag: true,
    delImgArr: [], // 网络图片地址
    totalArr: [], // 页面上的数组
    timer: '' // 定时器
  },
  // 设置input的值 
  inputValue(e) {
    this.data.totalArr[e.currentTarget.dataset.index].name = e.detail.value;
    this.setData({
      totalArr: this.data.totalArr
    });
    if (e.currentTarget.dataset.index > this.data.delImgArr.length -1) {
      this.data.imgArr[e.currentTarget.dataset.index - this.data.delImgArr.length].name = e.detail.value;
      this.setData({
        imgArr: this.data.imgArr
      });
    } else {
      this.data.delImgArr[e.currentTarget.dataset.index].name = e.detail.value;
      this.setData({
        delImgArr: this.data.delImgArr
      });
    }
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
        if (res.data.works.length) {
          this.setData({
            delImgArr: JSON.parse(JSON.stringify(res.data.works)),
            totalArr: JSON.parse(JSON.stringify(res.data.works))
          });
          if (this.data.totalArr.length === 12) {
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
  // 删除图片
  cancelPhoto(e) {
    if (this.data.totalArr.length) {
      this.data.totalArr.splice(e.currentTarget.dataset.index, 1);
      if ( e.currentTarget.dataset.index > this.data.delImgArr.length - 1) {
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
    if (this.data.totalArr.length < 12) {
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
      count: 12,
      success: res => {
        let totalLength = res.tempFilePaths.length + this.data.imgArr.length + this.data.delImgArr.length ;
        if (totalLength > 12) {
          wx.showToast({
            title: '最多添加12张哦',
            icon: 'none',
            duration: 2000
          });
          return;
        }
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          this.data.imgArr.push({pic: res.tempFilePaths[i],name: ''});
          this.data.totalArr.push({pic: res.tempFilePaths[i],name: ''});
        } 
        this.setData({
          imgArr: this.data.imgArr,
          totalArr: this.data.totalArr
        });
        if (totalLength >= 12) {
          this.setData({
            flag: false
          });
        }
      }
    });
  },
  // 上传图片
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
      'file': data[num].pic
    };
    num = num ? num : 0;
    success = success ? success : 0; // 上传成功的个数
    fail = fail ? fail : 0; // 上传失败的个数
    let name = data[num].name;
    wx.uploadFile({
      url: uploadFile, 
      filePath: data[num].pic,
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
          this.data.delImgArr.push({pic: data.data, name: name});
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
          this.addActivityWork(); 
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
  // 点击提交
  handleSubmit() {
    if (!(this.data.imgArr.length + this.data.delImgArr.length)) {
      wx.showToast({
        title: '还没有添加一张图片哦',
        icon: 'none',
        duration: 2000,
      });
      return;
    }

    let isHasNull;
    this.data.imgArr.forEach(v => {
      if (!v.name.length) {
        isHasNull =  1;
      }
    });
    this.data.delImgArr.forEach(v => {
      if (!v.name.length) {
        isHasNull =  1;
      }
    });
    if (isHasNull) {
      wx.showToast({
        title: '还有图片的名字未填写哦',
        icon: 'none',
        duration: 1500,
        mask: true
      });
      return;
    }
    var num =0, success = 0 , fail = 0;
    if (this.data.imgArr.length) {
      this.uploadimg(this.data.imgArr, num, success, fail);
    } else {
      this.addActivityWork();
    }
  },
  // 添加园所动态
  addActivityWork() {
    const data = {
      works: this.data.delImgArr,
      id: this.data.gardenId
    };
    if (this.data.timer) clearTimeout(this.data.timer);
    ajax(addGardenWork, {data, method: 'POST',failToast: false}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '发布成功',
          icon: 'none',
          duration: 2000,
        });
        this.data.timer = setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        },1000);
      }
    }).catch(rep => {
      wx.showToast({
        title: rep.msg,
        icon: 'none',
        duration: 1500
      });
    });
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    this.setData({
      gardenId: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
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
