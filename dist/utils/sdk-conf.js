/**
 * 编译时，根据不同命令，将env/(development.js|testing.js|production.js)重命名后置于src下
 * 同时重命名为env.js
 */
const { uploadHost } = require('../env.js').hostConfig;
const appConfig = require('../app.config.js');

exports.url = uploadHost;                 // 请在此行填写上报接口域名
exports.key =  appConfig.sdkKey;        // 请在此行填写获取的key // todo 配置选择app.config.js里对应的对象名
exports.useOpen = true;                   // 默认不启用，是否启用openId计算，开启后必须上传openId，否则数据不会上报。
