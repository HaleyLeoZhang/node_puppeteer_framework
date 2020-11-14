// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Comic from './'

export default class ComicData {
    /**
     * 获取指定渠道漫画信息
     * @param int channel 渠道ID
     * @param int source_id 资源ID
     * @return Promise - JSON
     */
    static async get_comic_by_id(id) {
        const where = {
            'id': id,
            'ORDER': { "id": "asc" },
            'LIMIT': 1,
        }
        const datas = await Comic.select(where)
        if (0 === datas.length) {
            return null
        }
        return datas[0]
    }
    /**
     * 更新该漫画详情
     * @return Promise
     */
    static update_comic_by_id(update, id){
        const where = {
            'id': id,
        } 
        const promise = Comic.update(update, where)
        return promise
    }
}