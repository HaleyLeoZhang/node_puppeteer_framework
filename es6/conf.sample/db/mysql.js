// ----------------------------------------------------------------------
// Mysql 基础配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const DSN_COMIC = {
    // 读库 ---　只有使用 查询构造器 的 select 操作会触发该库
    read: [{
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'comics',
    }],
    // 写库
    write: [{
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'comics',
    }]
}


export {
    DSN_COMIC,
};