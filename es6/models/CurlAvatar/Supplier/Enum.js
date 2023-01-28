// ----------------------------------------------------------------------
// 业务枚举常量
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

//    `channel` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值 0:未知 1:古风漫画 2:奇漫屋' 3:6漫画 4:酷漫屋
const FIELD_CHANNEL = {
    "UNKNOWN": 0,
    "GU_FENG": 1, // 古风漫画 https://www.gufengmh8.com/
    "QI_MAN_WU": 2, // 奇漫屋 http://www.qiman6.com/ 2021-11-21 15:41:26 已废弃
    "LIU_MAN_HUA": 3, // 6漫画 http://www.sixmh7.com/ 2021-11-21 15:41:26 已废弃
    "KU_MAN_WU": 4, // 酷漫屋 http://www.kmwu6.com/
    "HAO_MAN_LIU": 5, // 好漫6 https://www.g-lens.com/  -- 要翻墙
    "BAO_ZI": 6, // 包子漫画 https://www.baozimh.com/ -- 要翻墙
    "TU_ZHUI": 7, // 兔追漫画 https://www.mianzhui.com/woweixiedi/
    "MAN_HUA_XING_QIU": 8, // 漫画星球 http://www.mhxqiu2.com/
    "GO_DA": 8, // GoDa漫画 https://cn.godamanga.com/
}

//  `status` tinyint(1) unsigned NOT NULL DEFAULT '200' COMMENT '状态(0:删除,50:渠道不可用,100:手动下线,200:正常)',
const FIELD_STATUS = {
    "DELETED": 0,
    "INVALID": 50,
    "OFFLINE": 100,
    "ONLINE": 200,
}

// 有效状态数据列表
const AVAILABLE_STATUS_LIST = [
    FIELD_STATUS.OFFLINE, FIELD_STATUS.ONLINE
]

// 有效渠道列表
const AVAILABLE_CHANNEL_LIST = [
    // FIELD_CHANNEL.GU_FENG,
    // FIELD_CHANNEL.HAO_MAN_LIU,
    FIELD_CHANNEL.KU_MAN_WU,
    // FIELD_CHANNEL.BAO_ZI,
    // FIELD_CHANNEL.TU_ZHUI,
    FIELD_CHANNEL.MAN_HUA_XING_QIU,
    FIELD_CHANNEL.GO_DA,
]

//  `ext_1` varchar(50) NOT NULL DEFAULT '' COMMENT '扩展字段1.针对不同场景使用',
const FIELD_EXT_1 = {
    // TODO
}
export {
    FIELD_CHANNEL,
    FIELD_STATUS,
    FIELD_EXT_1,
    AVAILABLE_STATUS_LIST,
    AVAILABLE_CHANNEL_LIST,
}