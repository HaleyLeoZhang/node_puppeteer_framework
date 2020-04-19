import Base from './Base'

const FIELD_METHOD = {
    'UNKNOWN': 0,
    'AUTO': 1, // 爬取时自动获取
    'ARTIFICAL': 2, // 人工
}

const FIELD_IS_ONLINE = {
    "YES": 1,
    "NO": 0,
}

const FIELD_IS_COMPLETE = {
    "YES": 1,
    "NO": 0,
}

const FIELD_EXT_1 = { // ext_1 字段：值对应 数据类型
    "ZHANG_JIE": 1, // 章节
    "FAN_WAI": 2, // 番外
    "LIAN_ZAI": 3, // 连载
}

class Comic extends Base {
    static get_table(){
        return 'comics'
    }
}

export default Comic;

export {
    FIELD_METHOD,
    FIELD_IS_ONLINE, 
    FIELD_IS_COMPLETE,
    FIELD_EXT_1,
}