// ----------------------------------------------------------------------
// 通过消息队列的方式去逐步拉取
// 2020年4月11日 23:55:00 暂未启用
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ManHuaNiuLogic from '../../logics/ComicCurl/ManHuaNiuLogic'
import RabbitMQ from '../../libs/MQ/RabbitMQ'
import Log from '../../tools/Log'

// ----------------------------------------------------------------------
//      业务枚举
// ----------------------------------------------------------------------

/**
 * @var string 采集的动作类型
 */
const ACTION_CHAPTER_LIST = 'chapter_list'; // 章节列表
const ACTION_IMAGE_LIST = 'image_list'; // 漫画图片
/**
 * @var bool 是否返回ACK
 */
const ACK_YES = true; // 返回 ACK
const ACK_NO = false; // 不返回 ACK

// ----------------------------------------------------------------------
//      业务逻辑
// ----------------------------------------------------------------------

export default class ManhuaNiuTask {
    /**
     * 拉取漫画相关信息
     * - 漫画牛渠道用同一个队列
     */
    static async queue() {
        // // 漫画场景约定格式
        // let payload = {
        //     "id": 0, // 漫画书架ID 表 comic.id 
        //     "url": "", // 页面 URL
        //     "action": "", // 采集动作
        //     "body":{}, // 其他参数
        // };
        const mq = new RabbitMQ();
        mq.set_exchange("/")
        mq.set_routing_key("comic_manhuaniu_sync")
        mq.set_queue("comic_manhuaniu_sync_queue")
        mq.pull(async (payload, channel) => {
            if(ACK_YES === await this.dispatch(payload)){
                channel.ack(msg); // 发送确认的ACK
            }
        })
    }
    /**
     * 任务分发
     * @param JSON_Object payload 约定入参
     * @return bool
     */
    static async dispatch(payload) {
        let ack_flag = ACK_YES;
        switch (payload.action) {
            case ACTION_CHAPTER_LIST:
                ack_flag = await ManHuaNiuLogic.getChapterList(payload);
                break;
            case ACTION_IMAGE_LIST:
                ack_flag = await ManHuaNiuLogic.getImageList(payload);
                break;
            default:
                Log.error('ACTION_ERROR: ', JSON.stringify(payload))
        }
        return ack_flag
    }

    /**
     * 拉取漫画相关信息
     * - 漫画牛渠道用同一个队列
     */
    static async test() {
        // // 漫画场景约定格式
        let payload = {
            "id": 0, // 漫画书架ID 表 comic.id 
            "url": "", // 页面 URL
            "action": "", // 采集动作
            "body":{}, // 其他参数
        };
        const mq = new RabbitMQ();
        mq.set_exchange("/")
        mq.set_routing_key("comic_manhuaniu_sync")
        mq.set_queue("comic_manhuaniu_sync_queue")
        mq.push(payload)
    }
}