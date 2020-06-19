const numeral = require('numeral.min');

// 处理价格分转换元
function dealPrice(value){
  let priceNum = numeral(value*0.01);
  return priceNum.format('0.[00]');
}
// 时间戳转换日期
function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
// 每三位加，保留两位小数
function formatMoney(number) {
  let a  = (number / 100).toFixed(2);
  let b = Number(a).toLocaleString('en-US');
  let index = b.indexOf('.');
  if(index > -1) {
    if(b.split('.')[1].length === 1) {
      b = b + '0';
    }
  } else {
    b = b + '.00';
  }
  return b;
}
// 日期转时间戳
function transdate(endTime){
  var date = new Date();
  date.setFullYear(endTime.substring(0, 4));
  date.setMonth(endTime.substring(5, 7) - 1);
  date.setDate(endTime.substring(8, 10));
  date.setHours(endTime.substring(11, 13));
  date.setMinutes(endTime.substring(14, 16));
  date.setSeconds(endTime.substring(17, 19));
  return Date.parse(date) / 1000;
}
// 辅助函数：格式化数字
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}
// 获取当前页带参数的url
function getCurrentPageUrlWithArgs(){
  var pages = getCurrentPages();    //获取加载的页面
  try {
    var currentPage = pages[pages.length-1];    //获取当前页面的对象
    var url = currentPage.route;    //当前页面url
    var options = currentPage.options;    //如果要获取url中所带的参数可以查看options
    //拼接url的参数
    var urlWithArgs = url + '?';
    for(var key in options){
      var value = options[key];
      urlWithArgs += key + '=' + value + '&';
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1);
    return urlWithArgs;
  } catch (error) {
    console.log(error);
  }
}
// 获取当前页url
function getCurrentPageUrl(){
  var pages = getCurrentPages();    //获取加载的页面
  var currentPage = pages[pages.length-1];    //获取当前页面的对象
  var url = currentPage.route;    //当前页面url
  return url;
}
/**
   * canvas画圆角矩形
   * @param {CanvasContext} ctx canvas上下文
   * @param {number} x 圆角矩形选区的左上角 x坐标
   * @param {number} y 圆角矩形选区的左上角 y坐标
   * @param {number} w 圆角矩形选区的宽度
   * @param {number} h 圆角矩形选区的高度
   * @param {number} r 圆角的半径
   * @param {string} color 矩形填充颜色
   */
function roundRect (ctx, x, y, w, h, r, color='transparent') {
  // 开始绘制
  ctx.beginPath();
  // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
  // 这里是使用 fill 还是 stroke都可以，二选一即可
  ctx.setFillStyle(color);
  // ctx.setStrokeStyle(color)
  // 左上角
  ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);

  // border-top
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.lineTo(x + w, y + r);
  // 右上角
  ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);

  // border-right
  ctx.lineTo(x + w, y + h - r);
  ctx.lineTo(x + w - r, y + h);
  // 右下角
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);

  // border-bottom
  ctx.lineTo(x + r, y + h);
  ctx.lineTo(x, y + h - r);
  // 左下角
  ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);

  // border-left
  ctx.lineTo(x, y + r);
  ctx.lineTo(x + r, y);
  
  // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
  ctx.fill();

  // 剪切
  ctx.clip();
  ctx.closePath();
}
/**
   * canvas文本自动换行省略
   * @param {string} txt 文本的内容   
   * @param {CanvasContext} ctx canvas上下文
   * @param {number} x 文本选区的左上角 x坐标 
   * @param {number} y 文本选区的左上角 y坐标 
   * @param {number} w 文本选区的宽度 
   * @param {number} l 文本的行高 
   * @param {number} fontSize 文本的字号 
   * @param {string} color 文本的颜色 
   * @param {number} num 文本最多几行(默认全部)
   * @param {boolean} isCenter 文本是否居中对齐
   */
function canvasTextAutoLine (txt, ctx, x, y, w, l, fontSize, color, num, isCenter=false) {
  var chr = txt.split(''); 
  var temp = '';
  var row = [];
  ctx.setFontSize(fontSize);
  ctx.setFillStyle(color);
  for (var a = 0; a < chr.length; a++) {
    if (ctx.measureText(temp).width < w) {
      temp += chr[a];
    } else {
      a--; 
      row.push(temp);
      temp = '';
    }
  }
  row.push(temp);
  if (!num)  num = row.length;
  for (let b = 0; b < num; b++) {
    if (b === num-1 && row.length > num) {
      let txt = row[b].substring(0, row[b].length - 3) + '...';
      ctx.fillText(
        txt, 
        isCenter ? (x-ctx.measureText(txt).width) / 2 : x, 
        y + b  * l
      );          
    } else {
      ctx.fillText(
        row[b], 
        isCenter ? (x-ctx.measureText(row[b]).width) / 2 : x, 
        y + b * l
      );          
    }
  }
}
/**
   * canvas渲染文字
   * @param {CanvasContext} ctx canvas上下文
   * @param {Number} obj.x 绘制文本的左上角x坐标位置
   * @param {Number} obj.y 绘制文本的左上角y坐标位置
   * @param {String} obj.color 字体的颜色
   * @param {Number} obj.size	字体的字号
   * @param {String} obj.align 文字的对齐，可选值 'left'、'center'、'right'
   * @param {String} obj.baseline	设置文字的水平对齐，可选值 'top'、'bottom'、'middle'、'normal'
   * @param {String} obj.text	在画布上绘制被填充的文本。
   * @param {Number} obj.bold 加粗程度 不加粗0 加粗0.2、0.5
   */
function canvasDrawText (ctx, obj) {
  ctx.setFillStyle(obj.color);
  ctx.setFontSize(obj.size);
  ctx.setTextAlign(obj.align);
  ctx.setTextBaseline(obj.baseline);
  if (obj.bold > 0) {
    ctx.fillText(obj.text, obj.x, obj.y - obj.bold);
    ctx.fillText(obj.text, obj.x - obj.bold, obj.y);
  }
  ctx.fillText(obj.text, obj.x, obj.y);
  if (obj.bold > 0) {
    ctx.fillText(obj.text, obj.x, obj.y + obj.bold);
    ctx.fillText(obj.text, obj.x + obj.bold, obj.y);
  }
}
/**
   * 将树形结构转换成一维数组
   * @param {Array} treeArr tree的数组
   * @param {String} childField tree中子数组字段名
   */
function tree2arr (treeArr, childField) {
  const temp = [];  // 临时存放需要遍历的tree
  const ret = [];    // 返回arr
  for (const tree of treeArr) {
    const obj = deepCopy(tree);
    delete obj[childField];
    ret.push(obj);
    temp.push(tree);
  }
  // 遍历
  while (temp.length > 0) {
    const first = temp.shift();
    const children = first[childField];
    if (children && children.length > 0) {
      for (const child of children) {
        temp.push(child);
        const obj = deepCopy(child);
        delete obj[childField];
        ret.push(obj);
      }
    }
  }
  return ret;
}
// 深拷贝
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
/** 
  * 时间戳转日期时间
  * @param {Number} time: 时间戳
  * @param {String} format: 日期时间格式
  * 使用方式: timestampToTime(1557285692393, 'Y-M-D h:m:s') // 2019-05-08 11:21:32
  */
function timestampToTime(time, format) {
  let timestamp = String(time).length === 10 ? time * 1000 : time;
  if (!format) {
    format = 'Y-M-D h:m:s';
  }
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(timestamp);
  returnArr.push(date.getFullYear());
  var M = date.getMonth() + 1;
  returnArr.push(M < 10 ? ('0' + M) : M);
  var D = date.getDate();
  returnArr.push(D < 10 ? ('0' + D) : D);
  var h = date.getHours();
  returnArr.push(h < 10 ? ('0' + h) : h);
  var m = date.getMinutes();
  returnArr.push(m < 10 ? ('0' + m) : m);
  var s = date.getSeconds();
  returnArr.push(s < 10 ? ('0' + s) : s);
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
/** 
  * 判断是否为非空对象
  * @param {Object} obj: 对象
  * 使用方式: judgeObj(obj) 
  */
function judgeObj (obj) {
  if (obj && Object.prototype.toString.call(obj) === '[object Object]' && JSON.stringify(obj) !== '{}') {
    return true;
  } else {
    return false;
  }
}
/** 
  * 去除对象中为空的属性值
  * @param {Object} obj: 对象
  * 使用方式: dealObj(obj)
  */
function dealObj (obj) {
  if (!judgeObj(obj)) {
    return null;
  }
  for (let key in obj) {
    if (obj[key] === null || obj[key] === '' || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}
/** 
  * 将json对象转化为url参数
  * @param {Object} obj: json对象
  * 使用方式: objToParam(obj) // name=Jack&age=15
  */
function objToParam (obj) {
  if (!judgeObj(obj)) {
    return null;
  }
  let resultStr = '';
  for (let key in obj) {
    let value = obj[key];
    if (value instanceof Object) {
      value = JSON.stringify(value);
    }
    resultStr += key + '=' + value + '&';
  }
  resultStr = resultStr.slice(0, -1);
  return resultStr;
}
/** 
  * 将options中获取的url参数转化为对象
  * @param {String} param: url参数json字符串
  * 使用方式: paramToObj(param) // {name:'Jack',age:'15'}
  */
function paramToObj (param) {
  if (!judgeObj(param)) {
    return null;
  }
  let obj = {};
  for (let key in param) {
    let value = param[key];
    value = JSON.parse(value);
    obj[key] = value;
  }
  obj = dealObj(obj);
  return obj;
}
function commonShare (title, url, img, needAuthorized=false, callback) {
  let path;
  if (needAuthorized) {
    let logId = wx.getStorageSync('shareLogId');
    path = `/pages/authorized/authorized?logId=${logId}&realUrl=${encodeURIComponent(url)}`;
  } else {
    path = url;
  }
  console.log('分享数据：',title, path);
  var obj = {
    title: title || `欢迎使用${getApp().globalData.appName}`,
    path: path || `/${getApp().globalData.homePageUrl}`,
    imageUrl: img || `/${getApp().globalData.sharePic}`,
    success: ()=> {
      callback && callback();
    }
  };
  return obj;
}

module.exports = {
  dealPrice,
  formatTimeTwo,
  formatMoney,
  transdate,
  formatNumber,
  getCurrentPageUrlWithArgs,
  getCurrentPageUrl,
  roundRect,
  canvasTextAutoLine,
  canvasDrawText,
  tree2arr,
  deepCopy,
  timestampToTime,
  judgeObj,
  dealObj,
  objToParam,
  paramToObj,
  commonShare
};