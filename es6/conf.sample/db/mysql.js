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
        database: 'curl_avatar',
        connection_limit: 5, // 连接池配置:维持链接数,理论上10个应该够了
    }],
    // 写库
    write: [{
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'curl_avatar',
        connection_limit: 5, 
    }]
}


export {
    DSN_COMIC,
};