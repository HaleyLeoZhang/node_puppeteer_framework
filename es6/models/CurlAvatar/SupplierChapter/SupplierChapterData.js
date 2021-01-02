// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import SupplierChapter from './'
import {FIELD_STATUS} from "./Enum";
import Comic from "../Comic";

export default class SupplierChapterData {
    /**
     * 查询漫画当前有效的的渠道信息
     * @param int related_id 漫画ID
     * @return Promise - array
     */
    static async get_list_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
            'status': FIELD_STATUS.ONLINE,
            'ORDER': {"id": "ASC"},
        }
        const results = await SupplierChapter.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }
    /**
     * @param int related_id 渠道ID
     * @param array sequence_list
     * @return Promise - array
     */
    static async get_list_by_id_sequence_list(related_id, sequence_list) {
        const where = {
            'related_id': related_id,
            'status': [FIELD_STATUS.WAIT, FIELD_STATUS.ONLINE],
            'sequence': sequence_list,
            'ORDER': {"id": "ASC"},
        }
        const results = await SupplierChapter.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }
    /**
     * 查询
     * @param int id 章节ID
     * @return Promise - JSON
     */
    static async get_chapter_by_id(id) {
        const where = {
            'id': id,
            'ORDER': {"id": "asc"},
            'LIMIT': 1,
        }
        const results = await SupplierChapter.select(where)
        if (0 === results.length) {
            return null
        }
        return results[0]
    }

    /**
     * 批量插入数据
     * @param array list 整理好对应表中格式的图片列表
     * @return Promise
     */
    static async do_insert(list) {
        let duplicate_sql = 'ON DUPLICATE KEY UPDATE status = VALUES( status )';
        return SupplierChapter.insert(list, duplicate_sql)
    }

    /**
     * 更新该漫画详情
     * @param int id 章节ID
     * @return Promise
     */
    static set_status_ok_by_id(id) {
        const where = {
            'id': id,
        }
        const update = {
            'status': FIELD_STATUS.ONLINE
        }
        return SupplierChapter.update(update, where)
    }
}