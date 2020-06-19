Component({

  behaviors: [],

  properties: {},
  data: {},

  // 生命周期函数
  created() {},
  attached() {},
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 点击取消
    clickCancelBtn(){
      this.triggerEvent('shareEvent', {cancel:true});
    },
    // 点击海报
    clickPoster() {
      if (!wx.getStorageSync('postUser')) {
        wx.login({
          success: () => {
            wx.getUserInfo({
              success: ref => {
                let postUser = {
                  name: ref.userInfo.nickName,
                  pic: ref.userInfo.avatarUrl
                };
                wx.setStorageSync('postUser', postUser);
                this.triggerEvent('shareEvent', {poster:true});
              },
              fail: rep => {
                console.log(rep,'获取用户信息失败');
                // wx.showToast({
                //   title: '网络错误，请稍后再试',
                //   icon: 'none'
                // });
              }
            });
          },
          fail: (err) => {
            console.log(err,'登录失败');
          }
        });
      } else {
        this.triggerEvent('shareEvent', {poster:true});
      }
    }
  }

});