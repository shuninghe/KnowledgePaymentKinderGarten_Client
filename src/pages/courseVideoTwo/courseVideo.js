const { courseRecord, courseSections, courseDetail } = require('../../api.config');
const { ajax } = require('../../utils/util');

Page({
  data: {
    sourceType: null,     // 当前打开的类型：1 视频 2 音频 3 pdf 4 图文
    sourceList: [0, 0, 0],// 该课时是否含各资源类型[视频, 音频, pdf]
    isComment: 0,         // 是否是点评类型
    curComment: {},       // 点评数据
    statusBarHeight: getApp().globalData.statusBarHeight + 'px',
    navigationBarHeight: (getApp().globalData.statusBarHeight + 44) + 'px',
    courseInfo: null,     // 课程信息
    section_id: null,     // 所在系列id
    section_name: '',     // 所在系列name
    trees: [],
    fromShare: null       
  },
  
  // 切换课程资源类型
  changeType (e) {
    let type;
    if (typeof(e) !== 'object') {
      type = e;
    } else {
      type = parseInt(e.currentTarget.dataset.type);      
    }
    switch (type) {
    case 1:
      this.setData({ sourceType: type });
      this.selectComponent('#component-video').changeVideoUrl();
      break;
    case 2:
      this.setData({ sourceType: type });
      this.selectComponent('#component-audio').changeAudioUrl();
      break;
    case 3:
      this.prewViewFile();        
      break;
    case 4:
      this.openTextImgUrl();    
      break;
    default:
      break;
    }
    
  },
  // 添加学习课程记录(组件)
  addStudyRecord (e) {
    let noVideo = this.data.sourceType===1 && !e.detail.duration; // 暂未加载到视频资源
    // let noAudio = this.data.sourceType===2 && !e.detail.duration; // 暂未加载到音频资源 
    if (noVideo || this.data.isComment) {
      return;
    } else {
      let curPlayId = e.detail.curPlayId;
      let curPlayIndex = this.data.trees.findIndex(item => {
        return item.section_id === curPlayId;
      }); 
      let params = {
        course_id: +this.data.courseInfo.course_id,     // 课程编号
        section_id: curPlayId,                          // 课时编号
        click_type: 1,                                  // 播放类型 0、开始播放 1、完成
        study_duration: e.detail.current,               // 学习时长 【可选，v2.4新增】
        resource_type: e.detail.type,                   // 学习资源类型  1 视频  2 音频 3 pdf 4 图文（3，4新增）
        resource_time: e.detail.duration,               // 学习资源时长   【可选 v2.4新增】
        learn_time: e.detail.learnTime || 0             // 学习时长 
      };
      ajax(courseRecord, {data: params, method: 'POST'}).then(res => {
        if (res.code === 0) {
          // 更新课时进度
          let { section_id, section_name, trees } = this.data;
          if (this.data.sourceType === 1) {
            this.setData({
              [`trees[${curPlayIndex}].study_status`]: res.data.study_status,
              [`trees[${curPlayIndex}].study_schedule.study_duration`]: res.data.study_schedule.study_duration
            });
          } 
          if (this.data.sourceType === 2) {
            let index = trees.findIndex(item => {
              return item.section_id === curPlayId;
            });
            this.setData({
              [`trees[${index}].study_status`]: res.data.study_status,
              [`trees[${index}].study_schedule.audeo_duration`]: res.data.study_schedule.audeo_duration
            });
          }
          wx.setStorageSync(`tree_${section_id}`, {
            section_name,
            child_trees: trees
          });
        }
      });
    }
  },
  // 添加学习课程记录(PDF和图文)
  addSimpleRecord () {
    let params = {
      course_id: +this.data.courseInfo.course_id,     // 课程编号
      section_id: wx.getStorageSync('curPlayId'),     // 课时编号
      click_type: 1,                                  // 播放类型 0、开始播放 1、完成
      study_duration: 0,                              // 学习时长 【可选，v2.4新增】
      resource_type: this.data.openPdf ? 3 : 4,       // 学习资源类型  1 视频  2 音频 3 pdf 4 图文（3，4新增）
      resource_time: 0,                               // 学习资源时长   【可选 v2.4新增】
      learn_time: new Date().getTime()-this.data.startTime || 0           // 学习时长 
    };
    ajax(courseRecord, {data: params, method: 'POST'}).then(res => {
      if (res.code === 0) {
        // 提交PDF或图文学习时长
        console.log('提交PDF或图文学习时长');
      }
    });
  },
  // 打开PDF文件
  prewViewFile() {
    if (this.data.sourceType === 1) {
      this.selectComponent('#component-video').pauseVideo();
    } else if (this.data.sourceType === 2) {
      this.selectComponent('#component-audio').pauseAudio();      
    }
    let index = this.data.trees.findIndex(item => {
      return item.section_id === wx.getStorageSync('curPlayId');
    });
    let pdfUrl = this.data.trees[index].pdf_url;
    wx.showLoading({
      title: '文档打开中',
      mask: true
    });
    let _this = this;
    wx.downloadFile({
      url: pdfUrl,
      success (res) {
        const filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
          success () {
            wx.hideLoading();
            _this.setData({ 
              openPdf: true,
              startTime: new Date().getTime() 
            });
          },
          fail (err) {
            wx.hideLoading();
            wx.showToast({
              title: '文档打开失败',
              icon: 'none'
            });
            console.log('wx.openDocument失败', err);
          }
        });
      },
      fail (err) {
        wx.hideLoading();
        wx.showToast({
          title: '文档打开失败',
          icon: 'none'
        });
        console.log('wx.downloadFile失败', err);
      }
    });
  },
  // 跳转webview打开图文链接
  openTextImgUrl () {
    this.setData({
      openTextImg: true,
      startTime: new Date().getTime() 
    });
    let index = this.data.trees.findIndex(item => {
      return item.section_id === wx.getStorageSync('curPlayId');
    });
    let textImgUrl = this.data.trees[index].text_img_url;
    wx.navigateTo({
      url: `/pages/outHtml/outHtml?url=${textImgUrl}`
    });  
  },

  /* ==========公共获取========== */  
  // 获取系列下的课时、获取课程下某个课时
  getSections (course_id, section_id, isSeries) {
    return new Promise((resolve, reject) => {
      let params = {
        course_id,    //课程编号
        section_id,    //系列或课时编号
        type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
      };
      ajax(courseSections, {data: params}).then(res => {
        if (res.code === 0) {
          if (res.data.child_trees.length === 0) {
            wx.showToast({
              title: '暂无课时',
              icon: 'none',
              duration: 1500,
              mask: false,
              success: () => {
                setTimeout(() => {
                  if (getCurrentPages().length > 1) {
                    wx.navigateBack({ delta: 1 });                
                  } else {
                    wx.redirectTo({
                      url: `/pages/courseDetail/courseDetail?id=${course_id}`
                    });
                  }
                }, 1500);
              }
            });
            return;
          }
          // 课程下直接是系列
          if (isSeries) {
            this.setData({
              section_id: section_id,
              section_name: res.data.section_name,
              trees: res.data.child_trees
            });
          } else {
            this.setData({
              section_id: 'c' + course_id,
              section_name: res.data.course_name,
              trees: res.data.child_trees
            });
          }
          // 确定知识图谱要播的课时
          if (!wx.getStorageSync('curPlayId')) { 
            let newArr = res.data.child_trees.filter(item => {
              return item.status === 1;
            });
            if (newArr.length) {
              let index = newArr.findIndex(item => {
                return item.study_status !== 2;
              });
              if (index === -1) {
                wx.setStorageSync('curPlayId', newArr[0].section_id);
              } else {
                wx.setStorageSync('curPlayId', newArr[index].section_id);                
              }
            } else {
              wx.showToast({
                title: '资源更新中',
                icon: 'none',
                mask: true,
                success () {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    });
                  }, 1500);
                }
              });
            }
          }
          resolve();
        } else {
          reject();
        }
      }).catch((err) => {
        wx.showToast({
          title: err.msg,
          icon: 'none',
          mask: true,
          duration: 1500,
          success () {
            setTimeout(() => {
              if (getCurrentPages().length > 1) {
                wx.navigateBack({ delta: 1 });                
              } else {
                wx.reLaunch({
                  url: '/pages/index/index'
                });
              }
            }, 1500);
          }
        });
        reject();
      });
    });
  },
  // 获取课程详情
  getCourseDetail (course_id) {
    return new Promise((resolve, reject) => {
      let params = { 
        course_id,
        type: wx.getStorageSync('functionConfig').sections_type || '1,2' // 课时类型 1已发布 2未发布
      };
      ajax(courseDetail, {data: params}).then(res => {
        if (res.code === 0) {
          let { product_id, pic, name, price, course_resume, is_knowledge_map, isbuy, is_series, trees, validity } = res.data; 
          isbuy = isbuy ? (validity < Date.parse(new Date()) ? 0 : 1) : 0;
          if (trees.length === 0) {
            wx.showToast({
              title: '暂无课时',
              icon: 'none',
              success: () => {
                setTimeout(() => {
                  if (getCurrentPages().length > 1) {
                    wx.navigateBack({ delta: 1 });                
                  } else {
                    wx.redirectTo({
                      url: `/pages/courseDetail/courseDetail?id=${course_id}`
                    });
                  }
                }, 1500);
              }
            });
            return;
          }
          // 课程下直接是课时
          if (!is_series) {
            this.setData({
              section_id: 'c' + course_id,
              section_name: name,
              trees: trees
            });
          }
          wx.setStorageSync('courseInfo', {
            product_id, course_id, name, pic, course_resume, price, isbuy, is_knowledge_map
          });
          this.setData({ courseInfo: wx.getStorageSync('courseInfo') });
          resolve();
        }
      }).catch((err) => {
        wx.hideLoading();
        reject(err);
      });
    });
  },
  // 判断sourceType, 播放对应资源
  judgeType (e = null) {
    wx.hideLoading();
    let index = this.data.trees.findIndex(item => {
      return item.section_id === wx.getStorageSync('curPlayId');
    });
    let item = this.data.trees[index];
    let { courseInfo } = this.data;
    // 点评数据
    if (this.data.isComment) {
      item = this.data.curComment;
    } else if (!courseInfo.isbuy && !item.foruse) {
      wx.showToast({
        title: '当前课时未购买，请先购买后观看',
        icon: 'none',
        duration: 1500,
        mask: false,
        success: () => {
          setTimeout(() => {
            if (getCurrentPages().length > 1) {
              wx.navigateBack({ delta: 1 });                
            } else if (courseInfo.is_knowledge_map) {
              wx.redirectTo({
                url: `/pages/knowledgeGraph/knowledgeGraph?id=${courseInfo.course_id}`
              });
            } else {
              wx.redirectTo({
                url: `/pages/courseDetail/courseDetail?id=${courseInfo.course_id}`
              });
            }
          }, 1500);
        }
      });
      return;
    }
    // 导航栏中的按钮
    this.setData({
      ['sourceList[0]']: item.video_url ? 1: 0,
      ['sourceList[1]']: item.audio_url || item.pic_url.length ? 1: 0,
      ['sourceList[2]']: item.pdf_url ? 1: 0,
      ['sourceList[3]']: item.text_img_url ? 1: 0
    });
    // 判断分享的哪个资源类型
    if (this.data.fromType) {
      this.changeType(this.data.fromType);
      this.setData({ fromType: null });
      return;
    }
    // 音频切换课时
    if (e !== null && JSON.stringify(e.detail) !== '{}') {
      if (item.audio_url || item.pic_url.length) {
        this.setData({ sourceType: 2 });
        this.selectComponent('#component-audio').changeAudioUrl();
        return;
      }
    }
    // 判断正常进入播放哪个资源
    if (item.video_url) {
      this.setData({ sourceType: 1 });
      this.selectComponent('#component-video').changeVideoUrl();
    } else if (item.audio_url || item.pic_url.length) {
      this.setData({ sourceType: 2 });
      this.selectComponent('#component-audio').changeAudioUrl();
    } else if (item.pdf_url) {
      this.setData({ sourceType: 3 });
      this.prewViewFile();
    } else if (item.text_img_url) { // todo只有pdf和图文链接
      this.setData({ sourceType: 4 });
      this.openTextImgUrl();
    } else {
      console.log('该课时下无任何资源');
      return;
    }
  },

  onLoad(option) {
    console.log('option', option);
    // 清除缓存的点评数据
    if (getCurrentPages().length === 1) {
      this.setData({ fromShare: true });
      wx.removeStorageSync('curComment');  
    }
    // 点评
    if (wx.getStorageSync('curComment')) {
      let obj = wx.getStorageSync('curComment');
      this.setData({
        isComment: 1,
        curComment: obj
      });
      this.judgeType();
      return;
    }
    // 通过课程id、系列id或课时id直接获取数据
    let { course_id, section_id, curPlayId, fromType } = option;
    this.setData({ fromType: parseInt(fromType) });
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    if (curPlayId) wx.setStorageSync('curPlayId', parseInt(curPlayId));   // 知识图谱和课程详情   
    if (section_id) { // 来自知识图谱、课程详情
      Promise.all([
        this.getSections(parseInt(course_id), parseInt(section_id), 1),
        this.getCourseDetail(parseInt(course_id))
      ]).then(() => {
        this.judgeType();                      
      });
    } else { // 来自首页试听课时
      // wx.setStorageSync('courseInfo', { 
      //   course_id: course_id,
      //   isbuy: 1
      // });
      Promise.all([
        this.getSections(parseInt(course_id), parseInt(curPlayId), 0),
        this.getCourseDetail(parseInt(course_id))
      ]).then(() => {
        this.judgeType();                      
      });
      // this.getSections(parseInt(course_id), parseInt(curPlayId), 0).then(() => {
      //   this.getCourseDetail(parseInt(course_id)).then(() => {
      //     this.judgeType();
      //   });
      // }); 
    } 
  },
  
  onReady() {
    // Do something when page ready.
  },

  onShow() {
    // 提交PDF和图文学习记录
    if (this.data.openPdf || this.data.openTextImg) {
      this.addSimpleRecord();
      wx.navigateBack({ delta: 1 });
      return;
    }
    wx.hideShareMenu(); // 关闭页面系统分享功能
    // 清除缓存的点评数据
    let pages = getCurrentPages();
    console.log(pages, 'pages');
    if (pages.length > 1 ) {
      if (pages[pages.length - 2].route !== 'pages/courseVideo/courseVideo') {
        wx.removeStorageSync('curComment');              
      }
    }
  },
  onHide() {

  },
  onUnload () {
    wx.removeStorageSync('curPlayIndex');
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage(e) {
    if (e.from === 'button') {
      let { sourceType, courseInfo, section_id, trees } = this.data;
      let curPlayId = wx.getStorageSync('curPlayId');
      let curPlayIndex = wx.getStorageSync('curPlayIndex');
      if (section_id.indexOf('c') !== -1) {
        section_id = curPlayId;
      } 
      return {
        title: trees[curPlayIndex].section_name,
        path: `pages/courseVideo/courseVideo?course_id=${courseInfo.course_id}&section_id=${section_id}&curPlayId=${curPlayId}&fromType=${sourceType}&fromShare=${true}`
      };
    } 
  },
  onPageScroll() {
    // Do something when page scroll
  },
  onTabItemTap() {
    // 当前是 tab 页时，点击 tab 时触发
  },
  customData: {}
});
