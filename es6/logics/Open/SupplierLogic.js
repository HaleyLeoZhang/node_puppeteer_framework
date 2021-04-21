import Base from './Base'
import Log from '../../tools/Log'
import SupplierData from "../../models/CurlAvatar/Supplier/SupplierData";

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

    static async delete_by_comic_id(ctx, comic_id) {
        // TODO 查询涉及的有效渠道ID
        // TODO 依据有效渠道ID 查询有效章节ID
        // TODO 依据 查询有效章节ID 查询有效图片数据
        // TODO 每次软删除指定数量图片-因为数据量较大
        // TODO 直接软删除指定数量章节
        // TODO 直接软删除指定数量渠道
        // let list = await SupplierData.delete_by_related_id(comic_id)
        // list = Base.handle_datetime(list, 'created_at,updated_at')
        // list = SupplierLogic.list_add_parse_fields(list)
        return
    }
}