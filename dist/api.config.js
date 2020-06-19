/**
 * 编译时，根据不同命令，将env/(development.js|testing.js|production.js)重命名后置于src下
 * 同时重命名为env.js
 * 
 * 路由中api这一级决定使用什么token 
 * /${tokenConfig.baseToken}/api/  wx.getStorageSync('__token__');
 * /sale_api/   wx.getStorageSync('__saleToken__');
 * 
 * 
 */
const { host, uploadHost, acbHost, userHost } = require('./env.js').hostConfig;
const tokenConfig = require('./env.js').tokenConfig;

module.exports = {
  // 登录 post http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E7%94%A8%E6%88%B7%E8%BA%AB%E4%BB%BD%E6%A0%87%E8%AF%86
  login: `${host}/kp_api/user/wechat_mini-app/accesstoken`,
  clientConfigs: `${acbHost}/${tokenConfig.baseToken}/api/app/config/`,
  // 用户绑定引流公众号 post http://wiki.iyunxiao.com/pages/viewpage.action?pageId=360748532#v1.9.5%E5%BC%95%E6%B5%81%E5%85%AC%E4%BC%97%E5%8F%B7-%E7%94%A8%E6%88%B7%E7%BB%91%E5%AE%9A%E5%BC%95%E6%B5%81%E5%85%AC%E4%BC%97%E5%8F%B7
  divertSubscription: `${host}/${tokenConfig.baseToken}/api/official/account/binding`,
  // 生成日志编号（分享需要生成邀请信息时调用）post
  getLog: `${host}/${tokenConfig.baseToken}/api/bonus/getLog`,
  // 保存邀请信息（用户通过二维码进入小程序时请求）post
  pushLog: `${host}/${tokenConfig.baseToken}/api/bonus/share`,

  /**
   * 我的模块 
   */
  // 获取/修改我的个人信息 get put
  userinfo: `${host}/${tokenConfig.baseToken}/api/user/info`,
  // 微信支付 post http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98-%E5%8F%91%E8%B5%B7%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%94%AF%E4%BB%98-%E8%8E%B7%E5%8F%96%E6%94%AF%E4%BB%98%E5%87%AD%E6%8D%AE%E8%BF%9B%E8%A1%8C%E5%95%86%E5%93%81%E8%B4%AD%E4%B9%B0
  pay: `${host}/${tokenConfig.baseToken}/api/pay/payments`,
  // 获取订单支付状态 get http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E5%BE%AE%E4%BF%A1%E6%94%AF%E4%BB%98-%E5%8F%91%E8%B5%B7%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%94%AF%E4%BB%98-%E8%8E%B7%E5%8F%96%E6%94%AF%E4%BB%98%E5%87%AD%E6%8D%AE%E8%BF%9B%E8%A1%8C%E5%95%86%E5%93%81%E8%B4%AD%E4%B9%B0
  getPayStatus: `${host}/${tokenConfig.baseToken}/api/pay`,
  // 获取我的订单列表 get 
  getOrderList: `${host}/${tokenConfig.baseToken}/api/user/order_list`,
  // 获取订单详情  get
  getOrderDetail: `${host}/${tokenConfig.baseToken}/api/user/order_detail`,
  // 获取验证码 get http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238195#id-%E7%BE%A4%E6%89%93%E5%8D%A1v1.0API-%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81
  getPhoneCode: `${host}/${tokenConfig.baseToken}/api/user/getcode`,
  // 验证验证码 get 
  checkPhoneCode: `${host}/${tokenConfig.baseToken}/api/user/getcode/verify`,
  // 卡号激活 
  // 解除绑定 delete
  relieveSchool: `${host}/${tokenConfig.baseToken}/api/kindergarten/info`,
  // 搜索  get http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E6%A0%B9%E6%8D%AE%E5%85%B3%E9%94%AE%E8%AF%8D%E6%90%9C%E7%B4%A2%E5%9B%AD%E6%89%80
  searchSchool: `${host}/${tokenConfig.baseToken}/api/kindergarten/key_word`,
  // 手动取消订单 put 
  cancleOrder: `${host}/${tokenConfig.baseToken}/api/user/order_status`,
  // 获取用户学习记录 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E7%94%A8%E6%88%B7%E5%AD%A6%E4%B9%A0%E8%AE%B0%E5%BD%95
  myStudyRecords: `${host}/${tokenConfig.baseToken}/api/user/study_records`,
  /**
   * 学习模块
   */
  // 获取分类课程列表 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%88%86%E7%B1%BB%E8%AF%BE%E7%A8%8B%E5%88%97%E8%A1%A8
  coursesList: `${host}/${tokenConfig.baseToken}/api/courses/category_courses_list`,
  // 获取课程详情 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E8%AF%BE%E7%A8%8B%E8%AF%A6%E6%83%85
  courseDetail: `${host}/${tokenConfig.baseToken}/api/courses/course_detail`,
  // 添加学习课程记录 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E6%B7%BB%E5%8A%A0%E5%AD%A6%E4%B9%A0%E8%AF%BE%E7%A8%8B%E8%AE%B0%E5%BD%95.1
  courseRecord: `${host}/${tokenConfig.baseToken}/api/self/course_record`,
  // 获取系列下的课时 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E7%B3%BB%E5%88%97%E4%B8%8B%E7%9A%84%E8%AF%BE%E6%97%B6
  courseSections: `${host}/${tokenConfig.baseToken}/api/courses/sections`,
  // 获取课程分类
  getAllClassify: `${host}/${tokenConfig.baseToken}/api/courses/category_list`,
  // 获取分类下所有课程
  getClassifyCourse: `${host}/${tokenConfig.baseToken}/api/courses/category_courses_list`,

  /**
   * 园所模块 
   */
  // 获取园所信息 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%9B%AD%E6%89%80%E4%BF%A1%E6%81%AF
  gardenInformation: `${host}/${tokenConfig.baseToken}/api/kindergarten/info`, 
  // 上传图片 
  uploadFile: `${uploadHost}/api/storge/object`,
  // 添加园所介绍 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E6%B7%BB%E5%8A%A0%E5%9B%AD%E6%89%80%E4%BB%8B%E7%BB%8D
  addGardenIntro: `${host}/${tokenConfig.baseToken}/api/kindergarten/intro`,
  // 添加园所活动作品 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E6%B7%BB%E5%8A%A0%E5%9B%AD%E6%89%80%E6%B4%BB%E5%8A%A8%E4%BD%9C%E5%93%81
  addGardenWork: `${host}/${tokenConfig.baseToken}/api/kindergarten/works`,
  // 解除管理员 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%A7%A3%E7%BB%91%E5%9B%AD%E6%89%80%E4%BF%A1%E6%81%AF
  untyingInfo: `${host}/${tokenConfig.baseToken}/api/kindergarten/info`,
  // 修改园所信息 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E4%BF%AE%E6%94%B9%E5%9B%AD%E6%89%80%E4%BF%A1%E6%81%AF
  updateGardenInfo: `${host}/${tokenConfig.baseToken}/api/kindergarten/info`,
  // 获取园所头像 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%9B%AD%E6%89%80%E5%A4%B4%E5%83%8F
  getGardenPic: `${host}/${tokenConfig.baseToken}/api/kindergarten/pic`,
  // 修改园所头像 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E4%BF%AE%E6%94%B9%E5%9B%AD%E6%89%80%E5%A4%B4%E5%83%8F
  updateGardenPic: `${host}/${tokenConfig.baseToken}/api/kindergarten/pic`,
  // 园所入驻 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E5%9B%AD%E6%89%80%E5%85%A5%E9%A9%BB
  settledGarden: `${host}/${tokenConfig.baseToken}/api/kindergarten/info`,
  // 获取招生信息列表 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E6%8B%9B%E7%94%9F%E4%BF%A1%E6%81%AF
  getEnrollmenList: `${host}/${tokenConfig.baseToken}/api/kindergarten/enrollment_information`,
  // 获取动态列表 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%9B%AD%E6%89%80%E5%8A%A8%E6%80%81
  getDynamicList: `${host}/${tokenConfig.baseToken}/api/kindergarten/dynamics`,
  // 获取文章详情 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E8%8E%B7%E5%8F%96%E5%9B%AD%E6%89%80%E5%8A%A8%E6%80%81/%E8%8E%B7%E5%8F%96%E6%8B%9B%E7%94%9F%E4%BF%A1%E6%81%AF%E8%AF%A6%E6%83%85
  getContentDetail: `${host}/${tokenConfig.baseToken}/api/kindergarten/dynamic_detail`,
  // 一键绑定手机号 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=357912234#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9api-%E4%B8%80%E9%94%AE%E7%BB%91%E5%AE%9A%E6%89%8B%E6%9C%BA%E5%8F%B7
  bindPhoneNumber: `${host}/${tokenConfig.baseToken}/api/user/bind_phone`,

  /**
   * 好友助力 
   */
  // 发起好友助力 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238057#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9v2.1_api-%E5%8F%91%E8%B5%B7%E5%A5%BD%E5%8F%8B%E5%8A%A9%E5%8A%9B
  needFriendHelp: `${host}/${tokenConfig.baseToken}/api/pal_assistant/pal_assistant`,
  // 给好友助力 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238057#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9v2.1_api-%E7%BB%99%E5%A5%BD%E5%8F%8B%E5%8A%A9%E5%8A%9B
  giveFriendHelp: `${host}/${tokenConfig.baseToken}/api/pal_assistant/assistant`,
  // 获取助力详情 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238057#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9v2.1_api-%E8%8E%B7%E5%8F%96%E5%8A%A9%E5%8A%9B%E8%AF%A6%E6%83%85
  getHelpDetail: `${host}/${tokenConfig.baseToken}/api/pal_assistant/detail`,
  // 获取我的好友助力记录 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238057#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9v2.1_api-%E8%8E%B7%E5%8F%96%E6%88%91%E7%9A%84%E5%A5%BD%E5%8F%8B%E5%8A%A9%E5%8A%9B%E8%AE%B0%E5%BD%95
  getHelpRecords: `${host}/${tokenConfig.baseToken}/api/pal_assistant/my_pal_assistant`,
  // 免费领取 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=330238057#id-%E7%9F%A5%E8%AF%86%E4%BB%98%E8%B4%B9v2.1_api-%E5%85%8D%E8%B4%B9%E9%A2%86%E5%8F%96
  getHelpCourseList: `${host}/${tokenConfig.baseToken}/api/courses/free_courses`,
  // 用户分享
  postShareData: `${host}/${tokenConfig.baseToken}/api/courses/share`,
  // 获取分享海报信息
  getShareData: `${host}/${tokenConfig.baseToken}/api/courses/share`,
  /**
   * 课程评论模块
   */
  // 获取班级动态列表 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=359328736#id-%E7%88%B1%E5%87%BA%E7%89%88v1.9.4API-%E8%8E%B7%E5%8F%96%E7%8F%AD%E7%BA%A7%E5%8A%A8%E6%80%81%E5%88%97%E8%A1%A8%EF%BC%88%E5%B0%8F%E7%A8%8B%E5%BA%8F%E7%AB%AF%E5%92%8C%E5%90%8E%E5%8F%B0%E4%B8%A4%E4%B8%AA%EF%BC%89
  getCourseDynamicList:`${host}/${tokenConfig.baseToken}/api/class/course/dynamicList`,
  // 删除动态
  deleteCourseDynamic: `${host}/${tokenConfig.baseToken}/api/class/course/comment/delete`,
  // 发表动态
  publishCourseDynamic: `${host}/${tokenConfig.baseToken}/api/class/course/dynamicPublish`,
  /**
   * 报名配置模块
   */
  getRegistrationConfigList: `${host}/${tokenConfig.baseToken}/api/class/course/signConfiguration`,
  postSignUpInfo: `${host}/${tokenConfig.baseToken}/api/class/course/signUp`,
  checkSensitiveWord: `${host}/${tokenConfig.baseToken}/api/class/text/check`,

  // 获取图文分类列表 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=362819701#id-%E7%88%B1%E5%87%BA%E7%89%88v1.9.7_api-%E8%8E%B7%E5%8F%96%E5%88%86%E7%B1%BB%E4%B8%8B%E7%9A%84%E5%9B%BE%E6%96%87%E5%88%97%E8%A1%A8(%E5%B0%8F%E7%A8%8B%E5%BA%8F%E6%8E%A5%E5%8F%A3)
  getArticleClassifyList: `${host}/${tokenConfig.baseToken}/api/kindergarten/articles_category_list`,
  // 获取最新推荐列表
  getRecommendList: `${host}/${tokenConfig.baseToken}/api/user/articles_list`,
  // 获取认证课程列表
  getcourseList: `${host}/${tokenConfig.baseToken}/api/user/course_list`,

  /**
   * 分销模块
   */
  // 登录
  saleLogin: `${userHost}/${tokenConfig.saleToken}/oauth/token`,
  // 获取验证码 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=366271170#opapi_%E7%BE%A4%E6%89%93%E5%8D%A1-%E8%8E%B7%E5%8F%96%E9%AA%8C%E8%AF%81%E7%A0%81
  getCode: `${acbHost}/api/user/getcode`,
  // 验证验证码
  verifyCode: `${acbHost}/api/user/getcode/verify`,
  // 忘记密码
  forgetPassword: `${acbHost}/api/user/password`,
  // 保存邀请信息（用户通过二维码进入小程序时请求）
  saveShareInfo: `${host}/${tokenConfig.baseToken}/api/distribution/share`,
  // 申请分销员
  applySaleman: `${host}/${tokenConfig.baseToken}/api/distribution/userLevel`,
  // 生成邀请二维码 
  getInviteCode: `${host}/${tokenConfig.saleToken}/api/distribution/invite`,
  // 获取分销等级列表 
  getLevelList: `${host}/${tokenConfig.baseToken}/api/distribution/levelList`,
  // 获取首页数据
  saleHomeStatis: `${host}/${tokenConfig.saleToken}/api/distribution/home`,
  // 提现页面  获取提现信息
  getCashInfo: `${host}/${tokenConfig.saleToken}/api/distribution/withdrawInfo`,
  // 提现页面  申请提现
  applyCash: `${host}/${tokenConfig.saleToken}/api/distribution/withdraw`,
  // 提现记录
  cashRecord: `${host}/${tokenConfig.saleToken}/api/distribution/withdrawList`,
  // 我的邀请
  getUserInvite: `${host}/${tokenConfig.saleToken}/api/distribution/userInvite`,
  // 获取用户银行卡列表
  getBankCardList: `${host}/${tokenConfig.saleToken}/api/distribution/bankCardList`,
  // 删除银行卡
  delBankCard: `${host}/${tokenConfig.saleToken}/api/distribution/delBankCard`,
  // 获取开户行
  openBank: `${host}/${tokenConfig.saleToken}/api/distribution/bankInfo`,
  // 保存银行卡
  saveBankCard: `${host}/${tokenConfig.saleToken}/api/distribution/saveBankCard`,
  // 提现详情
  getWithdrawDetail: `${host}/${tokenConfig.saleToken}/api/distribution/withdrawDetails`,
  // 交易明细
  tradeDetail: `${host}/${tokenConfig.saleToken}/api/distribution/userDeal`,
  // 收益统计
  profitStatis: `${host}/${tokenConfig.saleToken}/api/distribution/userIncome`,
  // 打包商品详情
  packageGoods: `${host}/${tokenConfig.baseToken}/api/distribution/packGood`,
  // 获取可申请等级信息 
  getLevelInfo: `${host}/${tokenConfig.baseToken}/api/distribution/levelInfo`,

  /**
   * 班级模块
   */
  // 获取班级通知和相册动态 http://wiki.iyunxiao.com/pages/viewpage.action?pageId=372324096&focusedCommentId=373573782#id-%E6%B2%83%E5%AE%B6%E5%9C%86%E9%80%9Aapi%E8%AE%BE%E8%AE%A1-%E8%8E%B7%E5%8F%96%E5%8A%A8%E6%80%81%E8%AF%A6%E6%83%85
  getClassDynamic: `${host}/${tokenConfig.baseToken}/api/class/dynamic/list`,
  // 获取通知/相册动态详情
  getDynamDetail: `${host}/${tokenConfig.baseToken}/api/class/dynamic/detail`,
  // 删除评论
  deleteComment: `${host}/${tokenConfig.baseToken}/api/class/dynamic/comment`,
  // 申诉
  pushAppeal: `${host}/${tokenConfig.baseToken}/api/class/dynamic/review`,
  // 发表评论
  publishComment: `${host}/${tokenConfig.baseToken}/api/class/dynamic/comment`,
  // 点赞
  clickThumb: `${host}/${tokenConfig.baseToken}/api/class/dynamic/click`,
  // 删除动态 
  deleteDynamic: `${host}/${tokenConfig.baseToken}/api/class/dynamic`,
  // 获取身份列表 
  getRoleList: `${host}/${tokenConfig.baseToken}/api/class/user/identity`,
  // 获取亲属关系列表 
  getRelationList: `${host}/${tokenConfig.baseToken}/api/class/relation/list`,
  // 获取相册列表
  getAlbmList: `${host}/${tokenConfig.baseToken}/api/class/album/list`,
  // 创建相册POST/编辑相册PUT/删除相册DELETE
  creatAlbm: `${host}/${tokenConfig.baseToken}/api/class/album`,
  // 获取照片
  getPhoto: `${host}/${tokenConfig.baseToken}/api/class/album/photo`,
  // 添加照片/视频
  addPhoto: `${host}/${tokenConfig.baseToken}/api/class/album/resource`,
  // 删除照片/视频
  deletePhoto: `${host}/${tokenConfig.baseToken}/api/class/album/photo`,
  // 发布照片/视频
  publishPhoto: `${host}/${tokenConfig.baseToken}/api/class/dynamic/resource`,
  // 发布通知
  publishNotic: `${host}/${tokenConfig.baseToken}/api/class/dynamic/notic`,
  // 获取学习圈
  getStudyCircle: `${host}/${tokenConfig.baseToken}/api/class/study/circle`,
  // 获取学习详情
  getStudyInfo: `${host}/${tokenConfig.baseToken}/api/class/study/info`,
  // 添加宝宝 post
  addBaby: `${host}/${tokenConfig.baseToken}/api/class/user/baby`,
  // 修改宝宝 put 
  editBaby: `${host}/${tokenConfig.baseToken}/api/class/user/baby`,
  // 修改老师 put 
  editTeacher: `${host}/${tokenConfig.baseToken}/api/class/user/teacher`,
  // 家长删除宝宝 delete
  deleteUserBaby: `${host}/${tokenConfig.baseToken}/api/class/user/baby`,
  // 班级删除宝宝 delete 
  deleteClassBaby: `${host}/${tokenConfig.baseToken}/api/class/cancel/baby`,
  // 删除老师 delete 
  deleteTeacher: `${host}/${tokenConfig.baseToken}/api/class/user/teacher`,
  // 获取班级类型列表
  getClassType: `${host}/${tokenConfig.baseToken}/api/class/type`,
  // 获取班级信息get \ 添加班级post \ 修改班级put \ 解散班级delete
  handleClassInfo: `${host}/${tokenConfig.baseToken}/api/class/user/class`,
  // 获取当前身份get \ 切换身份put
  handleCurRole: `${host}/${tokenConfig.baseToken}/api/class/user/current/identity`,
  // 邀请老师
  postTeacher: `${host}/${tokenConfig.baseToken}/api/class/invite/teacher`,
  // 邀请家长
  postParent: `${host}/${tokenConfig.baseToken}/api/class/invite/parent`,
  // 获取该家长下宝宝列表信息
  getUserBaby: `${host}/${tokenConfig.baseToken}/api/class/user/baby`,
  // 获取海报分类列表
  getPosterCategoryList: `${host}/${tokenConfig.baseToken}/api/poster/categoryList`,
  // 获取海报列表
  getPosterList: `${host}/${tokenConfig.baseToken}/api/poster/list`,

  /**
   * 奖学金模块
   */
  // 获取用户银行卡列表
  getBonusBankCardList: `${host}/${tokenConfig.baseToken}/api/bonus/bankCardList`,
  // 删除用户银行卡
  delBonusBankCardList: `${host}/${tokenConfig.baseToken}/api/bonus/delBankCard`,
  // 保存银行卡
  postBonusSaveBankCard: `${host}/${tokenConfig.baseToken}/api/bonus/saveBankCard`,
  // 获取开户行
  getOpenBank: `${host}/${tokenConfig.baseToken}/api/distribution/bankInfo`,
  // 获取提现详情
  getBonusWithdrawDetails: `${host}/${tokenConfig.baseToken}/api/bonus/withdrawDetails`,
  // 奖学金我的邀请
  getBonusUserInvite: `${host}/${tokenConfig.baseToken}/api/bonus/userInvite`,
  // 获取奖学金首页数据
  getBonusHome: `${host}/${tokenConfig.baseToken}/api/bonus/home`,
  // 获取提现信息
  getBonusWithdrawInfo: `${host}/${tokenConfig.baseToken}/api/bonus/withdrawInfo`,
  // 申请提现
  applyBonusWithdrawInfo: `${host}/${tokenConfig.baseToken}/api/bonus/withdraw`,
  // 获取提现记录
  getBonusList: `${host}/${tokenConfig.baseToken}/api/bonus/withdrawList`,
  // 获取交易明细
  getBonusDetail: `${host}/${tokenConfig.baseToken}/api/bonus/userDeal`,
  // 获取收益统计
  getBonusStatis: `${host}/${tokenConfig.baseToken}/api/bonus/userIncome`,
  // 生成邀请二维码 
  getBonusInviteCode: `${host}/${tokenConfig.baseToken}/api/bonus/invite`,
  /** 
   * 机构建站
   */
  // 获取店铺宣传信息
  getShopInformation: `${acbHost}/${tokenConfig.baseToken}/api/res/shop/get_publicity_shop`,
  // 加盟商入驻
  postPartnerJoin: `${host}/${tokenConfig.baseToken}/api/partner/join`,
  // 获取用户活动订单状态
  getOrderStatus: `${host}/${tokenConfig.baseToken}/api/marketing/order/status`,
  // 获取商品对应活动 post
  getActivityGood: `${host}/${tokenConfig.baseToken}/api/marketing/goods/activitys`,
  // 获取拼团列表
  getGroupList: `${host}/${tokenConfig.baseToken}/api/marketing/clouds/list`,
  // 获取活动详情
  getActivityDetail: `${host}/${tokenConfig.baseToken}/api/marketing/goods/activity_info`,
  // 创建订单
  creatOrder: `${host}/${tokenConfig.baseToken}/api/marketing/order/create`,
  // 验证是否有拼团资格
  checkGroup: `${host}/${tokenConfig.baseToken}/api/marketing/pay/ability`,
  // 获取拼团详情
  groupDetail: `${host}/${tokenConfig.baseToken}/api/marketing/cloud`,
  // 支付成功加入拼团回调
  joinGroup: `${host}/${tokenConfig.baseToken}/api/marketing/cloud/join`,
  // 分享、游览记录
  updateRecord: `${host}/${tokenConfig.baseToken}/api/marketing/goods/share`,
  // 存分享数据
  saveShareData: `${host}/${tokenConfig.baseToken}/api/pay/save`,
  // 获取存储的分享数据
  getData: `${host}/${tokenConfig.baseToken}/api/pay/getInfo`
};

