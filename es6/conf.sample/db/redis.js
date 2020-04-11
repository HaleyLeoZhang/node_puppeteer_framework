// ----------------------------------------------------------------------
// Redis 基础配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const DSN_CACHE = {
    host: '192.168.56.110',
    port: 6379,
    password: '',
    db: 0,
}

// 本项目所使用的缓存前缀名
const CACHE_PREFIX = 'puppeteer'; 

export {
    DSN_CACHE,
    CACHE_PREFIX,
};