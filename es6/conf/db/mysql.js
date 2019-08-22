// ------------------------------------------------------------------------
// Sequelize Docs 
// ------------------------------------------------------------------------
// https://segmentfault.com/a/1190000011583660#articleHeader12
// ------------------------------------------------------------------------

// 临时库
// const DSN_TEMP = {
//     dialect: 'mysql',
//     dialectOptions: {
//         port: 3306,
//         replication: {
//             read: [
//                 { host: '127.0.0.1', username: 'root', password: '602466' },
//             ],
//             write: [
//                 { host: '127.0.0.1', username: 'root', password: '602466' },
//             ]
//         },
//         pool: { // 如果需要重写链接池，请在 pool 选项中修改
//             maxConnections: 20,
//             maxIdleTime: 30000
//         },
//     }
// }

const DSN_TEMP = {
    dialect: 'mysql',
    dialectOptions: {
        port: 3306,
        replication: {
            read: [
                { host: '127.0.0.1', username: 'root', password: '602466' },
            ],
            write: [
                { host: '127.0.0.1', username: 'root', password: '602466' },
            ]
        },
        pool: { // 如果需要重写链接池，请在 pool 选项中修改
            maxConnections: 20,
            maxIdleTime: 30000
        },
    }
}


export {
    DSN_TEMP,
};