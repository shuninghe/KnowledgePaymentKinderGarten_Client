const hostConfig = {  // 开发环境地址配置
  /**
   * 云校服务
   */ 
  // host: 'http://10.10.2.80:8741',           // api地址（知识付费服务）
  // acbHost: 'http://10.10.2.80:3403',        // 登录api配置（机构平台服务）
  // userHost: 'http://10.10.2.80:8731',       // 用户api配置（用户中心服务）
  // uploadHost: 'http://10.10.2.80:3902',     // 上传文件、上报数据 
  /**
   * 沃学服务
   */ 
  host: 'http://10.10.2.80:8631',           // api地址（知识付费服务）
  acbHost: 'http://10.10.2.80:3403',        // 登录api配置（机构平台服务）
  userHost: 'http://10.10.2.80:8745',       // 用户api配置（用户中心服务）
  uploadHost: 'http://10.10.2.80:3902',     // 上传文件、上报数据 
};

const tokenConfig = {
  baseToken: '__token__',
  saleToken: '__saleToken__',
};

module.exports = {
  hostConfig,
  tokenConfig,
};
