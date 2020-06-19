const common = require('../../utils/common.js');
const audioCont = wx.createInnerAudioContext();
const errInfo = {
  '10001': '系统错误',	
  '10002': '网络错误',
  '10003': '文件错误',	
  '10004': '格式错误',
  '-1':	'未知错误'
};

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
  },
  data: {
    courseInfo: {},
    curPlayId: null,      // 正在播放课时id
    curPlayIndex: null,   // 正在播放课时index
    picUrl: [],           // PPT图片列表
    audioUrl: '',         // 正在播放音频url
    current: '00:00',     // 正在播放时长
    duration: '00:00',    // 总时长
    offset: 0,
    max: 0,
    isPlay: false,        // 播放开关
    theme: null
  },

  // 生命周期函数
  created() {},
  attached() {
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
    this.pauseAudio();
    this.triggerEvent('record', {
      curPlayId: this.data.curPlayId,
      type: this.data.audioUrl ? 2 : 4,
      current: this.data.offset *  1000,
      duration: this.data.max * 1000,
      learnTime: new Date().getTime()-this.data.startTime
    });
  },

  methods: {
    showPicture (){
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-in',
        delay: 0
      });
      animation.opacity(1).step();
      this.setData({
        animationData: animation.export()
      });
    },
    // 播放音频
    playAudio () {
      audioCont.offSeeked(); 
      // let item = this.data.trees[wx.getStorageSync('curPlayIndex')];
      // if (!this.data.isComment && !this.data.courseInfo.isbuy && !item.foruse) {
      //   wx.showToast({
      //     title: '当前课时未购买',
      //     icon: 'none',
      //   });
      //   return;
      // } 
      if (!this.data.audioUrl) {
        // wx.showToast({
        //   title: '暂无音频',
        //   icon: 'none',
        // });
        return;
      }
      audioCont.src = this.data.audioUrl;
      audioCont.autoplay = true;
      audioCont.play();
      let _this = this;
      // 监听音频播放事件-获取总时长max
      audioCont.onPlay(() => {
        var interval = 0; 
        let timer = setInterval(() => {
          interval++;
          if (interval >= 20) {
            clearInterval(timer);
            wx.showToast({
              title: '音频加载超时',
              icon: 'none',
              duration: 1500,
              mask: false,
            });
            wx.hideLoading();
          }
          if (audioCont && audioCont.duration) {
            setTimeout(() => {
              let duration = audioCont.duration;
              _this.setData({
                duration: _this.getTime(duration),
                max: Math.round(duration * 1000 / 1000)
              });
            }, 500);
            clearInterval(timer);
            wx.hideLoading();
          }
        }, 500);
      
      });
      // 监听音频进度条变化-获取当前时长offset
      audioCont.onTimeUpdate(() => { 
        let currentTime = audioCont.currentTime;
        _this.setData({
          current: _this.getTime(currentTime),
          offset: Math.round(currentTime * 1000 / 1000),
          isPlay: true 
        });
      });
      // 监听音频结束
      audioCont.onEnded(() => {
        _this.pauseAudio();
      });
      audioCont.onError((err) => {
        console.log(err, '音频失败', errInfo[parseInt(err.errCode)]);
      });
    },
    // 暂停音频
    pauseAudio () {
      audioCont.pause();
      audioCont.offPlay();
      audioCont.offEnded();
      this.setData({ 
        isPlay: false 
      });
    },
    // 进度条拖拽
    sliderChange (e) {
      let offset = +e.detail.value;
      audioCont.seek(offset);
      audioCont.onSeeked(() => {
        this.setData({
          current: this.getTime(offset),
          offset
        });
        this.playAudio();
      });
    },
    // 处理时间格式
    getTime (t) {
      let time = Math.round(t * 1000 / 1000);
      const s = common.formatNumber(time % 60),
        m = parseInt(time / 60) % 60,
        h = parseInt(time / 60 / 60);
      if (h) {
        return `${common.formatNumber(h)}:${common.formatNumber(m)}:${s}`;
      } else {
        return `${common.formatNumber(m)}:${s}`;
      }
    },
    lastPlay () {
      let index = this.data.curPlayIndex;
      if (index) {
        if (this.data.trees[index-1].status === 0) {
          wx.showToast({
            title: '资源更新中',
            icon: 'none'
          });
          return;
        } else {
          this.setData({ curPlayIndex: index-1 });
          wx.setStorageSync('curPlayIndex', index-1);
          this.changeAudioCurPlay();
        }
      } else {
        wx.showToast({
          title: '已经是第一个～',
          icon: 'none'
        });
      }
    },
    nextPlay () {
      let index = this.data.curPlayIndex;
      if (index < this.data.trees.length - 1) {
        if (this.data.trees[index+1].status === 0) {
          wx.showToast({
            title: '资源更新中',
            icon: 'none'
          });
          return;
        } else {
          this.setData({ curPlayIndex: index+1 });
          wx.setStorageSync('curPlayIndex', index+1);
          this.changeAudioCurPlay();
        }
      } else {
        wx.showToast({
          title: '已经是最后一个～',
          icon: 'none'
        });
      }
    },
    // 切换音频课时
    changeAudioCurPlay () {
      this.pauseAudio();
      this.triggerEvent('record', {
        curPlayId: this.data.curPlayId,
        type: 2,
        current: this.data.offset * 1000,
        duration: this.data.max * 1000,
        learnTime: new Date().getTime()-this.data.startTime
      });
      this.setData({
        startTime: new Date().getTime()
      });
      let item = this.data.trees[this.data.curPlayIndex];
      this.setData({
        isPlay: false,
        current: '00:00',
        duration: '00:00', 
        offset: 0
      });
      if (this.data.courseInfo.isbuy || item.foruse) {
        this.setData({ curPlayId: parseInt(item.section_id) });
        wx.setStorageSync('curPlayId', parseInt(item.section_id));
        this.triggerEvent('judgeType', {
          type: 2
        });
      } else {
        this.setData({
          picUrl: [],
          audioUrl: ''
        });
        wx.showToast({
          title: '当前课时未购买',
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
    // 切换音频源
    changeAudioUrl () {
      if (this.data.isComment) {
        this.setData({
          audioUrl: this.data.curComment.audio_url,
          picUrl: this.data.curComment.pic_url
        });
        audioCont.title = this.data.curComment.evaluation_name;  //bug ios 播放时必须加title 不然会报错导致音乐不播放
        audioCont.src = this.data.curComment.audio_url;
        if (this.data.audioUrl) {  
          this.playAudio();
        }
        return; 
      }
      let index = this.data.trees.findIndex(item => {
        return item.section_id === this.data.curPlayId;
      });
      let item = this.data.trees[index];
      this.setData({
        audioUrl: item.audio_url,
        picUrl: item.pic_url,
        curPlayIndex: index
      });
      wx.setStorageSync('curPlayIndex', index);
      audioCont.title = item.section_name;  //bug ios 播放时必须加title 不然会报错导致音乐不播放
      audioCont.src = item.audio_url;
      // console.log('audio进度', item.study_schedule.audeo_duration / 1000);
      audioCont.seek(item.study_schedule.audeo_duration / 1000);
      if (item.audio_url) {  
        this.playAudio();
      }
    }
  }

});