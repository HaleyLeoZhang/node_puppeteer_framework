import Base from './Base'
import Log from '../../tools/Log'

import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import CONST_AMQP from "../../constant/amqp";
import RabbitMQ from "../../libs/MQ/RabbitMQ";
import SupplierData from "../../models/CurlAvatar/Supplier/SupplierData";
import ComicData from "../../models/CurlAvatar/Comic/ComicData";
import {FIELD_CHANNEL} from "../../models/CurlAvatar/Supplier/Enum";
import GuFengService from "../../services/Comic/GuFengService";
import {FIELD_METHOD} from "../../models/CurlAvatar/Comic/Enum";

export default class TaskLogic extends Base {
    static async comic_base(ctx, payload) {
        let comic_id = payload.id
        let event = payload.event
        const one_comic = await ComicData.get_comic_by_id(comic_id)
        if (!one_comic) {
            Log.ctxWarn(ctx, 'ID不存在')
            return CONST_BUSINESS_COMIC.TASK_SUCCESS
        }
        // 判断事件
        switch (event) {
            case CONST_BUSINESS_COMIC.EVENT_SUBSCRIBE:
                const supplierList = await SupplierData.get_list_by_related_id(comic_id);
                let listLen = supplierList.length
                if (listLen === 0) {
                    Log.ctxInfo(ctx, '暂无渠道')
                    break;
                }
                const mq = new RabbitMQ();
                mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
                mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_SUPPLIER_BASE)
                mq.set_queue(CONST_AMQP.AMQP_QUEUE_SUPPLIER_BASE)
                let payloads = [];
                for (let i = 0; i < listLen; i++) {
                    let tmp = supplierList[i]
                    payloads.push({
                        "id": parseInt(tmp.id),
                    })
                }
                mq.push_multi(payloads)
                Log.ctxInfo(ctx, `notify ${listLen} supplier success`)
                break;
            case CONST_BUSINESS_COMIC.EVENT_UNSUBSCRIBE:
                await SupplierData.offline_all_supplier_by_related_id(comic_id)
                break;
            default:
                Log.ctxWarn(ctx, 'event 异常')
        }

        return CONST_BUSINESS_COMIC.TASK_SUCCESS
    }

    static async base_supplier_consumer(ctx, payload) {
        let supplier_id = payload.id
        const one_supplier = await SupplierData.get_pne_by_id(supplier_id)
        if (!one_supplier) {
            Log.ctxWarn(ctx, 'supplier_id 不存在')
            return
        }
        // 获取渠道基本信息
        let update_supplier = {}
        let supplier_name, supplier_pic, supplier_intro = '';
        switch (one_supplier.channel) {
            case FIELD_CHANNEL.GU_FENG:
                // 处理渠道信息
                let spider_info = await GuFengService.get_base_info(ctx, one_supplier.source_id)
                supplier_name = spider_info.name
                supplier_pic = spider_info.pic
                supplier_intro = spider_info.intro
                break;
            case FIELD_CHANNEL.QI_MAN_WU:
                // TODO
                break;
            default:
                Log.ctxWarn(ctx, 'event 异常')
                return CONST_BUSINESS_COMIC.TASK_SUCCESS
        }
        // - 更新渠道基本信息
        if (supplier_name != one_supplier.name || supplier_pic != one_supplier.pic || supplier_intro != one_supplier.intro) {
            update_supplier.name = supplier_name
            update_supplier.intro = supplier_intro
            update_supplier.pic = supplier_pic
            await SupplierData.update_supplier_by_id(supplier_id, update_supplier)
        }
        // 判断是否需要自动更新漫画信息
        if (one_supplier.related_id > 0) {
            let comic_id = one_supplier.related_id
            const one_comic = await ComicData.get_comic_by_id(comic_id)
            if (!one_comic) {
                Log.ctxWarn(ctx, 'comic_id 不存在')
                return CONST_BUSINESS_COMIC.TASK_SUCCESS
            }
            // - 没有漫画名的时候，会被认定为第一次操作，可以拷贝数据过去
            if (one_comic.method == FIELD_METHOD.AUTO && one_comic.related_id == one_supplier.id && one_comic.name == '') {
                // 拷贝需要更新的信息过去
                let update = {
                    'name': one_supplier.name,
                    'pic': one_supplier.pic,
                    'intro': one_supplier.intro,
                }
                await ComicData.update_comic_by_id(comic_id, update)
            }
        }
        return CONST_BUSINESS_COMIC.TASK_SUCCESS
    }


}