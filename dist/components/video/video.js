
Component({

  behaviors: [],

  properties: {
    mode: Number,
    isComment: {
      type: Number,
      value: 0 
    },                    // 是否是点评类型
    curComment: {
      type: Object,
      value: {} 
    },                    // 点评数据
    trees: {
      type: Array,
      value: [] 
    },
    sectionName: {
      type: String,
      value: ''
    },                    // 所在系列name
  },
  data: {
    courseInfo: {},
    curPlayId: null,      // 正在播放课时id
    curPlayIndex: null,   // 正在播放课时index
    videoUrl: '',         // 正在播放视频url
    currentTime: 0,       // 视频当前时长
    durationTime: 0,      // 视频总时长
    theme: null
  },

  // 生命周期函数
  created() {},
  attached() {
    this.videoCont = wx.createVideoContext('videoPlayer', this);
    this.setData({
      startTime: new Date().getTime(),
      courseInfo: wx.getStorageSync('courseInfo'),
      curPlayId: wx.getStorageSync('curPlayId'),
      curPlayIndex: wx.getStorageSync('curPlayIndex'),
      theme: wx.getStorageSync('homeData').theme
    });
  },
  ready() {},
  moved() {},
  detached() {
    if (this.data.videoUrl) {
      this.videoCont.pause();
      this.triggerEvent('record', {
        curPlayId: this.data.curPlayId,
        type: 1,
        current: this.data.currentTime,
        duration: this.data.durationTime,
        learnTime: new Date().getTime()-this.data.startTime
      });
    }
  },

  methods: {
    changeType (e) {
      this.pauseVideo();
      this.triggerEvent('changeType', {
        type: +e.currentTarget.dataset.type,
        mode: this.data.mode
      });
    },
    videoError () {
      wx.showToast({
        title: '视频播放出错',
        icon: 'none'
      });
    },
    pauseVideo () {
      this.videoCont.pause();
    },
    // 查看点评
    toComment (e) {
      let item = e.currentTarget.dataset.item;
      let obj = item.teacher_evaluation;
      if (item.status === 0) {
        wx.showToast({
          title: '资源更新中',
          icon: 'none'
        });
        return;
      }
      if (!this.data.courseInfo.isbuy && !item.foruse) {
        this.triggerEvent('judgeType', {});
        wx.showToast({
          title: '该课时未购买',
          icon: 'none'
        });
      } else {
        wx.setStorageSync('curComment', obj);
        this.videoCont.pause();
        this.triggerEvent('record', {
          curPlayId: this.data.curPlayId,
          type: 1,
          current: this.data.currentTime,
          duration: this.data.durationTime,
          learnTime: new Date().getTime()-this.data.startTime
        });
        this.setData({
          startTime: new Date().getTime()
        });
        wx.navigateTo({
          url: '/pages/courseVideo/courseVideo'
        });
      }
    },
    // 进度更新
    timeUpdate (e) {
      let currentTime = parseInt((e.detail.currentTime * 1000).toFixed(0));
      let durationTime = parseInt((e.detail.duration * 1000).toFixed(0));
      this.setData({ 
        currentTime, durationTime
      });
    },
    // 切换视频课时
    changeVideoCurPlay (e) {
      let item = e.currentTarget.dataset.item;
      if (item.status === 0) {
        wx.showToast({
          title: '资源更新中',
          icon: 'none'
        });
        return;
      }
      this.triggerEvent('record', {
        curPlayId: this.data.curPlayId,
        type: 1,
        current: this.data.currentTime,
        duration: this.data.durationTime,
        learnTime: new Date().getTime()-this.data.startTime
      });

      let index = this.data.trees.findIndex(item => {
        return item.section_id === parseInt(item.section_id);
      });
      this.setData({
        startTime: new Date().getTime(),
        curPlayId: parseInt(item.section_id),
        curPlayIndex: parseInt(index)
      });
      wx.setStorageSync('curPlayId', parseInt(item.section_id));
      wx.setStorageSync('curPlayIndex', parseInt(index));

      if (this.data.courseInfo.isbuy || item.foruse) {
        this.triggerEvent('judgeType', {});
      } else {
        wx.showToast({
          title: '该课时未购买',
          icon: 'none',
          mask: true,
          duration: 1500,
          success () {
            setTimeout(() => {
              if (getCurrentPages().length > 1) {
                wx.navigateBack({ delta: 1 });                
              } else {
                wx.reLaunch('/pages/index/index');
              }
            }, 1500);
          }
        });
      }
    },
    // 切换视频源
    changeVideoUrl () {
      if (this.data.isComment) {
        this.setData({
          videoUrl: this.data.curComment.video_url
        });
        return; 
      }
      let index = this.data.trees.findIndex(item => {
        return item.section_id === this.data.curPlayId;
      });
      let item = this.data.trees[index];
      this.setData({
        videoUrl: item.video_url,
        curPlayIndex: index
      });
      wx.setStorageSync('curPlayIndex', index);
      // console.log('video进度', item.study_schedule.study_duration / 1000);
      this.videoCont.seek(item.study_schedule.study_duration / 1000);
    },
  }

});