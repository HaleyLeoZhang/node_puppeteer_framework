// ----------------------------------------------------------------------
// 通过消息队列的方式去逐步拉取
// 2020年4月11日 23:55:00 暂未启用
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import BaseTask from '../../libs/Base/BaseTask'
import ManHuaNiuLogic, {
    SCENE_CHAPTER_LIST,
    SCENE_IMAGE_LIST,
    TASK_SUCCESS,
    TASK_FAILED,
} from '../../logics/ComicCurl/ManHuaNiuLogic'
import RabbitMQ, { ACK_YES } from '../../libs/MQ/RabbitMQ'
import Log from '../../tools/Log'
import General from '../../tools/General'

// ----------------------------------------------------------------------
//      业务枚举
// ----------------------------------------------------------------------

/**
 * @var string 队列配置
 */
const AMQP_EXCHANGE = 'amq.topic'; // 交换机
const AMQP_ROUTING_KEY = 'comic_manhuaniu_sync'; // 路由规则
const AMQP_QUEUE = 'comic_manhuaniu_sync_queue'; // 队列名
const DELAY_SECNOD = 3; // 无消息时,需要挂起的秒数

// ----------------------------------------------------------------------
//      业务逻辑
// ----------------------------------------------------------------------

export default class ManhuaNiuTask extends BaseTask {
    /**
     * 拉取漫画相关信息
     * - 漫画牛渠道用同一个队列
     */
    static async queue() {
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
        mq.set_exchange(AMQP_EXCHANGE)
        mq.set_routing_key(AMQP_ROUTING_KEY)
        mq.set_queue(AMQP_QUEUE)
        await mq.pull(async (payload) => {
            try {
                await ManhuaNiuTask.delay_rand_ms(100, 300)
                let result = await ManhuaNiuTask.dispatch(payload)
                if (result === TASK_FAILED) {
                    throw new Error("TASK_FAILED");
                }
            } catch (err) {
                const uuid = General.uuid()
                Log.error(uuid, 'ManhuaNiuTask.CONSUME_ERROR: ', err)
                Log.warn(uuid, 'ManhuaNiuTask.payload: ', payload)
                await mq.requeue(payload);
            }
        })
    }

    /**
     * 任务分发
     * @param JSON_Object payload 约定入参
     * @return bool
     */
    static async dispatch(payload) {
        switch (payload.scene) {
            case SCENE_CHAPTER_LIST:
                await ManHuaNiuLogic.get_chapter_list(payload);
                break;
            case SCENE_IMAGE_LIST: // 注: 若全站爬取,这个 image 队列数据量会增加很多,需要单独把队列拿出来
                await ManHuaNiuLogic.get_imaeg_list(payload);
                break;
            default:
                throw new Error("SCENE_ERROR");
        }
        return true
    }

    /**
     * 测试- 推送当前订阅的渠道资源
     */
    static async test_push_one() {
        const mq = new RabbitMQ();
        mq.set_exchange(AMQP_EXCHANGE)
        mq.set_routing_key(AMQP_ROUTING_KEY)
        mq.set_queue(AMQP_QUEUE)
        // 推
        let payload = {
            "id": 5, // 对应场景下-表ID
            "scene": SCENE_CHAPTER_LIST, // 采集动作
            "body": { // 其他参数
                "url": "", // 页面 URL
            },
        };
        await mq.push(payload)
    }

    /**
     * 拉
     */
    static async test_pull() {
        const mq = new RabbitMQ();
        mq.set_exchange(AMQP_EXCHANGE)
        mq.set_routing_key(AMQP_ROUTING_KEY)
        mq.set_queue(AMQP_QUEUE)
        mq.set_delay_second(DELAY_SECNOD)
        // 拉
        await mq.pull(async (payload) => {
            console.log('payload', payload)
            // let payload_1 = {
            //     "id": 4444, // 漫画书架ID 表 comic.id 
            //     "url": "", // 页面 URL
            //     "action": "", // 采集动作
            //     "body": {}, // 其他参数
            // };
            // console.log('do')
            return ACK_YES;
        })
    }

    /**
     * 推
     */
    static async test_push() {
        const mq = new RabbitMQ();
        mq.set_exchange(AMQP_EXCHANGE)
        mq.set_routing_key(AMQP_ROUTING_KEY)
        mq.set_queue(AMQP_QUEUE)

        // 推
        let payload = {
            "id": 0, // 对应场景下-表ID
            "scene": "", // 采集场景
            "body": { // 其他参数
                "url": "", // 页面 URL
            },
        };
        await mq.push(payload)
    }
}