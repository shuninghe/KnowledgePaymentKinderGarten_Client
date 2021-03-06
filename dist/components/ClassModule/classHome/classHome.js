const { getClassDynamic, deleteDynamic, clickThumb } = require('../../../api.config.js');
const { ajax } = require('../../../utils/util');

Component({

  behaviors: [],

  properties: {
    conHeight: Number,
    curRoleInfo: Object
  },
  data: {
    role: null,           // 1教师 2家长
    class_id: null,       // 班级id
    total_num: 0,         // 相册动态总数
    limit: 10,            // 每页展示条数
    pages: 1,             // 当前页
    dynamicList: [],      // list原始数据
    dateList: [],         // 处理后list
    isShowNoMore: false   // 显示‘没有更多了’,
  },

  // 生命周期函数
  created() {},
  attached() {
    this.setData({
      role: this.data.curRoleInfo.type,
      class_id: this.data.curRoleInfo.class_id,
    });
    this.getClassDynamic();
  },
  ready() {},
  moved() {},
  detached() {},
  pageLifetimes: {
    show: function() {
      this.setData({
        role: this.data.curRoleInfo.type,
        class_id: this.data.curRoleInfo.class_id,
      });
      this.getClassDynamic();
    },
  },

  methods: {
    // 获取班级通知和相册动态
    getClassDynamic (more) {
      if (this.data.isShowNoMore) {
        return;
      }
      let params = {
        class_id: this.data.class_id, 
        skip: (this.data.pages - 1) * this.data.limit,    
        limit: this.data.limit,                            
        role: this.data.role   
      };
      ajax(getClassDynamic, {data: params, method: 'get'}).then(res => {
        if (res.code === 0) {
          wx.hideLoading();
          this.setData({
            total_num: res.data.total_num
          });
          if (!more) {
            this.setData({ dateList: [] });
          }
          this.handlerList(res.data.dynamic);
        }
      }).catch(res => {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
      });
    },
    // 处理数据转成二维数组,新数据加入二位数组
    handlerList (arr) {
      let list = this.data.dateList;
      arr.forEach(item => {
        let date = new Date(item.time).setHours(0, 0, 0, 0);
        let index;
        if (list.length) {
          index = list.findIndex(i => {
            return i.date === date;
          });
        } else {
          index = -1;
        }
        if (index > -1) {
          list[index].list.push(item);
        } else {
          list.push({
            date,
            list: [item]
          });
        }
      });
      this.setData({
        dateList: list
      });
    },
    // 列表上拉加载
    pullUpLoading () {
      console.log('上拉加载');
      let allNum = 0;
      this.data.dateList.forEach(item => {
        allNum = allNum + item.list.length;
      });
      if (!this.data.total_num) {
        return;
      }
      if (this.data.total_num > allNum) {
        wx.showLoading({
          title: '加载中'
        });
        this.setData({
          pages: this.data.pages + 1
        });
        this.getClassDynamic(true);
      } else {
        this.setData({
          isShowNoMore: true
        });
      }
    },
    // 删除动态
    delDynamic (e) {
      let id = +e.currentTarget.dataset.id;
      wx.showModal({
        title: '提示',
        content: '是否要删除该动态？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: (result) => {
          if(result.confirm){
            console.log('删除动态', id);
            let params = {
              dynamic_id: id // 动态id
            };
            ajax(deleteDynamic, {data: params, method: 'delete'}).then(res => {
              if (res.code === 0) {
                this.setData({
                  limit: 10,
                  pages: 1
                });
                this.getClassDynamic();
              }
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    },
    // 点赞/取消点赞
    changeClick(e) {
      let status = +e.currentTarget.dataset.status;
      if(status === 2 || status === 3 || status === 4 || status === 6) {
        wx.showToast({
          title: '该相册动态审核未通过',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      let id = +e.currentTarget.dataset.id;
      let is_click = e.currentTarget.dataset.isclick;
      if(is_click) {
        wx.showModal({
          title: '提示',
          content: '是否要取消点赞',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              let params = {
                dynamic_id: id, // 动态id
                type: 2
              };
              ajax(clickThumb, {data: params, method: 'put'}).then(res => {
                if (res.code === 0) {
                  this.data.dateList.forEach(item => {
                    item.list.forEach(item1 => {
                      if(item1._id === id) {
                        item1.is_click = 0;
                        item1.click_num -=1;
                      }
                    });
                  });
                  this.setData({
                    dateList: this.data.dateList
                  });
                  // this.getClassDynamic();
                }
              });
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
        
      } else {
        let params = {
          dynamic_id: id, // 动态id
          type: 1
        };
        ajax(clickThumb, {data: params, method: 'put'}).then(res => {
          if (res.code === 0) {
            this.data.dateList.forEach(item => {
              item.list.forEach(item1 => {
                if(item1._id === id) {
                  item1.is_click = 1;
                  item1.click_num +=1;
                }
              });
            });
            this.setData({
              dateList: this.data.dateList
            });
            // this.getClassDynamic();
          }
        });
      }
    },
    // 跳转详情页
    toDetail (e) {
      let type = +e.currentTarget.dataset.type;
      let id = +e.currentTarget.dataset.id;
      if (type === 1) {
        wx.navigateTo({
          url: `/pages/ClassModule/noticeDetail/noticeDetail?id=${id}`
        });
      } else if (type === 2 || type === 3) {
        wx.navigateTo({
          url: `/pages/ClassModule/albumDetail/albumDetail?id=${id}`
        });
      }
    }
  }

});