// ----------------------------------------------------------------------
// 测试 
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Comic,{FIELD_IS_COMPLETE} from '../models/Data/ComicData.js'
import Page from '../models/Data/Page.js'
import PageCache from '../caches/PageCache.js'

const CHANNEL_MHN = 2; // 漫画牛

class Test{
    /**
     * 测试 SQL
     */
    static async sql(){

        // const where = {
        //     'id[!=]': [1, 3],
        // }
        // let data = await Data.select(where)
        // console.log(data) 

        // const where = {
        //     'channel': 2,
        // }
        // let data = await Data.select(where)
        // console.log(data) 

        // const sql = 'SELECT count( id ) AS counter FROM comics WHERE is_deleted = ?';
        // const conditions = [1];
        // let data = await Data.query(sql, conditions)
        // console.log(data[0].counter)  // select 操作的时候 data 返回的是查询的结果一维数组,其他情况是返回的操作结果

        // const sql = 'UPDATE comics SET is_deleted = ? WHERE  id < ?';
        // const conditions = [1, 1];
        // let data = await Data.query(sql, conditions)
        // console.log(sql, data.affectedRows)  // update (增、删、改)操作的啥时候 影响行数 data.affectedRows

        // 检测sql异常时候的捕获
        const sql = 'UPDATE comics SET is_deleted = ? WHERE  xxx id < ?';
        const conditions = [1, 1];
        let data = await Comic.query(sql, conditions)
        console.log(sql, data.affectedRows)  // update (增、删、改)操作的啥时候 影响行数 data.affectedRows
    }
    /**
     * 测试 CACHE
     */
    static async cache(){
        // 设置缓存
        let cache_key = 12;
        let cache_data = 2333;
        console.log('设置缓存') 
        await PageCache.set_data(cache_key, cache_data);
        let res = await PageCache.get_data(cache_key);
        console.log(res) 
        // 删除缓存
        console.log('删除缓存') 
        await PageCache.delete_data(cache_key, cache_data);
        let res_1 = await PageCache.get_data(cache_key);
        console.log(res_1) 
        
    }
}
export default Test