// ----------------------------------------------------------------------
// 模型与表的关系
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import Base from '../Base'

class Comic extends Base {
    static get_table(){
        return 'comic'
    }
}

export default Comic;