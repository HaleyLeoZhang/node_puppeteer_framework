// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Supplier from './'
import {AVAILABLE_CHANNEL_LIST, AVAILABLE_STATUS_LIST, FIELD_CHANNEL, FIELD_STATUS} from "./Enum";
import GuFengService from "../../../services/Comic/GuFengService";
import LiuManHuaService from "../../../services/Comic/LiuManHuaService";
import KuManWuService from "../../../services/Comic/KuManWuervice";
import HaoManLiuService from "../../../services/Comic/HaoManLiuService";
import BaoZiService from "../../../services/Comic/BaoZiService";
import SupplierChapter from "../SupplierChapter";

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
            'channel': AVAILABLE_CHANNEL_LIST,
            'status': AVAILABLE_STATUS_LIST,
            'ORDER': {"id": "ASC"},
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return []
        }
        return results
    }


    /**
     * 获取最权重最高的有效渠道
     * @param int related_id 漫画ID
     * @return int
     */
    static async get_supplier_id_by_weight(related_id) {
        const where = {
            'related_id': related_id,
            'channel': AVAILABLE_CHANNEL_LIST,
            'status': [
                FIELD_STATUS.ONLINE,
            ],
            'ORDER': {
                "weight": "DESC",
                "id": "ASC",
            },
            'LIMIT': 1,
        }
        const results = await Supplier.select(where)
        if (0 === results.length) {
            return 0
        }
        return results[0].id
    }

    /**
     * 查询漫画当前未被删除的渠道信息
     * @param int related_id 漫画ID
     * @return Promise - array
     */
    static async get_not_deleted_list_by_related_id(related_id) {
        const where = {
            'related_id': related_id,
            'status': FIELD_STATUS.ONLINE,
            'ORDER': {
                "weight": "ASC",
                "id": "ASC",
            },
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
     * 通过漫画ID删除所有渠道
     * @return Promise
     */
    static delete_suppliers_by_comic_id(comic_id) {
        const where = {
            'related_id': comic_id,
            'status': FIELD_STATUS.ONLINE,
        }
        const update = {
            'status': FIELD_STATUS.DELETED,
        }
        return Supplier.update(update, where)
    }

    /**
     * 通过漫画ID删除所有不在范围内的渠道ID组
     * @return Promise
     */
    static delete_not_in_suppliers_by_comic_id(comic_id, supplier_ids) {
        if (supplier_ids.length === 0) {
            return SupplierData.delete_suppliers_by_comic_id(comic_id)
        }
        const where = {
            'related_id': comic_id,
            'id[!=]': supplier_ids,
            'status': FIELD_STATUS.ONLINE,
        }
        const update = {
            'status': FIELD_STATUS.DELETED,
        }
        return Supplier.update(update, where)
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
            case FIELD_CHANNEL.HAO_MAN_LIU:
                text = '好漫6'
                break;
            case FIELD_CHANNEL.BAO_ZI:
                text = '包子漫画'
                break;
            case FIELD_CHANNEL.TU_ZHUI:
                text = '兔追漫画'
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
                href = `${GuFengService.get_base_href()}/manhua/${source_id}/`
                break;
            case FIELD_CHANNEL.LIU_MAN_HUA:
                href = `${LiuManHuaService.get_base_href()}/${source_id}/`
                break;
            case FIELD_CHANNEL.KU_MAN_WU:
                href = `${KuManWuService.get_base_href()}/${source_id}/`
                break;
            case FIELD_CHANNEL.HAO_MAN_LIU:
                href = `${HaoManLiuService.get_base_href()}/comic/${source_id}`
                break;
            case FIELD_CHANNEL.BAO_ZI:
                href = `${BaoZiService.get_base_href()}/comic/${source_id}`
                break;
        }
        return href
    }

    /**
     * 批量插入数据
     * @param array list 整理好对应表中格式的渠道列表
     * @return Promise
     */
    static async do_insert(list) {
        return Supplier.insert(list)
    }
}