Page({

  /**
   * 页面的初始数据
   */
  data: {
    isvideo: false,
    jiedulist: [{
      id: 0,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdbsdfxxetg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/anli_08.jpg',
      text: '北师大专家冯晓霞教授'
    }, {
      id: 1,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdnsdyypetg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/anli_10.jpg',
      text: '南师大专家虞永平教授'
    }, {
      id: 2,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdssdxhyetg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/anli_14.jpg',
      text: '首师大专家向海英教授'
    }, {
      id: 3,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/c0698fznyow.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/anli_16.jpg',
      text: '华师大专家李季湄教授'
    }, ],
    gdlist: [{
      id: 4,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdbsdfxxkcg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/gd_08.jpg',
      text: '北师大专家冯晓霞教授'
    }, {
      id: 5,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdnsdyypkcg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/gd_11.jpg',
      text: '南师大专家虞永平教授'
    }, {
      id: 6,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdssdxhykcg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/gd_15.jpg',
      text: '首师大专家向海英教授'
    }, {
      id: 7,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/c0698fznyow.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/gd_17.jpg',
      text: '华师大专家李季湄教授'
    }, ],
    Alist: [{
      id: 8,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdbsdfxxjyg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/a_03.jpg',
      text: '北师大专家冯晓霞教授'
    }, {
      id: 9,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdnsdyypjyg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/a_06.jpg',
      text: '南师大专家虞永平教授'
    }, {
      id: 10,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmzjjd/zxmzjjdssdxhyjyg.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/a_10.jpg',
      text: '首师大专家向海英教授'
    }, {
      id: 11,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/c0698fznyow.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/a_12.jpg',
      text: '华师大专家李季湄教授'
    }, ],
    Clist: [{
      id: 12,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmsxtxjd/zxmsxtxjdyhz.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/cc_03.jpg',
      text: '杨秀治会长谈回归教育本真'
    }, {
      id: 13,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmsxtxjd/zxmsxtxjdsxyy.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/cc_05.jpg',
      text: '赵秀敏秘书长学习思想感悟'
    }, {
      id: 14,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmsxtxjd/zxmsxtxjdzyz.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/cc_09.jpg',
      text: '朱继文园长论儿童的深度学习'
    }, {
      id: 15,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmsxtxjd/zxmsxtxjdlyz.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/cc_10.jpg',
      text: '刘晓颖园长解读张雪门课程观'
    }, ],
    Dlist: [{
      id: 16,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmxwkc/zxmxwkccd.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_03.jpg',
      text: '杨蚕豆为什么没能结豆子？'
    }, {
      id: 17,
      vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmxwkc/zxmxwkcll.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_05.jpg',
      text: '客人来了'
    }, 
    // {
    //   id: 18,
    //   vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmxwkc/zxmxwkcyx.mp4',
    //   img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_09.jpg',
    //   text: '好玩的滚动游戏'
    // }, {
    //   id: 19,
    //   vidoe_src: 'http://res.bnuxq.net/ZXMZWH/zxmxwkc/zxmxwkcgz.mp4',
    //   img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_10.jpg',
    //   text: '恐龙找工作'
    // },
    {
      id: 18,
      vidoe_src: 'http://res.bnuxq.net/YKLY/10.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_11.png',
      text: '寻找石头宝贝'
    }, {
      id: 19,
      vidoe_src: 'http://res.bnuxq.net/YKLY/06.mp4',
      img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/dd_12.png',
      text: '恐龙找工作白色垃圾的宣传'
    }
    ],
    //专家团队
    groupList: [
      {
        id: 0,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/zhuanjia/zhujiwen.jpg',
        text: '专委会主任，北京丰台区一幼园长',
        people_name: '朱继文'
      },
      {
        id: 1,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/zp.jpg',
        text: '专委会副主任，北京第五幼儿园长',
        people_name: '邹平'
      },
      {
        id: 2,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/peng.jpg',
        text: '专委会副主任，东华门幼儿园园长',
        people_name: '彭迎春'
      },
      {
        id: 3,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/wu.jpg',
        text: '专委会副主任，立新学校幼儿园长',
        people_name: '武春静'
      },
      {
        id: 4,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/zxm.jpg',
        text: '专委会秘书长，丰台一幼副园长',
        people_name: '赵秀敏'
      },
      {
        id: 5,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/zhangyan.jpg',
        text: '特聘专家，北师大教授',
        people_name: '张燕'
      },
      {
        id: 6,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/mrzhang/jwg.jpg',
        text: '特聘顾问，张雪门先生的亲属',
        people_name: '焦万曼'
      },
      {
        id: 7,
        img: 'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/zhuanjia/liuzhiyue.jpg',
        text: '专委会成员，丰台一幼保教主任',
        people_name: '刘志月'
      }
    ],
  },

  // 点击
  click: function (e) {
    let src = e.currentTarget.dataset.src;
    this.setData({
      isvideo: true,
      src: src
    });
  },
  // 关闭视频 
  clsoe: function () {
    this.setData({
      isvideo: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

});