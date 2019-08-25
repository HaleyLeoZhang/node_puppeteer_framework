// ----------------------------------------------------------------------
// 基于 redis 封装 缓存服务
// ----------------------------------------------------------------------
// redis 文档地址 https://www.npmjs.com/package/redis 
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import redis from 'redis'
import { DSN_COMIC } from '../../conf/db/redis'

const CACHE_PREFIX = 'puppeteer'


class Helper {
    static get_real_key(name, key) {
        const real_key = [CACHE_PREFIX, name, key].join(':')
        return real_key
    }
}

export default class BaseCache {
    static get_redis() {
        client = redis.createClient(DSN_COMIC);

        // if you'd like to select database 3, instead of 0 (default), call
        // client.select(3, function() { /* ... */ });

        client.on("error", function (err) {
            throw err
        });

        // client.set("string key", "string val", redis.print);
        // client.hset("hash key", "hashtest 1", "some value", redis.print);
        // client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
        // client.hkeys("hash key", function (err, replies) {
        //     console.log(replies.length + " replies:");
        //     replies.forEach(function (reply, i) {
        //         console.log("    " + i + ": " + reply);
        //     });
        //     client.quit();
        // });
        return client
    }
    // 缓存名称
    static get_name() {
        throw new Error("请重写 get_name 方法，返回 {缓存名}")
    }
    // 缓存秒数
    static get_ttl() {
        throw new Error("请重写 get_ttl 方法，返回秒数")
    }
    // 缓存类型
    static get_type() {
        throw new Error("请重写 get_type 方法，返回数据类型： string、object")
    }
    // 缓存数据
    static async set_data(key, data) {
        const redis_client = this.get_redis()

        const ttl = this.get_ttl()
        const name = this.get_name()
        const data_type = this.get_type()
        const real_key = Helper.get_real_key(name, key)

        let data_str = null
        switch(data_type) {
        case 'string':
            data_str = data
            break;
        case 'object':
            data_str = JSON.stringify(data)
            break;
        }
        await redis_client.setex(real_key, data_str, redis.print);
    }
    // 获取数据
    static async get_data(key) {
        const redis_client = this.get_redis()

        const name = this.get_name()
        const data_type = this.get_type()
        const real_key = Helper.get_real_key(name, key)

        const data_str = await redis_client.get(real_key)

        let data = null
        switch(data_type) {
        case 'string':
            data = data_str
            break;
        case 'object':
            data = JSON.parse(data_str)
            break;
        }
        return data
    }

}