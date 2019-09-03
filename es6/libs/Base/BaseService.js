// ----------------------------------------------------------------------
// 爬虫基础服务 - 只负责爬取页面、清洗数据等动作
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
export default class BaseService {
    static delay_ms(ms) {
        new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}