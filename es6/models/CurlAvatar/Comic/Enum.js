// ----------------------------------------------------------------------
// 业务枚举常量
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

//  `method` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '枚举值(获取漫画详情的方式):0:未知,1:爬取时自动获取(每次),2:爬取时自动获取(仅限初始时),3:手动',
const FIELD_METHOD = {
    "UNKNOWN": 0,
    "AUTO": 1,
    "AUTO_ONCE": 2,
    "MANUAL_TRIGGER": 3,
}

//  `status` tinyint(1) unsigned NOT NULL DEFAULT '100' COMMENT '状态(0:删除,100:下线,200:上线)',
const FIELD_STATUS = {
    "DELETED": 0,
    "OFFLINE": 100,
    "ONLINE": 200,
}

// 有效状态数据列表
const AVAILABLE_STATUS_LIST = [
    FIELD_STATUS.OFFLINE, FIELD_STATUS.ONLINE
]

export {
    FIELD_METHOD,
    FIELD_STATUS,
    AVAILABLE_STATUS_LIST,
}