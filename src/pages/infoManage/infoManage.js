const { untyingInfo, uploadFile, getGardenPic, updateGardenPic} = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    type_name: getApp().globalData.appName==='沃职教' ? '院校' : '园所',
    isShowPopup: false, // 是否显示弹窗
    gardenId: null, // 园所id
    url: ''
  },
  handleClick(e) {
    switch(+e.currentTarget.dataset.num) {
    case 1:
      wx.navigateTo({
        url: '../baseInfo/baseInfo'
      });
      break;
    case 2:
      wx.navigateTo({
        url: '../setBrief/setBrief'
      });
      break;
    case 3:
      wx.navigateTo({
        url: '../setWorks/setWorks'
      });
      break;
    case 4:
      wx.showToast({
        title: '主题正在开发中哦～',
        icon: 'none',
        duration: 2000
      });
      break;
    case 5:
      this.setData({
        isShowPopup: true
      });
      break;
    }
  },
  // 点击头像
  changeHeaderpic() {
    wx.chooseImage({
      count: 1,
      success: (res)=>{
        this.uploadImg(res.tempFilePaths[0]).then(res => {
          if (res.statusCode === 200) {
            this.updateGardenPic(JSON.parse(res.data).data);
          }
        });
      }
    });
  },
  // 上传图片
  uploadImg(picUrl) {
    return new Promise((resolve,reject)=> {
      let formData = {
        'useof': 'RES_YSS_IMG',
        'source': 1,
        'file': picUrl,
      };
      wx.uploadFile({
        url: uploadFile,
        filePath: picUrl,
        name: picUrl,
        formData: formData,
        header: {
          'Content-Type': 'multipart/form-data',
          'accept': 'application/json',
          'apiKey': getApp().globalData.uploadKey,
        },
        success: (res)=>{
          this.setData({
            url: JSON.parse(res.data).data
          });
          resolve(res);
        },
        fail: ()=>{
          reject();
        }
      });
    });
    
  },
  // 修改园所信息
  updateGardenPic(url) {
    let data = {
      id: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId'),
      pic: url
    };
    ajax(updateGardenPic, {data, method: 'POST'}).then(res => {
      if (res.code === 0) {
        wx.showToast({
          title: '修改成功',
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
  },
  // 获取园所头像
  getGardenPic() {
    let data = {
      id:  wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
    };
    ajax(getGardenPic, {data}).then(res => {
      if (res.code === 0) {
        this.setData({
          url: res.data.pic
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
  // 解除管理员
  handleConfirm() {
    this.handleRelieve().then(() => {  
      if (this.data.timer) clearTimeout(this.data.timer);
      wx.showToast({
        title: '解除成功',
        icon: 'none',
        duration: 1500
      });
      this.data.timer = setTimeout(()=> {
        wx.reLaunch({
          // url: '/pages/index/index'
          url: '/pages/kindergarten/kindergarten'
        });
      }, 1500);
    });
  },
  // 取消
  handleCancel() {
    this.setData({
      isShowPopup: false
    });
  },
  // 解除
  handleRelieve() {
    return new Promise((resolve, reject) => {
      let data = {
        id: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
      };
      ajax(untyingInfo, {data, method: 'DELETE'}).then(res => {
        this.setData({
          isShowPopup: false
        });
        if (res.code === 0) {
          resolve(res);
        } else {
          wx.showToast({
            title: res.code,
            icon: 'none'
          });
        }
      }).catch((rep) => {
        wx.showToast({
          title: rep.msg,
          icon: 'none'
        });
        this.setData({
          isShowPopup: false
        });
        reject();
      });
    });
    
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: this.data.type_name + '管理'
    });
    this.getGardenPic();
  },
  onReady() {
  },
  onShow() {
    this.setData({
      gardenId: wx.getStorageSync('userinfo').liable_kindergarten || wx.getStorageSync('gardenId')
    });
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
