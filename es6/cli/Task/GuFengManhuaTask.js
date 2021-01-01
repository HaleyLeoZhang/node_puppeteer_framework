// ----------------------------------------------------------------------
// 通过消息队列的方式去逐步拉取
// 2020年4月11日 23:55:00 暂未启用
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import BaseTask from '../../libs/Base/BaseTask'
import RabbitMQ, {ACK_YES} from '../../libs/MQ/RabbitMQ'
import Log from '../../tools/Log'
import TimeTool from "../../tools/TimeTool";
import ContextTool from "../../tools/ContextTool";
import {ACK_NO} from "../../../es5/libs/MQ/RabbitMQ";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import CONST_AMQP from "../../constant/amqp";
import ManHuaNiuLogic from "../../logics/ComicCurl/ManHuaNiuLogic";

// ----------------------------------------------------------------------
//      业务逻辑
// ----------------------------------------------------------------------

export default class GuFengManhuaTask extends BaseTask {

    // ----------------------------------------------------------------------
    // 调用示例
    // node ./es5/task.js mhn consumer
    // ----------------------------------------------------------------------

    /**
     * 消费队列信息
     * - 目前拉取的消息量不多，章节、列表信息可以都用同一个
     */
    static async consumer() {
        let _this = this
        // 漫画场景约定格式
        // let payload = {
        //     "id": 0, // 对应场景下-表ID
        //     "scene": "", // 采集场景
        //     "body": { // 其他参数
        //         "url": "", // 页面 URL
        //     },
        // };
        const mq = new RabbitMQ();
        mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
        mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_GUFENG)
        mq.set_queue(CONST_AMQP.AMQP_QUEUE_GUFENG)
        mq.set_delay_second(3)
        await mq.pull(async (payload) => {
            let ctx = ContextTool.initial() // 每次拉取都是一个新的上下文
            try {
                Log.ctxInfo(ctx, 'GuFengManhuaTask.start')
                // await TimeTool.delay_rand_ms(100, 300)
                let result = await GuFengManhuaTask.dispatch(ctx, payload)
                if (result === CONST_BUSINESS_COMIC.TASK_FAILED) {
                    throw new Error("TASK_FAILED");
                }
                Log.ctxInfo(ctx, 'GuFengManhuaTask.success  ' + JSON.stringify(payload))
                return ACK_YES
            } catch (err) {
                Log.ctxInfo(ctx, 'GuFengManhuaTask.payload  ' + JSON.stringify(payload))
                Log.ctxError(ctx, 'GuFengManhuaTask.CONSUMER_ERROR  ' + err.stack)
            }
            return ACK_NO
        })
    }

    /**
     * 任务分发
     * @param ContextTool ctx 上下文信息
     * @param JSON_Object payload 约定入参
     * @return bool
     */
    static async dispatch(ctx, payload) {
        switch (payload.scene) {
            case CONST_BUSINESS_COMIC.SCENE_CHAPTER_LIST:
                await ManHuaNiuLogic.get_chapter_list(ctx, payload);
                break;
            case CONST_BUSINESS_COMIC.SCENE_IMAGE_LIST: // 注: 若全站爬取,这个 image 队列数据量会增加很多,需要单独把队列拿出来
                await ManHuaNiuLogic.get_imaeg_list(ctx, payload);
                break;
            default:
                throw new Error("SCENE_ERROR");
        }
        return CONST_BUSINESS_COMIC.TASK_SUCCESS
    }

}