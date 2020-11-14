// ----------------------------------------------------------------------
// RabbitMQ常量配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const CONST_AMQP = {
    "AMQP_EXCHANGE_TOPIC": "amq.topic", // 订阅方式的交换机
    // 渠道专属 - 漫画牛
    "AMQP_ROUTING_KEY_MANHUANIU": "comic_manhuaniu_sync",
    "AMQP_QUEUE_MANHUANIU": "comic_manhuaniu_sync_queue",
}

export default CONST_AMQP