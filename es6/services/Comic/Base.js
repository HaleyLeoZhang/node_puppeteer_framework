import BaseService from '../../libs/Base/BaseService'
import {PROXY_DSN} from "../../conf";
// const HttpProxyAgent = require('http-proxy-agent');
import { getProxyHttpAgent } from 'proxy-http-agent';

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
}

export default Base