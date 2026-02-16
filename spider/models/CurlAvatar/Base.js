// ----------------------------------------------------------------------
// Data 库 数据表 模型基类
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import BaseModel from '../../libs/Base/BaseModel'
import {DB_COMIC} from "../../conf";

class Base extends BaseModel {
    static get_dsn(){
        return DB_COMIC // 注入数据库配置
    }
}

export default Base;