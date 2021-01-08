// ----------------------------------------------------------------------
// 业务枚举常量
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

//    `channel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值 0:未知 1:古风漫画 2:奇漫屋',
const FIELD_CHANNEL = {
    "UNKNOWN": 0,
    "GU_FENG": 1, // 古风漫画 https://www.gufengmh8.com/
    "QI_MAN_WU": 2, // 奇漫屋 http://www.qiman6.com/
    "LIU_MAN_HUA": 3, // 6漫画 http://www.6mh7.com/
}

//  `status` tinyint(1) unsigned NOT NULL DEFAULT '200' COMMENT '状态(0:删除,50:渠道不可用,100:手动下线,200:正常)',
const FIELD_STATUS = {
    "DELETED": 0,
    "INVALID": 50,
    "OFFLINE": 100,
    "ONLINE": 200,
}

//  `ext_1` varchar(50) NOT NULL DEFAULT '' COMMENT '扩展字段1.针对不同场景使用',
const FIELD_EXT_1 = {
    // TODO
}
export {
    FIELD_CHANNEL,
    FIELD_STATUS,
    FIELD_EXT_1,
}