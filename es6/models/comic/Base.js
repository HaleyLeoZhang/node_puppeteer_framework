// ----------------------------------------------------------------------
// Comic 库 数据表 模型基类
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import { DSN_COMIC } from '../../conf/db/mysql'
import BaseModel from '../../libs/Base/BaseModel'

class Base extends BaseModel {
    static get_dsn(){
        return DSN_COMIC // 注入数据库配置
    }
}

export default Base;