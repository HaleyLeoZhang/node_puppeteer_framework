// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import SupplierImage from './'
import {FIELD_STATUS} from "./Enum";
import Comic from "../Comic";

export default class SupplierImageData {
    /**
     * 批量插入数据
     * @param array list 整理好对应表中格式的图片列表
     * @return Promise
     */
    static async do_insert(list) {
        let duplicate_sql = 'ON DUPLICATE KEY UPDATE status = VALUES( status ), src_origin = VALUES( src_origin ), src_origin = VALUES( src_origin ), progress = VALUES( progress )';
        return SupplierImage.insert(list, duplicate_sql)
    }

    /**
     * 更新该漫画详情
     * @param int related_id 章节ID
     * @return Promise
     */
    static delete_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
        }
        const update = {
            'status': FIELD_STATUS.DELETED
        }
        return SupplierImage.update(update, where)
    }
}