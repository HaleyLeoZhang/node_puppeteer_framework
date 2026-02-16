// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Comic from './'
import {AVAILABLE_STATUS_LIST, FIELD_STATUS} from "./Enum";

export default class ComicData {
    /**
     * 查询
     * @param int id 漫画ID
     * @return Promise - JSON
     */
    static async get_comic_by_id(id) {
        const where = {
            'id': id,
        }
        const results = await Comic.select(where)
        if (0 === results.length) {
            return null
        }
        return results[0]
    }

    /**
     * 更新该漫画详情
     * @return Promise
     */
    static update_comic_by_id(id, update) {
        const where = {
            'id': id,
        }
        return Comic.update(update, where)
    }

    /**
     * 设置默认渠道
     * @return Promise
     */
    static set_default_supplier(id, supplier_id) {
        const where = {
            'id': id,
        }
        let update = {
            'related_id': supplier_id,
        }
        if (supplier_id === 0) { // 如果没有渠道，就下线
            update['status'] = FIELD_STATUS.OFFLINE
        }
        return Comic.update(update, where)
    }


    /**
     * 获取当前未删除的漫画列表
     * @return Promise - array
     */
    static async get_list_available() {
        const where = {
            'status': AVAILABLE_STATUS_LIST,
            'ORDER': {"weight": "DESC"},
        }
        const results = await Comic.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }
}