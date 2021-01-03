// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Comic from './'
import {FIELD_STATUS} from "../Comic/Enum";

export default class ComicData {
    /**
     * 查询
     * @param int id 漫画ID
     * @return Promise - JSON
     */
    static async get_comic_by_id(id) {
        const where = {
            'id': id,
            'ORDER': {"id": "asc"},
            'LIMIT': 1,
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
     * 获取当前未删除的漫画列表
     * @return Promise - array
     */
    static async get_list_available() {
        const where = {
            'status': [FIELD_STATUS.OFFLINE, FIELD_STATUS.ONLINE],
            'ORDER': {"weight": "DESC"},
        }
        const results = await Comic.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }
}