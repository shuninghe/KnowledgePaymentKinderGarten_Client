Component({
  /**
   * @param {String} mode 进度条样式 round圆形
   * @param {String} percent 百分比
   * @param {String} color 实际进度条的颜色
   * @param {String} bgcolor 剩余进度条的颜色
   * @param {String} width 进度条的宽
   * @param {String} height 进度条的高
   * @param {String} padLeft 百分比文本距离左侧进度条的距离
   * @param {String} textSize 百分比文本的字号
   */
  properties: {
    mode: {
      type: String,
      value: 'round' 
    },
    percent: {
      type: String,
      value: '0'
    },
    color: {
      type: String,
      value: 'linear-gradient(90deg,rgba(255,157,0,1),rgba(255,190,0,1))'
    },
    bgcolor: {
      type: String,
      value: '#fff'
    },
    width: {
      type: String,
      value: '750'
    },
    height: {
      type: String,
      value: '20'
    },
    padLeft: {
      type: String,
      value: '20'
    },
    textSize: {
      type: String,
      value: '28'
    }
  }

});