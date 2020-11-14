// ----------------------------------------------------------------------
// 通过消息队列的方式去逐步拉取
// 2020年4月11日 23:55:00 暂未启用
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import BaseTask from '../../libs/Base/BaseTask'
import RabbitMQ, { ACK_YES } from '../../libs/MQ/RabbitMQ'
import CONST_BUSINESS from "../../constant/business";
import CONST_AMQP from "../../constant/amqp";

// ----------------------------------------------------------------------
//      业务逻辑-测试
// ----------------------------------------------------------------------

export default class ManhuaNiuTaskTest extends BaseTask {

    // ----------------------------------------------------------------------
    // 调用示例
    // node ./es5/task.js mhn_test push_one
    // ----------------------------------------------------------------------

    /**
     * 测试- 推送当前订阅的渠道资源
     */
    static async push_one() {
        const mq = new RabbitMQ();
        mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
        mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_MANHUANIU)
        mq.set_queue(CONST_AMQP.AMQP_QUEUE_MANHUANIU)

        // 推
        let payload = {
            "id": 5, // 对应场景下-表ID
            "scene": CONST_BUSINESS.SCENE_CHAPTER_LIST, // 采集动作
            "body": { // 其他参数
                "url": "", // 页面 URL
            },
        };
        await mq.push(payload)
    }

}