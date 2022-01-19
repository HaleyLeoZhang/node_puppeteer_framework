// ----------------------------------------------------------------------
// 业务常量配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const CONST_BUSINESS_COMIC = {
    // 事件
    "EVENT_SUBSCRIBE": "sub", // 拉取订阅
    "EVENT_UNSUBSCRIBE": "unsub", // 取消订阅
    // 任务状态
    "TASK_SUCCESS": true, // 任务成功
    "TASK_FAILED": false, // 任务失败
    // 场景
    "SCENE_CHAPTER_LIST": "chapter_list", // 处理以获取 - 章节列表
    "SCENE_IMAGE_LIST": "image_list", // 处理以获取 - 漫画图片列表
    // 没有消息时，挂起秒数
    "MQ_CONSUMER_BLOCK_SECOND": 3,
    // 超时时间
    "HTTP_FETCH_TIMEOUT": 3 * 1000, // 3秒
}

export default CONST_BUSINESS_COMIC