const images = {
  wx: {
    commonPosterView: [ // 通用海报选择图（奖学金、加盟商）
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192828041.8025parent_view_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192876687.112parent_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192891700.2944parent_view_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192905656.4348parent_view_4.png'
      ],[
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192998211.9312xj_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193179751.4426post_view_01.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193192685.3538post_view_02.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193209950.293post_view_04.jpg'
      ]
    ],  
    commonPosterBg: [ // 通用海报（奖学金、加盟商）
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181495986.952parent_post_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181513745.7988parent_post_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181529349.452parent_post_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181545008.7776parent_post_4.png'
      ],[
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739884978.9854post_1.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739902317.8423post_2.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739916165.7925post_3.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739930853.3694post_4.jpeg'
      ]
    ],
    codePosterView: [ // 分销海报选择图
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192983521.7869xj_view_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192998211.9312xj_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193011565.6592xj_view_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193027517.6357xj_view_4.png'
      ],
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193076922.707yz_view_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193091791.9424yz_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193104999.2827yz_view_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193119551.3132yz_view_4.png'
      ]
    ],  
    codePosterBg: [ // 分销海报
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180799857.8254xj_post_1.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180817009.544xj_post_2.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180832448.6997xj_post_3.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180847631.7273xj_post_4.jpg'
      ],
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180876394.9563yz_post_1.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180892382.5393yz_post_2.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180909163.7637yz_post_3.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180925974.1028yz_post_4.jpg'
      ]
    ],  
    contactChannelsIcon: { // 联系我们图标
      phone: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233385210.3748channels_phone.png',
      weixin: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233357234.6418channels_weixin.png',
      position: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233288661.786channels_position.png'
    },  
    coursePosterView: [ // 课程海报选择图
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193179751.4426post_view_01.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193192685.3538post_view_02.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193207356.2246post_view_03.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193209950.293post_view_04.jpg'
    ],  
    coursePosterBg: [ // 课程海报
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181217477.7427post_bg_01.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181231481.282post_bg_02.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181247750.4756post_bg_03.jpg',
      'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181262272.8682post_bg_04.jpg'
    ], 
    jiGouHomeIcon: {  // 机构首页图标
      kecheng: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590384817790.976icon_kecheng.png',
      activity: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590811572062.1682activity.png',
      pinpai: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388017444.1394icon_pinpai.png',
      shizi: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388911326.004icon_shizi.png',
      rongyu: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388886335.2903icon_rongyu.png',
      xueyuan: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388941511.684icon_xueyuan.png',
      lianxi: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233176678.7793icon_lianxi.png',
    },
    authorizedImg: {
      wjyt: {

      }
    },
    othersImage: {
      default_head: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590741569841.1306default_head.png', // 默认头像
      categoryBg: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587441045857.7896courseClass_d.jpg', // 课程详情页分类备用默认图
      post_page_bg: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193326138.068post_page_bg.jpg'
    }
  },
  yx: {
    commonPosterView: [ // 通用海报选择图（奖学金、加盟商）
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192828041.8025parent_view_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192876687.112parent_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192891700.2944parent_view_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192905656.4348parent_view_4.png'
      ],[
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587192998211.9312xj_view_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193179751.4426post_view_01.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193192685.3538post_view_02.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193209950.293post_view_04.jpg'
      ]
    ],  
    commonPosterBg: [ // 通用海报（奖学金、加盟商）
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181495986.952parent_post_1.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181513745.7988parent_post_2.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181529349.452parent_post_3.png',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587181545008.7776parent_post_4.png'
      ],[
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739884978.9854post_1.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739902317.8423post_2.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739916165.7925post_3.jpeg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590739930853.3694post_4.jpeg'
      ]
    ],
    codePosterView: [ // 分销海报选择图
      [
        'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/huixue/codeView_1.png',
        'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/huixue/codeView_2.png',
        'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/huixue/codeView_3.png',
      ],[]
    ],  
    codePosterBg: [ // 分销海报
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180799857.8254xj_post_1.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180817009.544xj_post_2.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180832448.6997xj_post_3.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180847631.7273xj_post_4.jpg'
      ],
      [
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180876394.9563yz_post_1.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180892382.5393yz_post_2.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180909163.7637yz_post_3.jpg',
        'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587180925974.1028yz_post_4.jpg'
      ]
    ],  
    contactChannelsIcon: { // 联系我们图标
      phone: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233385210.3748channels_phone.png',
      weixin: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233357234.6418channels_weixin.png',
      position: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233288661.786channels_position.png'
    },  
    coursePosterView: [ // 课程海报选择图
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_view_01.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_view_02.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_view_03.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_view_04.jpg'
    ],  
    coursePosterBg: [ // 课程海报
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_bg_01.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_bg_02.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_bg_03.jpg',
      'https://ks3-slw.yunxiao.com/slwimage/KnowledgePaymentKinderGarten_Client/post/post_bg_04.jpg'
    ], 
    jiGouHomeIcon: {  // 机构首页图标
      kecheng: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590384817790.976icon_kecheng.png',
      activity: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590811572062.1682activity.png',
      pinpai: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388017444.1394icon_pinpai.png',
      shizi: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388911326.004icon_shizi.png',
      rongyu: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388886335.2903icon_rongyu.png',
      xueyuan: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590388941511.684icon_xueyuan.png',
      lianxi: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590233176678.7793icon_lianxi.png',
    },
    authorizedImg: {
      wjyt: {

      }
    },
    othersImage: {
      default_head: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1590741569841.1306default_head.png', // 默认头像
      categoryBg: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587441045857.7896courseClass_d.jpg', // 课程详情页分类备用默认图
      post_page_bg: 'https://woxue-dev.oss-cn-beijing.aliyuncs.com/1587193326138.068post_page_bg.jpg'
    }
  }
};
module.exports = images.wx;
// todo: wx为沃学服务网络图 / yx为云校服务网络图
