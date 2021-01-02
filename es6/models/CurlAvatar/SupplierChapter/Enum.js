// ----------------------------------------------------------------------
// 业务枚举常量
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

//  `status` tinyint(1) unsigned NOT NULL DEFAULT '200' COMMENT '状态(0:删除,100:待爬取图片,200:正常)',
const FIELD_STATUS = {
    "DELETED": 0,
    "WAIT": 100,
    "ONLINE": 200,
}

export {
    FIELD_STATUS,
}