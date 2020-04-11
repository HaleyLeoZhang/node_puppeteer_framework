// ----------------------------------------------------------------------
// 测试 
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Comic,{FIELD_IS_COMPLETE} from '../models/Comic/Comic.js'
import Page from '../models/Comic/Page.js'
import PageCache from '../caches/PageCache.js'

const CHANNEL_MHN = 2; // 漫画牛

class Test{
    /**
     * 测试 SQL
     */
    static async sql(){
        // const where = {
        //     'channel': 2,
        // }
        // let data = await Comic.select(where)
        // console.log(data) 

        const sql = 'SELECT count( id ) AS counter FROM comics WHERE is_deleted = ?';
        const conditions = [1];
        let data = await Comic.query(sql, conditions)
        console.log(data[0].counter)  // select 操作的时候 data 返回的是查询的结果一维数组,其他情况是返回的操作结果

        // const sql = 'UPDATE comics SET is_deleted = ? WHERE  id < ?';
        // const conditions = [1, 1];
        // let data = await Comic.query(sql, conditions)
        // console.log(sql, data.affectedRows)  // update (增、删、改)操作的啥时候 影响行数 data.affectedRows
    }
    /**
     * 测试 CACHE
     */
    static async cache(){
        let cache_key = 12;
        let cache_data = 2333;
        await PageCache.set_data(cache_key, cache_data);
        let res = await PageCache.get_data(cache_key);
        console.log(res) 
    }
}
export default Test