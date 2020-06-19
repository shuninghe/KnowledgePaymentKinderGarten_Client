const { isUndefined, isDefined, isString, isObject, isFunction, getString } = require('./base.js');
const { login, saleLogin, clientConfigs, getLog } = require('../api.config');
const { getCurrentPageUrlWithArgs } = require('./common');
const tokenConfig = require('../env.js').tokenConfig;

const ajax = (
  url,
  {
    data,
    method = 'GET',
    header = {},
    success = () => {},
    fail = () => {},
    complete = () => {},
    failToast = true,
    modalLoading = '',
    navBarLoading = false,
    showLog = true
  }
) => {
  let tokenName = '';
  let urlArray = url.split('/');
  if (urlArray[3].endsWith('oken__')) {
    tokenName = urlArray[3];
  }
  let token = wx.getStorageSync(tokenName);

  // 第三方登录态
  // const session_3rd = updataStorageData('session_3rd');
  // 构造请求体
  if (tokenName) {
    urlArray.splice(3,1);
  }
  
  const requestUrl = urlArray.join('/');

  const request = {
    url: requestUrl,
    method: ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method.toUpperCase()) > -1 ? method : 'GET',
    header: Object.assign({ authorization: `Bearer ${token}` }, header),
    data: Object.assign({
      client_id: getApp().globalData.client_id || ''
    }, data)
  };
  // showLog && console.table && console.table(request); // eslint-disable-line
  modalLoading && wx.showLoading({ title: getString(modalLoading) });
  navBarLoading && wx.showNavigationBarLoading();
  return new Promise((res,rej) => {
    if (token || !tokenName) {
      wx.request(
        Object.assign(request, {
          success: ({ data, statusCode }) => {
            modalLoading && wx.hideLoading();
            // showLog && console.log && console.log('[AJAX SUCCESS]', statusCode, typeof data === 'object' ? data : data.toString().substring(0, 100)); // eslint-disable-line
            // 状态码正常 & 确认有数据
            if ((data && +data.code === 0 && data.data)||(data && +data.Code === 0 && data.Data)) {
              return res( isFunction(success) && (Object.assign({ statusCode }, data)));
            }
            // 非正常业务码处理（如登录态失效等）
            if ((data && +data.code !== 0)||(data && +data.Code !== 0)) {
              console.log('授权过期');
              // rej() 处理其他异常 需要res
              rej( isFunction(success) && (Object.assign({ statusCode }, data)));
            }
            if((data && +data.code === 1000)||(data && +data.Code === 1000)){

              if (tokenName === '__saleToken__') {
                wx.reLaunch({
                  url: '/pages/saleLogin/saleLogin?mode=1'
                });
              } else {
                getToken();
              }
            }
            // 其他情况，执行错误回调
            failToast &&
              wx.showToast({ title: data.message || '获取数据出错', icon: 'none' });
            isFunction(fail) && fail(Object.assign({ statusCode }, data));
          },
          fail: ({ error, errorMessage }) => {
            console.log(error, 'err');
            modalLoading && wx.hideLoading();
            showLog && console.log && console.log('[AJAX FAIL]', error, errorMessage); // eslint-disable-line
            failToast && wx.showToast({ title: errorMessage || '获取数据出错', icon: 'none' });
            isFunction(fail) && fail({ error, errorMessage });
          },
          complete: () => {
            navBarLoading && wx.hideNavigationBarLoading();
            isFunction(complete) && complete();
          }
        })
      );
    } else {
      if (tokenName === tokenConfig.saleToken) {
        // 跳转到登录页面
        wx.reLaunch({
          url: '/pages/saleHome/saleHome?mode=1'
        });
      } else {
        getToken();
      }
    }
  });
};
const updataGlobalData = (key, value) => {
  const globalData = getApp().globalData;
  // 校验 globalData
  if (!globalData) {
    return console.error('[$updateGlobalData] globalData Not Find!'); // eslint-disable-line
  }
  // 校验: 操作字段
  if (!isString(key) || key === '') {
    return console.error('[$updateGlobalData] key 不能为空!'); // eslint-disable-line
  }
  // 取出已有信息
  const data = globalData[key] || {};
  // 更新缓存
  if (value && isObject(value) && isObject(data)) {
    // Object合并第一层
    globalData[key] = Object.assign({}, data, value);
  } else if (isDefined(value)) {
    // 其他非undefined数据直接覆盖
    globalData[key] = value;
  }
  return globalData[key];
};

/**
 * 获取微信token
 */
const getToken = (only) => {
  return new Promise((resolve,reject) => {
    wx.login({
      timeout: 10000,
      success: (resCode) => {
        wx.request({
          url: login,
          data: {
            code: resCode.code ,// 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
            user_info: {//小程序获取 wx.getUserInfo(OBJECT) 成功返回的对象
              userInfo: {},//用户信息对象，不包含 openid 等敏感信息(可以为空对象)
            },
            client_id: getApp().globalData.client_id ,     
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: res => {
            if (res.statusCode === 200) {
              wx.setStorageSync('__token__',res.data.data.cookie);  
              wx.setStorageSync('openId',res.data.data.open_id);
              wx.sdk.sendOpenId(res.data.data.open_id); // 调用sdk上传OpenID
              // console.log(resCode.code);
              if (only) {
              //   let shareLink = getCurrentPageUrlWithArgs();
              //   wx.reLaunch({      
              //     url: `/${shareLink}`
              //   }); 
                resolve(); 
              } else {
                Promise.all([
                  getShareLog(),
                  getIndexConfig()
                ]).then(() => {
                  let shareLink = getCurrentPageUrlWithArgs();
                  wx.reLaunch({      
                    url: `/${shareLink}`
                  });
                  resolve(); 
                // let shareLink = getCurrentPageUrlWithArgs();
                // let homePageUrl = getApp().globalData.homePageUrl;
                // let i = shareLink.indexOf(homePageUrl);
                // if (i === -1) {
                //   wx.setStorageSync('shareLink', shareLink);
                //   wx.reLaunch({      
                //     url: `/${homePageUrl}`
                //   });
                // } else {
                // wx.reLaunch({      
                //   url: `/${shareLink}`
                // });
                // }
                // resolve(); 
                });
              }
            } else {
              reject();
            }
          }
        });
      }
    });
  });
};
const Base64 = {
  // private property
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  // public method for encoding
  encode: function (input) {
    let output = '';
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    let i = 0;
    input = Base64._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    }
    return output;
  },
  // public method for decoding
  decode: function (input) {
    let output = '';
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '') // eslint-disable-line
    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));
      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;
      output = output + String.fromCharCode(chr1);
      if (enc3 !== 64) {
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output = output + String.fromCharCode(chr3);
      }
    }
    output = Base64._utf8_decode(output);
    return output;
  },

  // private method for UTF-8 encoding
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, '\n');
    let utftext = '';
    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  },
  // private method for UTF-8 decoding
  _utf8_decode: function (utftext) {
    let string = '';
    let i = 0;
    let c = 0;
    let c2 = 0;
    let c3 = 0;
    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
};
/**
 * 获取账号密码登录方式token
 */
const getPasswordToken = (userName, password) => {
  let urlArray = saleLogin.split('/');
  let index = urlArray.indexOf('__saleToken__');
  let newUrl;
  if (index > -1) {
    urlArray.splice(index, 1);
    newUrl = urlArray.join('/');
  }
  const clientId = getApp().globalData.client_id; 
  const clientSecret = getApp().globalData.client_secret;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + Base64.encode(`${clientId}:${clientSecret}`)
  };
  return new Promise((resolve,reject) => {
    wx.request({
      url: newUrl,
      data: {
        grant_type: 'password',
        username: userName,
        password,   
      },
      header: headers,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: res => {
        if (res.statusCode === 200) {
          if (res.data.Code === 1001) {
            wx.showToast({
              title: '手机号或密码错误',
              icon: 'none'
            });
          } 
          if (res.data.Code === 0) {
            let tokenName = '__token__';
            let urlArray = saleLogin.split('/');
            if (urlArray[3].endsWith('oken__')) {
              tokenName = urlArray[3];
            }
            wx.setStorageSync(tokenName, res.data.Data.access_token);  
            resolve();
            // 获取成功之后跳转到分销首页
            wx.reLaunch({      
              url: '/pages/saleHome/saleHome?mode=1'
            });
          }
        } else {
          reject();
        }
      }
    });
  });
};

// 获取配置信息 get http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912044#id-%E7%88%B1%E5%87%BA%E7%89%881.9_api-%E8%8E%B7%E5%8F%96%E5%AE%A2%E6%88%B7%E7%AB%AF%E9%85%8D%E7%BD%AE%E4%BF%A1%E6%81%AF
const getIndexConfig = () => {
  return new Promise((resolve, reject) => {
    ajax(`${clientConfigs}${getApp().globalData.client_id}`, {
      data: {
        version: getApp().globalData.version
      }
    }).then(res => {
      if (res.Code === 0 && res.Data.length > 0) {
        for (let i = 0; i < res.Data.length; i++) {
          const config_name = res.Data[i].config_name;
          switch (config_name) {
          // case 'pay':
          //   wx.setStorageSync('isIosPay', res.Data[i].config.isIosPay);              
          //   break;
          case 'function':
            wx.setStorageSync('functionConfig', res.Data[i].config);
            break;
          case 'menu': // 底部tab-bar配置
            wx.setStorageSync('indexMenu', res.Data[i].config);
            break;
          case 'index': // 明珠-首页数据配置 
            if (getApp().globalData.client_id === 'yqj201911131327356726') {
              let YouShiData = {
                bannerList: res.Data[i].config.banner, // banner
                meunShowType: res.Data[i].config.functionAreas.contentShowType || 1,  // 菜单导航排布方式
                classifyList: res.Data[i].config.functionAreas.list,  // 菜单导航
                classAreasData: res.Data[i].config.classAreas, // 课程分类
                theme: res.Data[i].config.theme // 主题色
              };
              wx.setStorageSync('homeData', YouShiData);
            } 
            break;
          case 'index2': // 静态tab数据配置
            var tabAdsPostData = {
              pic: res.Data[i].config.pic, // 背景图
              positions: res.Data[i].config.positions 
            };
            wx.setStorageSync('tabAdsPostData', tabAdsPostData);
            break;
          case 'index3': // 考证-首页数据配置
            var RenZhenData = {
              bannerList: res.Data[i].config.banner, // banner
              meunShowType: res.Data[i].config.functionAreas.contentShowType || 1, // 菜单导航排布方式
              classifyList: res.Data[i].config.functionAreas.list, // 菜单导航
              recommended: res.Data[i].config.recommended, // 最新推荐
              courseCategory: res.Data[i].config.courseCategory, // 课程列表
              theme: res.Data[i].config.theme // 主题色
            };
            wx.setStorageSync('homeData', RenZhenData);
            break;
          case 'index4': // 职教-首页数据配置
            var ZhiJiaoData = {
              bannerList: res.Data[i].config.banner, // banner
              meunShowType: res.Data[i].config.functionAreas.contentShowType || 1, // 菜单导航排布方式
              classifyList: res.Data[i].config.functionAreas.list, // 菜单导航
              classAreasData: res.Data[i].config.classAreas, // 课程分类
              theme: res.Data[i].config.theme // 主题色
            };
            wx.setStorageSync('homeData', ZhiJiaoData);
            break;
          case 'index5': // 园所-首页数据配置 
            if (getApp().globalData.client_id === 'yqj201909241327356726') {
              let YouShiData = {
                bannerList: res.Data[i].config.banner, // banner
                meunShowType: res.Data[i].config.functionAreas.contentShowType || 1,  // 菜单导航排布方式
                classifyList: res.Data[i].config.functionAreas.list,  // 菜单导航
                classAreasData: res.Data[i].config.classAreas, // 课程分类
                theme: res.Data[i].config.theme // 主题色
              };
              wx.setStorageSync('homeData', YouShiData);
            } 
            break;
          case 'index6': // 家园-首页数据配置 
            var JiaYuanTongData = {
              bannerList: res.Data[i].config.banner, // banner
              meunShowType: res.Data[i].config.functionAreas.contentShowType || 1,  // 菜单导航排布方式
              classifyList: res.Data[i].config.functionAreas.list,  // 菜单导航
              newList: res.Data[i].config.functionAreas.newList,  // 最新更新
              classAreasData: res.Data[i].config.classAreas, // 课程分类
              theme: res.Data[i].config.theme // 主题色
            };
            wx.setStorageSync('homeData', JiaYuanTongData);
            break;
          case 'index7': 
            var shopHomeData = {
              bannerList: res.Data[i].config.banner, // banner
              meunShowType: res.Data[i].config.functionAreas.contentShowType || 1,  // 菜单导航排布方式
              classifyList: res.Data[i].config.functionAreas.list,  // 菜单导航
              newList: res.Data[i].config.functionAreas.newList,  // 最新更新
              classAreasData: res.Data[i].config.classAreas, // 课程分类
              activityData: res.Data[i].config.activityData, // 营销课程
              moduleInfoCheck: res.Data[i].config.moduleInfoCheck, // 店铺信息展示
              classAreasData2: res.Data[i].config.classAreas2, // 课程分类
              theme: res.Data[i].config.theme // 主题色
            };
            wx.setStorageSync('homeData', shopHomeData);
            break;
          default:
            break;
          }
        }
        resolve();
      } else {
        reject(res.Msg);
      }
    });
  });
};
// 生成分享邀请log_id
const getShareLog = () => {
  return new Promise(resolve => {
    ajax(getLog, {data: {}, method: 'post', failToast: false}).then(res=>{
      if (res.code === 0) {
        wx.setStorageSync('shareLogId', res.data.log_id);
        resolve();
      }
    });
  });
};
const updataStorageData = (key, value) => {
  try {
    if (!isString(key) || key === '') {
      return console.error('[$updateStorageData] key 不能为空!'); // eslint-disable-line
    }
    let data = wx.getStorageSync(key);
    // 只有key情况下，直接返回data
    if (isUndefined(value)) return data;
    // Object合并
    if (isObject(value) && isObject(data)) {
      let info = Object.assign({}, data, value);
      wx.setStorageSync(key, info);
      return info;
    }
    // 其他数据直接覆盖
    wx.setStorageSync(key, value);
    return value;
  } catch (e) {
    console.error(`[ERROR]: ${value ? 'UPDATE' : 'GET'} Storage ${key} : `, e.stack); // eslint-disable-line
  }
};

module.exports = {
  ajax,
  updataGlobalData,
  getToken,
  getIndexConfig,
  updataStorageData,
  getPasswordToken,
};
