import BaseCache from '../libs/Base/BaseCache'

export default class PageCache {
    // 缓存名称
    static get_name() {
        return 'page'
    }
    // 缓存秒数
    static get_ttl() {
        return 300
    }
    // 缓存类型
    static get_type() {
        return 'string'
    }
}