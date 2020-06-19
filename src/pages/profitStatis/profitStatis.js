const { profitStatis } = require('../../api.config');
const { ajax } = require('../../utils/util');
const { formatTimeTwo, formatMoney } = require('../../utils/common');
// import * as echarts from '../../ec-canvas/echarts';
const echarts = require('../../ec-canvas/echarts');
var dataX = [];
function setOption(chart) {
  const option = {
    // 系列组件，控制图表类型，如饼图、折线图等
    series: [{
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      legendHoverLink: true,  // 是否启用图例 hover 时的联动高亮。
      hoverAnimation: true,   // 是否开启 hover 在扇区上的放大动画效果。
      hoverOffset: 10,
      // 文本标签的视觉引导线
      labelLine: {
        length: 10,
        length2: 20
      },
      // 设置扇区图形样式
      itemStyle: {
        color: function ( params ) {
          var colorArr = [ '#ffca2c', '#76d689' ];
          return colorArr[ params.dataIndex ];
        }
      },
      // 设置高亮样式
      emphasis: {
        itemStyle: {
        }
      },
      data: dataX
    }]
  };
  chart.setOption(option);
}
Page({
  data: {
    date: '', // 时间
    type: 2,           // 1 年选择 2月选择
    list: [],
    showMask: false,

    years: [],
    year: null,
    months: [],
    month: null,
    value: [],
    dateTime: []
  },
  onLoad(options) {
    console.log(options);
    wx.showLoading({
      title: '加载中...'
    });
    const date = new Date();
    const value = [];
    const years = [];
    const months = [];
    for (let i = 2018; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    let time = '';
    if(date.getMonth() + 1 > 9) {
      time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01' + ' 00:00:00';
    } else {
      time = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01' + ' 00:00:00';
    }
    years.forEach((item,index) => {
      if(item === date.getFullYear()) {
        value.push(index);
      }
    });
    value.push(date.getMonth());
    this.setData({
      years: years,
      months: months,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      value: value,
      date: (new Date(time)).getTime()
    });
    this.getUserInfo();    
  },
  lineInit: function () {
    this.ecComponent = this.selectComponent('#mychart-dom-line');
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;
      this.setData({
        isLineLoaded: true,
        isLineDisposed: false
      });
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },
  // 打开弹框
  showDates: function () {
    this.setData({
      showMask: true
    });
  },
  // 阻止冒泡点击
  stopClick: function () {
    return false;
  },
  // 保存数据
  gradeChange(e) {
    this.setData({
      value: e.detail.value
    });
  },
  // 完成选择日期
  ConfirmGrade() {
    if(this.data.type === 2) {
      let time = '';
      if(this.data.months[this.data.value[1]] > 9) {
        time = this.data.years[this.data.value[0]] + '-' + this.data.months[this.data.value[1]] + '-01' + ' 00:00:00';
      } else {
        time = this.data.years[this.data.value[0]] + '-0' + this.data.months[this.data.value[1]] + '-01' + ' 00:00:00';
      }
      this.setData({
        showMask: false,
        year: this.data.years[this.data.value[0]],
        month: this.data.months[this.data.value[1]],
        date: (new Date(time)).getTime()
      });
      console.log(time);
    } else {
      let time = this.data.years[this.data.value[0]] + '-01' + '-01' + ' 00:00:00';
      this.setData({
        showMask: false,
        year: this.data.years[this.data.value[0]],
        date: (new Date(time)).getTime()
      });
      console.log(time);
    }
    console.log(this.data.date);
    this.getUserInfo();
  },
  // 取消弹框
  CancelGrade() {
    this.setData({
      showMask: false
    });
  },
  // 选择按年/按月
  selectBtn(e) {
    this.setData({
      type: e.currentTarget.dataset.type - 0
    });
  },
  // 获取收益统计
  getUserInfo() {
    const data = {
      date: this.data.date,
      type: this.data.type
    };
    ajax(profitStatis, {data, method: 'get'}).then(res => {
      if (res.code === 0) {
        let list = res.data.list;
        let data = [
          { 
            value: res.data.kinMoney, 
            name: `¥${(res.data.kinMoney/100).toFixed(2)}\n园长收益` 
          },
          { 
            value: res.data.juniorMoney, 
            name: `¥${(res.data.juniorMoney/100).toFixed(2)}\n下级收益` 
          }
        ];
        dataX = data;
        this.lineInit();
        list.forEach(item => {
          item.money = formatMoney(item.money);
          item.date = formatTimeTwo(+item.date,'M.D h:m');
        });
        this.setData({
          list: list,
          totalMoney: formatMoney(res.data.totalMoney),
          juniorMoney: formatMoney(res.data.juniorMoney),
          kinMoney: formatMoney(res.data.kinMoney),
        });
        wx.hideLoading();
      }
    });
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
      