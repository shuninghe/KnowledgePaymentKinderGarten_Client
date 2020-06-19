!function(n, t) {
  'object' == typeof exports && 'undefined' != typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define(t) : n.Ald = t();
}(this, function() {
  var EVENT_ENUMS = [{
    event: 'openID',              // 事件ID openID、start、close
    name: '微信ID',               // 事件名称 微信ID、启动、关闭
  },{
    event: 'start',              // 事件ID openID、start、close
    name: '启动',               // 事件名称 微信ID、启动、关闭
  },{
    event: 'close',              // 事件ID openID、start、close
    name: '关闭',               // 事件名称 微信ID、启动、关闭
  }] // 事件枚举值
  var SCENE_LIST = [{
    SceneValueID: 1000,	
    Description: '其他'
  },{
    SceneValueID: 1001,	
    Description: '发现栏小程序主入口，「最近使用」列表（基础库2.2.4版本起包含「我的小程序」列表）'
  },{
    SceneValueID: 1005,	
    Description: '微信首页顶部搜索框的搜索结果页'
  },{
    SceneValueID: 1006,	
    Description: '发现栏小程序主入口搜索框的搜索结果页'
  },{
    SceneValueID: 1007,	
    Description: '单人聊天会话中的小程序消息卡片'
  },{
    SceneValueID: 1008,	
    Description: '群聊会话中的小程序消息卡片'
  },{
    SceneValueID: 1011,	
    Description: '扫描二维码'
  },{
    SceneValueID: 1012,	
    Description: '长按图片识别二维码'
  },{
    SceneValueID: 1013,	
    Description: '扫描手机相册中选取的二维码'
  },{
    SceneValueID: 1014,	
    Description: '小程序模板消息'
  },{
    SceneValueID: 1017,	
    Description: '前往小程序体验版的入口页'
  },{
    SceneValueID: 1019,	
    Description: '微信钱包（微信客户端7.0.0版本改为支付入口）'
  },{
    SceneValueID: 1020,	
    Description: '公众号 profile 页相关小程序列表（已废弃）'
  },{
    SceneValueID: 1022,	
    Description: '聊天顶部置顶小程序入口（微信客户端6.6.1版本起废弃）'
  },{
    SceneValueID: 1023,	
    Description: '安卓系统桌面图标'
  },{
    SceneValueID: 1024,	
    Description: '小程序 profile 页'
  },{
    SceneValueID: 1025,	
    Description: '扫描一维码'
  },{
    SceneValueID: 1026,	
    Description: '发现栏小程序主入口，「附近的小程序」列表'
  },{
    SceneValueID: 1027,	
    Description: '微信首页顶部搜索框搜索结果页「使用过的小程序」列表'
  },{
    SceneValueID: 1028,	
    Description: '我的卡包'
  },{
    SceneValueID: 1029,	
    Description: '小程序中的卡券详情页'
  },{
    SceneValueID: 1030,	
    Description: '自动化测试下打开小程序'
  },{
    SceneValueID: 1031,	
    Description: '长按图片识别一维码'
  },{
    SceneValueID: 1032,	
    Description: '扫描手机相册中选取的一维码'
  },{
    SceneValueID: 1034,	
    Description: '微信支付完成页'
  },{
    SceneValueID: 1035,	
    Description: '公众号自定义菜单'
  },{
    SceneValueID: 1036,	
    Description: 'App 分享消息卡片'
  },{
    ceneValueID: 1037,	
    Description: '小程序打开小程序'
  },{
    SceneValueID: 1038,	
    Description: '从另一个小程序返回'
  },{
    SceneValueID: 1039,	
    Description: '摇电视'
  },{
    SceneValueID: 1042,	
    Description: '添加好友搜索框的搜索结果页'
  },{
    SceneValueID: 1043,	
    Description: '公众号模板消息'
  },{
    SceneValueID: 1044,	
    Description: '带 shareTicket 的小程序消息卡片 详情'
  },{
    SceneValueID: 1045,	
    Description: '朋友圈广告'
  },{
    SceneValueID: 1046,	
    Description: '朋友圈广告详情页'
  },{
    SceneValueID: 1047,	
    Description: '扫描小程序码'
  },{
    SceneValueID: 1048,	
    Description: '长按图片识别小程序码'
  },{
    SceneValueID: 1049,	
    Description: '扫描手机相册中选取的小程序码'
  },{
    SceneValueID: 1052,	
    Description: '卡券的适用门店列表'
  },{
    SceneValueID: 1053,	
    Description: '搜一搜的结果页'
  },{
    SceneValueID: 1054,	
    Description: '顶部搜索框小程序快捷入口（微信客户端版本6.7.4起废弃）'
  },{
    SceneValueID: 1056,	
    Description: '聊天顶部音乐播放器右上角菜单'
  },{
    SceneValueID: 1057,	
    Description: '钱包中的银行卡详情页'
  },{
    SceneValueID: 1058,	
    Description: '公众号文章'
  },{
    SceneValueID: 1059,	
    Description: '体验版小程序绑定邀请页'
  },{
    SceneValueID: 1064,	
    Description: '微信首页连Wi-Fi状态栏'
  },{
    SceneValueID: 1067,	
    Description: '公众号文章广告'
  },{
    SceneValueID: 1068,	
    Description: '附近小程序列表广告（已废弃）'
  },{
    SceneValueID: 1069,	
    Description: '移动应用'
  },{
    SceneValueID: 1071,	
    Description: '钱包中的银行卡列表页'
  },{
    SceneValueID: 1072,	
    Description: '二维码收款页面'
  },{
    SceneValueID: 1073,	
    Description: '客服消息列表下发的小程序消息卡片'
  },{
    SceneValueID: 1074,	
    Description: '公众号会话下发的小程序消息卡片'
  },{
    SceneValueID: 1077,	
    Description: '摇周边'
  },{
    SceneValueID: 1078,	
    Description: '微信连Wi-Fi成功提示页'
  },{
    SceneValueID: 1079,	
    Description: '微信游戏中心'
  },{
    SceneValueID: 1081,	
    Description: '客服消息下发的文字链'
  },{
    SceneValueID: 1082,	
    Description: '公众号会话下发的文字链'
  },{
    SceneValueID: 1084,	
    Description: '朋友圈广告原生页'
  },{
    SceneValueID: 1088,	
    Description: '会话中查看系统消息，打开小程序'
  },{
    SceneValueID: 1089,	
    Description: '微信聊天主界面下拉，「最近使用」栏（基础库2.2.4版本起包含「我的小程序」栏）'
  },{
    SceneValueID: 1090,	
    Description: '长按小程序右上角菜单唤出最近使用历史'
  },{
    SceneValueID: 1091,	
    Description: '公众号文章商品卡片'
  },{
    SceneValueID: 1092,	
    Description: '城市服务入口'
  },{
    SceneValueID: 1095,	
    Description: '小程序广告组件'
  },{
    SceneValueID: 1096,	
    Description: '聊天记录，打开小程序'
  },{
    SceneValueID: 1097,	
    Description: '微信支付签约原生页，打开小程序'
  },{
    SceneValueID: 1099,	
    Description: '页面内嵌插件'
  },{
    SceneValueID: 1102,	
    Description: '公众号 profile 页服务预览'
  },{
    SceneValueID: 1103,	
    Description: '发现栏小程序主入口，「我的小程序」列表（基础库2.2.4版本起废弃）'
  },{
    SceneValueID: 1104,	
    Description: '微信聊天主界面下拉，「我的小程序」栏（基础库2.2.4版本起废弃）'
  },{
    SceneValueID: 1106,	
    Description: '聊天主界面下拉，从顶部搜索结果页，打开小程序'
  },{
    SceneValueID: 1107,	
    Description: '订阅消息，打开小程序'
  },{
    SceneValueID: 1113,	
    Description: '安卓手机负一屏，打开小程序（三星）'
  },{
    SceneValueID: 1114,	
    Description: '安卓手机侧边栏，打开小程序（三星）'
  },{
    SceneValueID: 1124,	
    Description: '扫“一物一码”打开小程序'
  },{
    SceneValueID: 1125,	
    Description: '长按图片识别“一物一码”'
  },{
    SceneValueID: 1126,	
    Description: '扫描手机相册中选取的“一物一码”'
  },{
    SceneValueID: 1129,	
    Description: '微信爬虫访问 详情'
  },{
    SceneValueID: 1131,	
    Description: '浮窗打开小程序'
  },{
    SceneValueID: 1146,	
    Description: '地理位置信息打开出行类小程序'
  },{
    SceneValueID: 1148,	
    Description: '卡包-交通卡，打开小程序'
  },{
    SceneValueID: 1150,	
    Description: '扫一扫商品条码结果页打开小程序'
  },{
    SceneValueID: 1153,	
    Description: '识物”结果页打开小程序'  
  }] // 场景值枚举

  var CONFIG = require('./sdk-conf');
  CONFIG.useOpen && console.warn('提示：开启了useOpen配置后，如果不上传用户opendId则不会上报数据。');

  var BASE_URL = CONFIG.url;
  var URL_PUSH_USER = BASE_URL + '/api/collect/push/user';        // 上报用户
  var URL_PUSH_EVENT = BASE_URL + '/api/collect/push/events';     // 上报事件
  var URL_PUSH_PAGES = BASE_URL + '/api/collect/push/page-views'; // 上报页面

  var key = CONFIG.key;
  var uuid = function() {
    var n = '';
    n = wx.getStorageSync('sdk_uuid');
    if (!n) {
      n = w();
      wx.setStorageSync('sdk_uuid', n)
    }
    return n;
  }();
  var openId = function() {
    var n = '';
    try {
      n = wx.getStorageSync('sdk_op');
    } catch (n) {}
    return n;
  }();
  var equipment;
  
  var EVENTS = []; // 事件
  var EVENTS_TIMER = setInterval(() => {
    pushEvent()
  }, 300000); //5min
  var PAGES = []; // 页面
  var PAGES_TIMER = setInterval(() => {
    pushPages()
  }, 360000); //6min

  // 获取系统信息
  try {
    var vn = wx.getSystemInfoSync();
    equipment = {
      SDKVersion: vn.SDKVersion,	// 客户端基础库版本
      brand: vn.brand,	// 设备品牌	1.5.0
      fontSizeSetting: vn.fontSizeSetting, // 用户字体大小（单位px）。以微信客户端「我-设置-通用-字体大小」中的设置为准
      language: vn.language, // 微信设置的语言	
      model: vn.model,	// 设备型号	
      pixelRatio: vn.pixelRatio, // 设备像素比
      platform: vn.platform, // 客户端平台	
      screenWidth: vn.screenWidth, // 屏幕宽度，单位px	1.1.0
      screenHeight: vn.screenHeight, //	屏幕高度，单位px	1.1.0
      windowWidth: vn.windowWidth, // 可使用窗口宽度，单位px	
      windowHeight: vn.windowHeight, // 可使用窗口高度，单位px	
      statusBarHeight: vn.statusBarHeight,	 // 状态栏的高度，单位px	1.9.0
      version: vn.version,	 // 微信版本号	
      system: vn.system	// 操作系统及版本	
    }
  } catch (n) {}
  // 获取网络类型
  wx.getNetworkType({
    success: function(n) {
      equipment.networkType = n.networkType; // 网络类型
    }
  }),
  // 监听路由变化
  wx.onAppRouteDone(route => {
    if (PAGES.length) {
      PAGES[PAGES.length-1].etime = pageOverTime
    }
    PAGES.push({
      key: key,                // 项目key
      uuid: uuid,              // 用户ID
      page: route.path,        // 页面路径
      path: JSON.stringify(route.query)==='{}' ? route.path : `${route.path}?${objToParam(route.query)}`,               // 页面地址，带参数
      stime: Date.now(),       // 进入时间戳
      etime: null,             // 退出时间戳
    })
  });
  var pageOverTime = null;
  wx.onAppRoute(() => {
    pageOverTime = Date.now()
  });
  // 监听小程序冷启动
  wx.getLaunchOptionsSync(() => {
    pushUser();
  })
  // 监听小程序启动
  wx.onAppShow((res) => {
    EVENTS.push({
      key: key,                 // 项目key
      uuid: uuid,               // 用户ID
      event: 'start',           // 事件ID
      extend: {   // 可选
          source: FindArrObj(res.scene, SCENE_LIST, 'SceneValueID').Description,             // 来源，event === start
      },
      ctime: Date.now(),                 // 发生事件的时间戳
    })
  })
  // 监听小程序关闭
  wx.onAppHide((res) => {
    EVENTS.push({
      key: key,                // 项目key
      uuid: uuid,              // 用户ID
      event: 'close',          // 事件ID
      ctime: Date.now(),       // 发生事件的时间戳
    })
    if (PAGES.length) {
      PAGES[PAGES.length-1].etime = Date.now()
    }
    // 关闭前：上报事件和上报页面、清除定时器
    pushEvent();
    pushPages(true);
    clearInterval(EVENTS_TIMER);
    clearInterval(PAGES_TIMER);
  })

  // 上报用户
  function pushUser() {
    wx.request({
      url: URL_PUSH_USER,
      data: [{
        key: key,                 // 项目key
        uuid: uuid,               // 用户ID
        user_id: openId || uuid,  // 【可选】来源用户ID
        event: 'openID',          // 事件ID
        equipment: equipment,
        ctime: Date.now()         // 发生事件的时间戳
      }],
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: function(res) {
        console.log('上报用户成功', res);
      },
      fail: function(err) {
        console.log('上报用户失败', err)
      }
    });
  }
  // 上报事件
  function pushEvent() {
    if(!EVENTS.length) return;
    wx.request({
      url: URL_PUSH_EVENT,
      data: EVENTS,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: function(res) {
        console.log('上报事件成功', res);
        EVENTS = [];
      },
      fail: function(err) {
        console.log('上报事件失败', err)
      }
    });
  } 
  // 上报页面
  function pushPages(all = false) {
    if(!all && PAGES.length < 2) return;
    let params;
    if (all) {
      params = PAGES;
    } else {
      if (PAGES.length < 2) {
        return;
      } else {
        let newPages = deepCopy(PAGES)
        PAGES = newPages.pop();
        params = newPages
      }
    }
    wx.request({
      url: URL_PUSH_PAGES,
      data: params,
      header: { 'content-type': 'application/json' },
      method: 'POST',
      success: function(res) {
        console.log('上报页面成功', res);
        PAGES = [];
      },
      fail: function(err) {
        console.log('上报页面失败', err)
      }
    });
  }  

  function S() {
    return '' + Date.now() + Math.floor(1e7 * Math.random());
  }
  // 随机生成uuid
  function w() {
    function n() {
      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
    }
    return n() + n() + n() + n() + n() + n() + n() + n();
  }
  function o(n) {
    this.app = n;
  }
  wx.sdk = new o('');
  o.prototype.sendOpenId = function(n) {
    if ('' === n || !n || 28 !== n.length) return void console.error('openID不能为空');
    openId = n, 
    wx.setStorageSync('sdk_op', n);
    pushUser()
  }
  o.prototype.sendEvent = function() {}
  
  
  /** 
  * 将json对象转化为url参数
  * @param {Object} obj: json对象
  * 使用方式: objToParam(obj) // name=Jack&age=15
  */
  function objToParam (obj) {
    let resultStr = ''
    for (let key in obj) {
      let value = obj[key]
      if (value instanceof Object) {
        value = JSON.stringify(value)
      }
      resultStr += key + '=' + value + '&'
    }
    resultStr = resultStr.slice(0, -1)
    return resultStr
  }
  /** 
  * 根据数组对象中的属性值查找某一对象
  * @param {String, Number...} val: 某一对象的属性值
  * @param {Array} arr: 数组对象
  * @param {String} attr: 数组对象的属性名
  * 使用方式: FindArrObj()
  */
  function FindArrObj (val, arr, attr) {
    let newArr = arr.filter(function(item){
        return item[attr]=== val; 
    })
    if (newArr.length) {
        return newArr[0]
    } else {
        return false
    }
  }
  /** 
  * 深拷贝
  * @param {Object, Array} obj: 对象或数组
  * 使用方式: deepCopy(obj) 
  */
  function deepCopy (obj) {
    var object;
    // 深度复制数组
    if(Object.prototype.toString.call(obj)=='[object Array]'){    
      object=[];
      for(var i=0;i<obj.length;i++){
        object.push(deepCopy(obj[i]));
      }   
      return object;
    }
    // 深度复制对象
    if(Object.prototype.toString.call(obj)=='[object Object]'){   
      object={};
      for(var p in obj){
        object[p]=obj[p];
      }   
      return object;
    }
  }
});

