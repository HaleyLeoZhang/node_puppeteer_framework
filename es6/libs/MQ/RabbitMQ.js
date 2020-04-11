// ----------------------------------------------------------------------
// RabbitMQ 驱动
// ----------------------------------------------------------------------
// 文档地址 https://github.com/squaremo/amqp.node
// RabbitMQ对应node文档地址 https://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import amqp from 'amqplib'
import { DSN_AMQP } from '../../conf/mq/amqp'
import Log from '../../tools/Log'

const Buffer = require('safe-buffer').Buffer;
const DEFAULT_OPTION = {durable: true, autoDelete:false};

export default class RabbitMQ {
    get_conn() {
        // amqp://user:pass@localhost:1000/vhost
        const Dial = `amqp://${DSN_AMQP.user}:${DSN_AMQP.password}@${DSN_AMQP.host}:${DSN_AMQP.port}${DSN_AMQP.vhost}`
        console.log('Dial ', Dial)
        return amqp.connect(Dial)
    }
    // 设置交换机 exchange
    set_exchange(exchange) {
        this.exchange = exchange
    }
    // 设置路由名 routingKey
    set_routing_key(routing_key) {
        this.routing_key = routing_key
    }
    // 设置队列名 queue
    set_queue(queue) {
        this.queue = queue
    }
    // 消费者
    async pull(callback) {
        //
    }
    // 生产者
    async push(payload) {
        // Publisher
        this.get_conn().then(function(conn) {
            console.log('22')
            console.log(conn)
            return conn.createChannel();
        }).then(function(ch) {
            console.log('44')
            return ch.assertQueue(this.queue, DEFAULT_OPTION).then(function(ok) {
                return ch.sendToQueue(this.queue, Buffer.from('something to do'));
            });
        }).catch(console.warn);
        // 1.创建链接对象
        const connection = this.get_conn()

        console.log(connection)
        console.log('55')
        // 2. 获取通道
        const channel = await connection.createChannel();
        console.log('66')
        // - 声明(初始化)队列
        await channel.assertQueue(this.queue, DEFAULT_OPTION)
        // - 声明(初始化)队列与交换机的路由关系
        await channel.bindQueue(this.queue, this.exchange, this.routing_key, null);

        console.log('77')

        // 3. 声明参数
        const msg = 'hello koala';

        for (let i = 0; i < 10000; i++) {
            // 4. 发送消息
            let str = `${msg} 第${i}条消息`;
            await channel.publish(this.exchange, this.routing_key, Buffer.from(str)); // 发送到交换机
            console.log(str)
        }

        // 5. 关闭通道
        await channel.close();
        // 6. 关闭连接
        await connect.close();

        // amqp.connect(this.get_dial(), (err, conn) => {
        // console.log("222");
        //     conn.createChannel((err, ch) => {
        //         let msg = 'Hello World!';

        //         channel.assertQueue(this.queue, { durable: true, autoDelete: false });
        //         channel.sendToQueue(this.queue, new Buffer(msg)); //   发送消息
        //         console.log("Send message:", msg);
        //     });
        //     setTimeout(function() { conn.close();
        //         process.exit(0) }, 500);
        // });
    }
}