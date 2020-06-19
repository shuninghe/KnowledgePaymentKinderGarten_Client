Component({

  behaviors: [],

  properties: {
    list: Array
  },
  data: {},

  // 生命周期函数
  created() {},
  attached() {
    console.log(this.data.list);
  },
  ready() {},
  moved() {},
  detached() {},

  methods: {
    // 跳转课程详情页
    toCourseDetail (e) {
      let item = e.currentTarget.dataset.item;
      console.log(item);
      let aId = item.activitys[0].id;
      let type = item.activitys[0].type;
      wx.navigateTo({
        url: `/pages/courseDetail/courseDetail?id=${item.id}&activityId=${aId}&activityType=${type}`
      });
    },
  }

});