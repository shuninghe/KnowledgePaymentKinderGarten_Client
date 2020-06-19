const {searchSchool,userinfo} = require('../../api.config');
const {ajax} = require('../../utils/util');
Page({
  data: {
    id: null,
    onlyReadname: '',
    name: '',
    kindergartens: [],
    selectId: null, // 筛选选中id
  },
  // 修改
  modification(){
    this.setData({
      id: null,
      onlyReadname: ''
    });
  },
  // 姓名
  bindinput(e){
    this.setData({
      name : e.detail.value
    });
  },
  // 搜索
  search(){
    let name = this.data.name.replace(/(^\s*)|(\s*)$/g,'');
    if(name.length === 0){
      wx.showToast({
        title: '请输入内容',
        icon: 'none',
      });
      return;
    }
    let params = {
      key_word: name// 园所id或园所名称
    };
    ajax(searchSchool,{data:params}).then((res)=>{
      if(res.code === 0){
        if(res.data.kindergartens.length>0){
          this.setData({
            kindergartens: res.data.kindergartens
          });
        }else{
          wx.showToast({
            title: '没有搜索到数据',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false,
          });
        }
      }
    });
  },
  // 解绑
  relieve(){
    wx.showModal({
      title: '解绑',
      content: '您要解除绑定吗?',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let data = {
            kindergarten: 0,
          };
          ajax(userinfo,{data,method:'PUT'}).then(res=>{
            if(res.code === 0){
              wx.showToast({
                title: '解绑成功',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: false,
                success: ()=>{
                  wx.navigateBack({
                    delta: 1
                  });
                },
              });
              wx.setStorageSync('isRefreshUserInfo', '1');
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  // 选择学校
  selectSchool(e){
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '绑定',
      content: `是否确认绑定 ${name}`,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          let params = {
            kindergarten: id - 0
          };
          ajax(userinfo,{data:params,method:'PUT'}).then(res=>{
            if(res.code === 0){
              this.setData({
                id,
                name,
                onlyReadname: name,
                kindergartens: [],
              });
              wx.setStorageSync('isRefreshUserInfo', '1');
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

  },
  onLoad(options) {
    if(options.id){
      this.setData({
        id: options.id,
        onlyReadname: options.name,
      });
    }
    // Do some initialize when page load.
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
