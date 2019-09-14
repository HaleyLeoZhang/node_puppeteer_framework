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
    static delay_ms(ms) {
        new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}