// ----------------------------------------------------------------------
// RabbitMQ常量配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const CONST_AMQP = {
    "AMQP_EXCHANGE_TOPIC": "amq.topic", // 发布订阅方式的交换机
    // - 漫画基础信息
    "AMQP_ROUTING_KEY_COMIC_BASE": "spider.comic.base",
    "AMQP_QUEUE_COMIC_BASE": "spider_comic_base",
    // - 渠道基础信息
    "AMQP_ROUTING_KEY_SUPPLIER_BASE": "spider.supplier.base",
    "AMQP_QUEUE_SUPPLIER_BASE": "spider_supplier_base",
}

export default CONST_AMQP