let ignoreFolder = [ 
  'components/tabMyTwo/tabMy'
];
let ignoreFile = [ // 忽略的具体页面和组件
  'pages/activityWorks/activityWorks',      
  'pages/kindergarten/kindergarten',            // 园所首页
  'pages/knowledgeGraph/knowledgeGraph',        // 知识图谱页
  'pages/graphField/graphField',                // 知识图谱领域页
  'pages/graphTarget/graphTarget',              // 知识图谱目标页
  'pages/gardenTrends/gardenTrends',            // 园所活动列表页
  'pages/gardenIntroduce/gardenIntroduce',      // 园所介绍页
  'pages/setBrief/setBrief',                    // 园所照片页
  'pages/setWorks/setWorks',                    // 园所添加活动作品页
  'pages/contactUs/contactUs',                  // 园所联系我们页
  'pages/bindSchool/bindSchool',                // 绑定园所页
  'pages/addressDetail/addressDetail',          // 园所地址详情页
  'pages/mrzhang/mrzhang',                      // 张雪门介绍页
  'pages/resourceBase/resourceBase',            // 旧版资源库页
  'pages/courseDetailTwo/courseDetail',         // 旧版课程详情页
  'pages/courseVideoTwo/courseVideo',           // 旧版课时播放页
  'pages/treeList/treeList'                     // 多级目录树页
];
function setIgnoreType (type) {
  let list = []; 
  ignoreFolder.forEach(item => {
    list.push(`./src/${item}.${type}`);
  });
  ignoreFile.forEach(item => {
    list.push(`./src/${item}.${type}`);
    // list.push(`!./src/${item}/**/*.${type}`);
  });
  return list;
}

// gulp打包忽略页面
module.exports = {
  setIgnoreType
};