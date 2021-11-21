// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Supplier from './'
import {FIELD_CHANNEL, FIELD_STATUS} from "./Enum";
import GuFengService from "../../../services/Comic/GuFengService";
import LiuManHuaService from "../../../services/Comic/LiuManHuaService";
import KuManWuService from "../../../services/Comic/KuManWuervice";

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
            'channel': [
                FIELD_CHANNEL.GU_FENG,
            ],
            'status': FIELD_STATUS.ONLINE,
            'ORDER': {"id": "ASC"},
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }

    /**
     * 查询漫画当前未被删除的渠道信息
     * @param int related_id 漫画ID
     * @return Promise - array
     */
    static async get_not_deleted_list_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
            'status[!=]': FIELD_STATUS.DELETED,
            'ORDER': {"id": "ASC"},
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }

    /**
     * 查询渠道信息
     * @param int id 渠道ID
     * @return Promise - array
     */
    static async get_one_by_id(id) {
        const where = {
            'id': id,
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return null
        }
        return results[0]
    }

    /**
     * 查询渠道信息
     * @param array id_list 渠道ID组
     * @return Promise - array
     */
    static async get_by_id_list(id_list) {
        const where = {
            'id': id_list,
            'ORDER': {"id": "ASC"},
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }

    /**
     * 更新该漫画详情
     * @return Promise
     */
    static update_supplier_by_id(id, update) {
        const where = {
            'id': id,
        }
        return Supplier.update(update, where)
    }

    /**
     * 获取渠道名
     */
    static get_channel_text(channel) {
        let text = ''
        switch (parseInt(channel)) {
            case FIELD_CHANNEL.GU_FENG:
                text = '古风漫画'
                break;
            case FIELD_CHANNEL.LIU_MAN_HUA:
                text = '六漫画'
                break;
            case FIELD_CHANNEL.KU_MAN_WU:
                text = '酷漫屋'
                break;
        }
        return text
    }

    /**
     * 获取对应渠道链接
     */
    static get_source_href(channel, source_id) {
        let href = ''
        switch (parseInt(channel)) {
            case FIELD_CHANNEL.GU_FENG:
                href =`${GuFengService.get_base_href()}/manhua/${source_id}/`
                break;
            case FIELD_CHANNEL.LIU_MAN_HUA:
                href =`${LiuManHuaService.get_base_href()}/${source_id}/`
                break;
            case FIELD_CHANNEL.KU_MAN_WU:
                href =`${KuManWuService.get_base_href()}/${source_id}/`
                break;
        }
        return href
    }
}