import Base from './Base'
import Log from '../../tools/Log'
import SupplierData from "../../models/CurlAvatar/Supplier/SupplierData";
import {AVAILABLE_CHANNEL_LIST, FIELD_CHANNEL, FIELD_STATUS} from "../../models/CurlAvatar/Supplier/Enum";
import HaoManLiuService from "../../services/Comic/HaoManLiuService";
import BaoZiService from "../../services/Comic/BaoZiService";
import * as Enum from "../../models/CurlAvatar/Supplier/Enum";
import KuManWuService from "../../services/Comic/KuManWuervice";
import General from "../../tools/General";
import TuZhuiService from "../../services/Comic/TuZhuiService";

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
    static async save_supplier_list_by_comic_id(ctx, comic_id, suppliers_raw) {
        let suppliers = []; // 清洗后的入参
        // 如果没有source_id,则认为没有传入
        for (let i = 0, len = suppliers_raw.length; i < len; i++) {
            let http_supplier = suppliers_raw[i]
            if (http_supplier.source_id == "") {
                continue
            }
            http_supplier.weight = General.get_data_with_default(http_supplier.weight, 0)
            suppliers.push(http_supplier)
        }
        if (suppliers.length === 0) {
            // 删除关联渠道
            return SupplierData.delete_suppliers_by_comic_id(comic_id)
        }
        // 读取以前的数据，看看source_id是否变化，如果变化，则需要删除渠道
        let list = await SupplierLogic.list_by_comic_id(ctx, comic_id)
        let to_delete_not_in_supplier_ids = []; // 不在范围内的要删除
        let supplier_id_map_old = []; // 库中的渠道列表 channel => 渠道数据
        let insert_list = []; // 待插入的数据
        // - 初始化
        for (let i = 0, len = list.length; i < len; i++) {
            let one_supplier = list[i]
            supplier_id_map_old[one_supplier.channel] = one_supplier
        }
        // - 判断要删除的
        for (let i = 0, len = suppliers.length; i < len; i++) {
            let curr_supplier = suppliers[i]
            let old_supplier = supplier_id_map_old[curr_supplier.channel]
            // 新建: 没有渠道   或者   资源ID不同,要删除
            if (old_supplier === undefined || old_supplier.source_id !== curr_supplier.source_id) {
                let insert_one = {
                    "related_id": comic_id,
                    "channel": curr_supplier.channel,
                    "source_id": curr_supplier.source_id,
                    "weight": curr_supplier.weight,
                    "ext_1": curr_supplier["ext_1"],
                    "ext_2": curr_supplier["ext_2"],
                    "ext_3": curr_supplier["ext_3"],
                    "status": FIELD_STATUS.ONLINE,
                }
                insert_list.push(insert_one)
            } else {
                // 更新信息
                await SupplierData.update_supplier_by_id(old_supplier.id, {
                    "weight": curr_supplier.weight,
                    "ext_1": curr_supplier.ext_1,
                    "ext_2": curr_supplier.ext_2,
                    "ext_3": curr_supplier.ext_3,
                })
                // 记录不要删除这个数据
                to_delete_not_in_supplier_ids.push(old_supplier.id)
            }
        }
        // 删除没有用到的
        await SupplierData.delete_not_in_suppliers_by_comic_id(comic_id, to_delete_not_in_supplier_ids)
        // 批量新建
        if (insert_list.length > 0) {
            await SupplierData.do_insert(insert_list)
        }
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
            {
                "id": FIELD_CHANNEL.TU_ZHUI, // 有效渠道ID
                "host": TuZhuiService.get_base_href(),
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