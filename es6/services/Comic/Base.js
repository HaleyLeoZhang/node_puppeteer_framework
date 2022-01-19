import BaseService from '../../libs/Base/BaseService'
import {PROXY_DSN} from "../../conf";
const HttpProxyAgent = require('http-proxy-agent');

class Base extends BaseService {
    // http请求增加代理---前提配置了代理
    static getProxyOption(options) {
        if (undefined !== PROXY_DSN && PROXY_DSN.length > 0) {
            options["agent"] = new HttpProxyAgent(PROXY_DSN)
            options["redirect"] = 'follow'
        }
        return options
    }
}

export default Base