// ----------------------------------------------------------------------
// RabbitMQ 驱动
// ----------------------------------------------------------------------
// 文档地址 https://github.com/squaremo/amqp.node
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import amqp from 'amqplib'
import { DSN_AMQP } from '../../conf/mq/amqp'
import Log from '../../tools/Log'

export default class RabbitMQ {
    get_conn() {
        const Dial = `amqp://${DSN_AMQP.user}:${DSN_AMQP.password}@${DSN_AMQP.host}:${DSN_AMQP.port}${DSN_AMQP.vhost}`
        return amqp.connect(Dial)
    }
    // 设置交换机 exchange
    set_exchange(exchange) {
        this.exchange = exchange
    }
    // 设置路由名 routingkey
    set_routing_key(routing_key) {
        this.routing_key = routing_key
    }
    // 设置队列名 queue
    set_queue(queue) {
        this.queue = queue
    }
    // 消费者
    async pull(callback) {}
    // 生产者
    async push(payload) {
        // Publisher
        console.log('11')
        this.get_conn().then(function(conn) {
            console.log('22')
            console.log(conn)
            return conn.createChannel();
        }).then(function(ch) {
            return ch.assertQueue(q).then(function(ok) {
                return ch.sendToQueue(q, Buffer.from('something to do'));
            });
        }).catch(console.warn);


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