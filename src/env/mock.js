const hostConfig = {  // mock环境地址配置
  host: 'http://yapi.iyunxiao.com/mock/214', // api配置
  acbHost: 'http://172.17.0.81:8661',        // 登录api配置
  userHost: 'http://10.10.2.80:8731',        // 用户api配置
  uploadHost: 'http://tres.yqj.cn',          // 上传文件、上报数据
};

const tokenConfig = {
  baseToken: '__token__',
  saleToken: '__saleToken__',
};

module.exports = {
  hostConfig,
  tokenConfig
};