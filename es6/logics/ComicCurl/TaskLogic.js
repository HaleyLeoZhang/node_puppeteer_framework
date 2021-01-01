import Base from './Base'
import Log from '../../tools/Log'

import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import CONST_AMQP from "../../constant/amqp";
import RabbitMQ from "../../libs/MQ/RabbitMQ";
import SupplierData from "../../models/CurlAvatar/Supplier/SupplierData";
import ComicData from "../../models/CurlAvatar/Comic/ComicData";

export default class TaskLogic extends Base {
    static async comic_base(ctx, payload) {
        let comic_id = payload.id
        let event = payload.event
        const one_comic = await ComicData.get_comic_by_id(comic_id)
        if (!one_comic) {
            Log.ctxWarn(ctx, 'ID不存在')
            return
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
                Log.ctxInfo(ctx,`notify ${listLen} supplier success`)
                break;
            case CONST_BUSINESS_COMIC.EVENT_UNSUBSCRIBE:
                await SupplierData.offline_all_supplier_by_related_id(comic_id)
                break;
            default:
                Log.ctxWarn(ctx, 'event 异常')
        }

        return CONST_BUSINESS_COMIC.TASK_SUCCESS
    }


}