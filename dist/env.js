const hostConfig = { // 生产环境地址配置
  /**
   * 云校服务
   */ 
  // host: 'https://mkkpapi.aipublish.cn',       // api地址（知识付费服务）
  // acbHost: 'https://mkapi.aipublish.cn',      // 登录api配置（机构平台服务）
  // userHost: 'https://ucapi.aipublish.cn',     // 用户api配置（用户中心服务）
  // uploadHost: 'https://mkaiapi.aipublish.cn', // 上传文件、上报数据
  /**
   * 沃学服务
   */
  host: 'https://kpapi.wowxue.com',           // api地址（知识付费服务）
  acbHost: 'https://opapi.wowxue.com',        // 登录api配置（机构平台服务）
  userHost: 'https://userapi.wowxue.com',     // 用户api配置（用户中心服务）
  uploadHost: 'https://aiapi.wowxue.com',     // 上传文件、上报数据 
};
/**
 * 各个模块使用token配置
 */
const tokenConfig = { 
  baseToken: '__token__',
  saleToken: '__saleToken__',
};

module.exports = {
  hostConfig,
  tokenConfig
};
