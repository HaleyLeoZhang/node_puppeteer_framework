// ----------------------------------------------------------------------
// 公共基础配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import * as yaml from "js-yaml";

const APP_PATH = __dirname + '/../../'

import fs from "fs";
import Log from "../tools/Log";


// const DEFAULT_CONFIG_PATH = '/app/app.yaml' // 配置文件默认位置

// 初始化配置
let BROWSER = {}, // 浏览器配置
    LOG_CONFIG = {}, // 日志配置
    SENTRY_DSN = "", // Sentry 异常采集 - 更多请访问 https://sentry.io/
    QINIU_COMIC = { // 七牛云图片配置
        // "access_key": "",
        // "secret_key": "",
        // "bucket_name": "",
        // "cdn_host": "",
    },
    HTTP_PORT = 4040, // HTTP 服务端口
    PROXY_DSN = "", // 代理服务器配置
    RABBIT_MQ = {}, // RabbitMQ 配置
    DB_COMIC = {}, // Mysql数据库配置
    REDIS_COMIC = { // 缓存配置
        // host: '192.168.56.110',
        // port: 6379,
        // password: '',
        // db: 0,
    }

export default class Conf {
    // 注入参数
    static ini_doc(doc) {
        BROWSER = {
            executablePath: doc.puppeteer_comic.executable_path,
            timeout: doc.puppeteer_comic.timeout,
            ignoreHTTPSErrors: doc.puppeteer_comic.ignore_https_errors,
            devtools: doc.puppeteer_comic.devtools,
            headless: doc.puppeteer_comic.headless
        }
        SENTRY_DSN = doc.sentry_dsn
        LOG_CONFIG = {
            debug: doc.log.debug,
            path: doc.log.path,
        }
        HTTP_PORT = doc.http_port
        PROXY_DSN = doc.proxy_dsn
        RABBIT_MQ = {
            host: doc.rabbit_mq.host,
            port: doc.rabbit_mq.port,
            user: doc.rabbit_mq.user,
            password: doc.rabbit_mq.password,
            vhost: doc.rabbit_mq.vhost,
        }
        DB_COMIC = {
            read: doc.db_comic.read,
            write: doc.db_comic.write,
        }
        REDIS_COMIC = {
            host: doc.db_comic.host,
            port: doc.db_comic.port,
            password: doc.db_comic.password,
            db: doc.db_comic.db,
        }
    }

    // 读取配置
    static load_config(ars) {
        // let config_path = DEFAULT_CONFIG_PATH
        let config_path = ""
        for (let i = 0, len_ars = ars.length; i < len_ars; i++) {
            let one = ars[i]
            let res_config = one.match(/--conf=(.*)/i)
            if (res_config !== null) {
                config_path = res_config[1].trim(" ")
            }
        }
        const doc = yaml.load(fs.readFileSync(config_path, 'utf8'));
        // console.log(doc); // 配置文件日常这里
        Conf.ini_doc(doc)
        // ini log
        Log.IniConfig(LOG_CONFIG.debug, LOG_CONFIG.path)
    }
}


export {
    APP_PATH,
    BROWSER,
    SENTRY_DSN,
    QINIU_COMIC,
    HTTP_PORT,
    PROXY_DSN,
    RABBIT_MQ,
    DB_COMIC,
    REDIS_COMIC,
};


// /**
//  * 截图配置
//  */
// let SCREENSHOT = {
//     path: APP_PATH + 'storage/img/' + General.uuid() + '.png',
//     type: 'png',
//     quality: 100, // 只对jpg有效
//     fullPage: true,
//     // 指定区域截图，clip和fullPage两者只能设置一个
//     // clip: {
//     //   x: 0,
//     //   y: 0,
//     //   width: 1000,
//     //   height: 40
//     // }
//     args: [
//         '–-disable-gpu',
//         '–-disable-dev-shm-usage',
//         '–-disable-setuid-sandbox',
//         '–-no-first-run',
//         '–-no-sandbox',
//         '–-no-zygote',
//         '–-single-process'
//     ],
// }
