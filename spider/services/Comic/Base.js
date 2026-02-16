import BaseService from '../../libs/Base/BaseService'
import {PROXY_DSN} from "../../conf";
// const HttpProxyAgent = require('http-proxy-agent');
import {getProxyHttpAgent} from 'proxy-http-agent';

class Base extends BaseService {
    // http请求增加代理---前提配置了代理
    static getProxyOption(options) {
        if (undefined !== PROXY_DSN && PROXY_DSN.length > 0) {
            options["agent"] = new getProxyHttpAgent({ // https://stackoverflow.com/questions/60061143/using-rejectunauthorized-with-node-fetch-in-node-js
                proxy: PROXY_DSN,
                rejectUnauthorized: false, // 忽略https证书异常，对于爬虫来说无所谓，如果是敏感业务需要谨慎使用该选项
            });
            options["redirect"] = 'follow'
        }
        return options
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        throw new Error("获取漫画基本信息  需实现方法 get_base_info ");
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id) {
        throw new Error("获取漫画章节列表  需实现方法 get_chapter_list ");
    }

    /**
     * @return string
     */
    static getLink(path) {
        throw new Error("获取漫画官网页面地址  需实现方法 getLink ");
    }

    /**
     * @return Promise
     */
    static async get_image_list(ctx, target_url) {
        throw new Error("获取漫画官图片列表  需实现方法 get_image_list ");
    }
}

export default Base