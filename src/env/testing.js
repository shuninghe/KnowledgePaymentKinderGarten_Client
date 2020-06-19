const hostConfig = {  // 测试环境地址配置
  /**
   * 云校服务
   */ 
  // host: 'http://testwxkpapi.yqj.cn',           // api地址（知识付费服务）
  // acbHost: 'http://testwxopapi.yqj.cn',        // 登录api配置（机构平台服务）
  // userHost: 'http://testwxucapi.yqj.cn',       // 用户api配置（用户中心服务）
  // uploadHost: 'https://mkaiapi.aipublish.cn',            // 上传文件、上报数据
  /**
   * 沃学服务
   */ 
  host: 'http://test-kpapi.wowxue.com',             // 知识付费服务(kpapi)
  acbHost: 'http://test-opapi.wowxue.com',          // 机构平台服务(opapi)
  userHost: 'http://test-userapi.wowxue.com',       // 用户中心服务(userapi)
  uploadHost: 'http://test-aiapi.wowxue.com',       // 上传图片服务(aiapi)
};

const tokenConfig = {
  baseToken: '__token__',
  saleToken: '__saleToken__',
};

module.exports = {
  hostConfig,
  tokenConfig
};
