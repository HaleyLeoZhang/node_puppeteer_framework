// ----------------------------------------------------------------------
// 基于 redis 封装 缓存服务
// ----------------------------------------------------------------------
// redis 文档地址 https://www.npmjs.com/package/redis 
// ----------------------------------------------------------------------
// 操作示例 https://blog.csdn.net/helencoder/article/details/51784654
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import redis from 'redis'


class Helper {
    static get_real_key(name, key) {
        const real_key = [name, key].join(':')
        return real_key
    }

    static set_data_sync(redis_client, real_key, data_str, is_EX, ttl, type) {

        return new Promise((resolve) => {
            const _callback = (err, res) => {
                if ('OK' == res) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
            if (!is_EX) {
                redis_client.set(real_key, data_str, _callback)
            } else if (!type) {
                redis_client.set(real_key, data_str, 'EX', ttl, _callback)
            } else {
                redis_client.set(real_key, data_str, 'EX', ttl, type, _callback)
            }
        })
    }
}

export default class BaseCache {
    static async get_redis() {
        // 单例获取
        if (!this.instance) {
            const client = redis.createClient(REDIS_COMIC);
            await new Promise((resolve) => {
                client.on('connect', () => {
                    resolve(true)
                });
            })
            this.instance = client;
        }
        return this.instance;

        // client.set("string_key", "string_val", redis.print);
        // client.hset("hash key", "hashtest 1", "some value", redis.print);
        // client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
        // client.hkeys("hash key", function (err, replies) {
        //     console.log(replies.length + " replies:");
        //     replies.forEach(function (reply, i) {
        //         console.log("    " + i + ": " + reply);
        //     });
        //     client.quit();
        // });
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
    static async set_data(key, data, is_lock) {
        is_lock = undefined === is_lock ? false : true
        const redis_client = await this.get_redis()

        const ttl = this.get_ttl()
        const name = this.get_name()
        const data_type = this.get_type()
        const real_key = Helper.get_real_key(name, key)

        let data_str = null
        switch (data_type) {
            case 'string':
                data_str = data
                break;
            case 'object':
                data_str = JSON.stringify(data)
                break;
        }

        let res = false
        if (is_lock) {
            res = await Helper.set_data_sync(redis_client, real_key, data_str, 'EX', ttl, 'NX')
        } else {
            res = await Helper.set_data_sync(redis_client, real_key, data_str, 'EX', ttl)
        }
        return res
    }

    static async get_data(key) {
        const redis_client = await this.get_redis()

        const name = this.get_name()
        const data_type = this.get_type()
        const real_key = Helper.get_real_key(name, key)

        return new Promise((resolve) => {
            redis_client.get(real_key, (err, data_str) => {
                let data = null
                switch (data_type) {
                    case 'string':
                        data = data_str
                        break;
                    case 'object':
                        data = JSON.parse(data_str)
                        break;
                }
                resolve(data)
            });
        });
    }

    static async delete_data(key) {
        const redis_client = await this.get_redis()

        const ttl = -1
        const name = this.get_name()
        const data_type = this.get_type()
        const real_key = Helper.get_real_key(name, key)

        // Log.log(name, key, real_key)
        const res = redis_client.expire(real_key, ttl);
        return res
    }

    // 获取数据

}