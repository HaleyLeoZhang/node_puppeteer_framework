// ----------------------------------------------------------------------
// 爬虫基础服务 - 只负责爬取页面、清洗数据等动作
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import * as ua from 'random-useragent';

export default class BaseService {
    /**
     * 随机获取一个浏览器环境信息
     * @return string
     */
    static get_fake_ua() {
        return ua.getRandom();
    }
    /**
     * 延迟指定毫秒数
     *
     * @param int ms 毫秒数 
     * @return Promise void
     */
    static delay_ms(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}