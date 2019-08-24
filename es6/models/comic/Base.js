import mysql from 'mysql2';
import { DSN_COMIC } from '../../conf/db/mysql'
import BaseModel from '../Base'
import Log from '../../tools/Log'

// create the connection to database
const POOL = mysql.createPool({
    host: DSN_COMIC.db_host,
    user: DSN_COMIC.db_username,
    password: DSN_COMIC.db_password,
    database: DSN_COMIC.db_name,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

class Base extends BaseModel {
    /**
     * 数据库操作，同 query 操作
     * - rows,fields
     * @return void
     */
    static execute(...args) {
        const sql = args[0]
        const datas = args[1]
        const callback = args[2]

        POOL.getConnection(function (err, conn) {
            conn.promise()
                .execute(sql, datas)
                .then(([ResultSetHeader]) => {
                    callback(ResultSetHeader)
                })
                .catch(function (err) {
                    console.warn("数据库异常！");
                    console.error(err);
                    POOL.releaseConnection(conn);
                })
            POOL.releaseConnection(conn);
        })
    }

}

export default Base;