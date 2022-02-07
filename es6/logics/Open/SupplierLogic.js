import Base from './Base'
import Log from '../../tools/Log'
import SupplierData from "../../models/CurlAvatar/Supplier/SupplierData";
import {AVAILABLE_CHANNEL_LIST, FIELD_CHANNEL} from "../../models/CurlAvatar/Supplier/Enum";
import HaoManLiuService from "../../services/Comic/HaoManLiuService";
import BaoZiService from "../../services/Comic/BaoZiService";
import * as Enum from "../../models/CurlAvatar/Supplier/Enum";
import KuManWuService from "../../services/Comic/KuManWuervice";

export default class SupplierLogic extends Base {
    static async list_by_ids(ctx, id_list) {
        let list = await SupplierData.get_by_id_list(id_list)
        list = Base.handle_datetime(list, 'created_at,updated_at')
        list = SupplierLogic.list_add_parse_fields(list)
        return list
    }

    static async list_by_comic_id(ctx, comic_id) {
        let list = await SupplierData.get_not_deleted_list_by_related_id(comic_id)
        list = Base.handle_datetime(list, 'created_at,updated_at')
        list = SupplierLogic.list_add_parse_fields(list)
        return list
    }

    static async list_add_parse_fields(list) {
        let lenList = list.length
        if (lenList > 0) {
            for (let i = 0; i < lenList; i++) {
                let channel = list[i]["channel"]
                let source_id = list[i]["source_id"]
                list[i]["text_channel"] = SupplierData.get_channel_text(channel)
                list[i]["text_href"] = SupplierData.get_source_href(channel, source_id)
            }
        }
        return list
    }

    // 漫画页保存渠道信息
    static async save_supplier_list_by_comic_id(ctx, comic_id) {
        // TODO
    }

    // 漫画基本配置
    static comic_conf() {
        let data = []

        let map_channel = {}
        let len = Enum.AVAILABLE_CHANNEL_LIST.length
        if (len === 0) {
            return data
        }
        for (let i = 0; i < len; i++) {
            let channel_id = Enum.AVAILABLE_CHANNEL_LIST[i]
            map_channel[channel_id] = true
        }
        // - 基本数据
        let base_list = [
            {
                "id": FIELD_CHANNEL.KU_MAN_WU, // 有效渠道ID
                "host": KuManWuService.get_base_href(),
            },
            {
                "id": FIELD_CHANNEL.BAO_ZI, // 有效渠道ID
                "host": BaoZiService.get_base_href(),
            },
        ]

        for (let j = 0, len_j = base_list.length; j < len_j; j++) {
            // - 检测是否有效
            let base_info = base_list[j]
            if (!map_channel[base_info.id]) {
                continue
            }
            let raw = {
                "id": base_info.id, // 渠道ID
                "host": base_info.host, // 跳转地址---跳转到对应渠道去搜索漫画
                "title": SupplierData.get_channel_text(base_info.id), // 渠道中文名
            }
            data.push(raw)
        }
        return data
    }
}