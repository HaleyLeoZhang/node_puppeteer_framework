// ----------------------------------------------------------------------
// 爬虫基础服务
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
export default class BaseService {
    static delay_ms(ms) {
        new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}