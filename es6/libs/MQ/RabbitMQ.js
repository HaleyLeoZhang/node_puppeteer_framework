// ----------------------------------------------------------------------
// RabbitMQ 驱动
// ----------------------------------------------------------------------
// 运维组件-安装文档 https://blog.csdn.net/nextyu/article/details/79250174
// Node包-官方文档地址 https://github.com/squaremo/amqp.node
// Node包 对应API http://www.squaremobius.net/amqp.node/channel_api.html
// 源自掘金用法 https://juejin.im/post/5dd8cd7ae51d4523501f7331
// RabbitMQ官网解释使用 https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import amqp from 'amqplib'
import { DSN_AMQP } from '../../conf/mq/amqp'
import Log from '../../tools/Log'

const Buffer = require('safe-buffer').Buffer;
const DEFAULT_OPTION = { durable: true, autoDelete: false };
const DEFAULT_CONSUME_OPTION = { noAck: false };
const DEFAULT_DELAY_SECOND = 3; // 未拉取到消息时,默认挂起秒数
const FLAT_NO_MESSAGE = false; // 没有消息的时候,返回值是false
/**
 * @var bool 是否返回ACK
 */
const ACK_YES = true; // 返回 ACK
const ACK_NO = false; // 不返回 ACK

export default class RabbitMQ {
    /**
     * 设置交换机
     *
     * @param string exchange 交换机名
     * @return void
     */
    set_exchange(exchange) {
        this.exchange = exchange
    }
    /**
     * 设置路由名
     *
     * @param string routing_key 路由绑定规则名
     * @return void
     */
    set_routing_key(routing_key) {
        this.routing_key = routing_key
    }
    /**
     * 设置队列名
     *
     * @param string queue 队列名
     * @return void
     */
    set_queue(queue) {
        this.queue = queue
    }
    /**
     * 设置挂起秒数
     *
     * @param int delay_second 延迟秒数
     * @return void
     */
    set_delay_second(delay_second) {
        this.delay_second = delay_second
    }
    /**
     * 获取挂起秒数
     *
     * @return void
     */
    get_delay_second() {
        return this.delay_second || DEFAULT_DELAY_SECOND
    }
    /**
     * 获取连接
     *
     * @param string queue 队列名
     * @return void
     */
    get_conn() {
        const Dial = `amqp://${DSN_AMQP.user}:${DSN_AMQP.password}@${DSN_AMQP.host}:${DSN_AMQP.port}${DSN_AMQP.vhost}`
        return amqp.connect(Dial)
    }
    /**
     * 单例获取连接信息,但每次新建通道
     *
     * @param string queue 队列名
     * @return void
     */
    async prepare() {
        if (!this.conn) {
            // 创建链接对象
            this.conn = await this.get_conn()
        }
        // 获取通道
        // - 信道本身的流量很大时,这时候多个信道复用一个 Connection 就会产生性能瓶颈，进而使整体的流量被限制了
        // - 就目前来看,一个连接上,不会有太大数据量
        const channel = await this.conn.createChannel();
        // - 声明(初始化)队列
        await channel.assertQueue(this.queue, DEFAULT_OPTION)
        // - 声明(初始化)队列与交换机的路由关系
        await channel.bindQueue(this.queue, this.exchange, this.routing_key, null)
        return { "conn": this.conn, channel }
    }
    /**
     * 消费者一条条消费
     *
     * @param callable callback 消费者回调函数
     * @return void
     */
    async pull(callback) {
        const { conn, channel } = await this.prepare()

        for (;;) {
            await new Promise(resolve => {
                channel.get(this.queue, DEFAULT_CONSUME_OPTION)
                    .then(msg => {
                        if (FLAT_NO_MESSAGE === msg) {
                            // 没有消息就挂起
                            setTimeout(() => {
                                resolve()
                            }, this.get_delay_second() * 1000);
                        } else {
                            let payload = msg.content.toString()
                            callback(JSON.parse(payload))
                                .then((ack_yes) => {
                                    if (ACK_YES === ack_yes) {
                                        channel.ack(msg);
                                    } else {
                                        channel.nack(msg);
                                    }
                                    resolve()
                                })
                        }
                    });

            });
        }
        await channel.close();
        await conn.close();
    }
    /**
     * 消费者批量拉所有消息下来,并发消费
     * - 适用于生产与消费速度差不多的场景
     * - 注: 当前场景-暂不使用
     *
     * @param callable callback 消费者回调函数
     * @return void
     */
    async pull_batch(callback) {
        const { conn, channel } = await this.prepare()
        await new Promise((resolve) => { // 挂起消费
            channel.consume(this.queue, async (msg) => {
                if (FLAT_NO_MESSAGE === msg) {
                    resolve(true)
                }
                let payload = msg.content.toString()
                await callback(JSON.parse(payload))
                    .then((ack_yes) => {
                        if (ACK_YES === ack_yes) {
                            channel.ack(msg);
                        } else {
                            channel.nack(msg);
                        }
                    })
            }, DEFAULT_CONSUME_OPTION)
        })
        await channel.close();
        await conn.close();
        // console.log('关闭')
    }
    /**
     * 在消费者内 给当前队列 入队消息
     *
     * @param JSON_Object payload 消息内容
     * @return void
     */
    async append(payload) {
        const { conn, channel } = await this.prepare()
        // 发送消息到交换机
        await channel.publish(this.exchange, this.routing_key, Buffer.from(JSON.stringify(payload)))
        await channel.close();
    }
    /**
     * 生产者
     *
     * @param JSON_Object payload 消息内容
     * @return void
     */
    async push(payload) {
        const { conn, channel } = await this.prepare()
        // 发送消息到交换机
        await channel.publish(this.exchange, this.routing_key, Buffer.from(JSON.stringify(payload)))
        await channel.close();
        await conn.close();
    }
}
export { ACK_YES, ACK_NO }