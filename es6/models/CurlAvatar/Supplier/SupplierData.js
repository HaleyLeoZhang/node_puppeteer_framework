// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Supplier from './'
import {FIELD_STATUS} from "./Enum";

export default class SupplierData {
    /**
     * 下线对应漫画所有渠道
     * @param int related_id 漫画ID
     * @return Promise - JSON
     */
    static async offline_all_supplier_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
            'status': FIELD_STATUS.ONLINE,
        }
        const update = {
            'status': FIELD_STATUS.OFFLINE,
        }
        return Supplier.update(update, where)
    }
    /**
     * 查询漫画当前有效的的渠道信息
     * @param int related_id 漫画ID
     * @return Promise - array
     */
    static async get_list_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
            'status': FIELD_STATUS.ONLINE,
            'ORDER': { "id": "asc" },
        }
        const results = await Supplier.select(where)
        console.log(results)
        if (0 === results.length) {
            return []
        }
        return results
    }
}