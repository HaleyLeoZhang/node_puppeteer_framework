// ----------------------------------------------------------------------
// 基于 mysql2 封装 查询构造器 ，具体使用方法，请看函数前注释
// ----------------------------------------------------------------------
// mysql2 文档地址 https://www.npmjs.com/package/mysql2
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import mysql from 'mysql2';
import General from '../../tools/General'
import Log from '../../tools/Log'
// -----------------------------------------------------------------------
// 暂不实现：1.主从模式 2.chunk 3.事务处理
// -----------------------------------------------------------------------
// 表结构要求 1.表结构全部都得有默认值 2. NOT NULL 3.必须包含以下四个字段  详见 http://www.hlzblog.top/article/68.html
// 注： 以下字段不允许作为业务字段
// - id 自增无符号整型
// - created_at 创建时间 datetime
// - updated_at 更新时间 datetime 请在数据表中设置为自动更新
// - status 数据状态 枚举值: 0 已删除
// -----------------------------------------------------------------------

const CURRENT_TIME = General.format_time('Y-m-d h:i:s')

const DB_ACTION_WRITE = 'write'
const DB_ACTION_READ = 'read'

class Handler {
    // 数据库操作，同 query 操作
    static execute(...args) {
        const sql = args[0]
        const datas = args[1]
        const callback = args[2]
        const POOL = args[3]

        POOL.getConnection((err, conn) => {
            if (err) {
                Log.error("SQL Exception: ", err.message);
                return
            }
            conn.promise()
                .execute(sql, datas)
                .then((obj) => {
                    callback(obj)
                })
                .catch((err) => {
                    const uuid = General.uuid()
                    Log.error(uuid, "SQL Exception: ", err);
                    Log.warn(uuid, "SQL: ", sql);
                    let sql_values = ""
                    if(datas){
                        sql_values = JSON.stringify(datas)
                    }
                    Log.warn(uuid, "SQL Values: ", sql_values);
                    conn.close()
                })
                .finally(() => { // 始终释放连接句柄
                    POOL.releaseConnection(conn);
                });
        })
    }

    static do_insert(table, data, duplicate_sql) {
        // 处理插入单条情况
        false === data instanceof Array ? data = [data] : null;

        const len = data.length
        if (0 == len) {
            throw new Error('插入数据不能为空');
        }
        // 获取插入字段
        let sample = data[0]

        let fields = [];
        let fields_warp = [];
        for (let field in sample) {
            fields.push(field);
            fields_warp.push('`' + field + '`');
        }
        const fields_len = fields.length;
        // 拼接
        let datas = [];
        let sql = `INSERT INTO \`${table}\` ( ${fields_warp.join(',')} )VALUES`
        let warp_data = [];
        for (let i = 0; i < len; i++) {
            let item = [];
            for (let index in fields) {
                item.push('?')
                datas.push(data[i][fields[index]])
            }
            let warp_raw = '(';
            warp_raw += item.join(',')
            warp_raw += ')'
            warp_data.push(warp_raw)
        }
        sql += warp_data.join(",")
        // 如果是唯一索引，需要设置重复key的处理策略
        if(duplicate_sql != ''){
            sql += ' ' + duplicate_sql + ' '
        }
        return {sql, datas};
    }

    static handle_where_in(arr, is_not_in, datas) {
        let len = arr.length
        if (0 === len) {
            throw new Error("WHERE in 入参不能为空数组")
        }
        let sql = '';
        let _bind_param = []
        for (let i in arr) {
            _bind_param.push('?')
            datas.push(arr[i])
        }
        if (undefined !== is_not_in) {
            sql += ' Not '
        }
        sql += 'In (' + _bind_param.join(',') + ') '
        return {
            sql_in: sql,
            datas_new: datas
        }
    }

    static handle_where(where, datas) {
        let sql = '';
        let where_arr = []
        datas = undefined === datas ? [] : datas

        let order_by = '';
        if (where.ORDER !== undefined) {
            let order_arr = []
            let order = where.ORDER
            delete where.ORDER
            for (let field in order) {
                let sequence = order[field]
                order_arr.push(`\`${field}\` ${sequence}`)
            }
            order_by = ` ORDER BY ` + order_arr.join(',')
        }

        let sql_LIMIT = '';
        if (where.LIMIT !== undefined) {
            let LIMIT = where.LIMIT
            delete where.LIMIT
            if ("object" == typeof LIMIT) {
                sql_LIMIT = ` Limit ${LIMIT[0]},${LIMIT[1]}`
            } else {
                sql_LIMIT = ` Limit ${LIMIT}`
            }
        }

        for (let field in where) {
            let value = where[field]
            let matches = field.match(/(.*?)\[(.*?)\]/)
            // 无其他条件符号
            if (null === matches) {
                if ("object" == typeof value) { // where in 情况 ，value 为数组
                    let {sql_in, datas_new} = Handler.handle_where_in(value, undefined, datas)
                    if (null === sql_in) {
                        continue
                    }
                    where_arr.push(`\`${field}\` ${sql_in}`)
                    datas = datas_new
                } else {
                    where_arr.push(`\`${field}\` = ?`)
                    datas.push(value)
                }
            } else {
                field = matches[1]
                let deLIMITer = matches[2]

                if ("object" == typeof value) { // where not in 情况 ，value 为数组
                    let {sql_in, datas_new} = Handler.handle_where_in(value, 'not in', datas)
                    if (null === sql_in) {
                        continue
                    }
                    where_arr.push(`\`${field}\` ${sql_in}`)
                    datas = datas_new
                } else {
                    where_arr.push(`\`${field}\` ${deLIMITer} ?`)
                    datas.push(value)
                }
            }
        }
        if (where_arr.length > 0) {
            sql += ` WHERE ` + where_arr.join(" AND ")
        }

        sql += order_by + sql_LIMIT
        return {"sql_where": sql, datas}
    }

    static do_select(table, where) {
        let sql = `SELECT * FROM \`${table}\` `

        let {sql_where, datas} = this.handle_where(where)
        sql += sql_where

        return {sql, datas}
    }

    static do_update(table, update, where) {
        let sql = `UPDATE \`${table}\` SET `
        let _datas = [];
        if (0 == update.length) {
            throw new Error("请输入更新条件")
        }
        let set_arr = []

        for (let field in update) {
            let value = update[field]
            set_arr.push(`\`${field}\` = ?`)
            _datas.push(value)
        }

        let {sql_where, datas} = this.handle_where(where, _datas)
        sql += set_arr.join(",") + sql_where

        return {sql, datas}
    }

    static get_pool_by_action(DSN, action) {
        // 单例获取
        if (!this.instance) {
            this.instance = {};
        }
        // 依据数据库名,唯一获取一个当前的库
        let db_confs = DSN[action]
        let db_unique_name = action + '_' + db_confs[0].database
        if (undefined === this.instance[db_unique_name]) {
            let _this = this
            let db_size = db_confs.length
            let rand_index = General.mt_rand(0, db_size - 1)
            let one_dsn = db_confs[rand_index]
            const POOL = mysql.createPool({
                host: one_dsn.host,
                port: one_dsn.port,
                user: one_dsn.user,
                password: one_dsn.password,
                database: one_dsn.database,
                waitForConnections: true,
                connectionLimit: one_dsn.connection_limit,
                queueLimit: 0
            });
            this.instance[db_unique_name] = POOL
            // Log.log(`db_unique_name ${db_unique_name} rand_index ${rand_index} one_dsn ${JSON.stringify(one_dsn)}`)
        }
        return this.instance[db_unique_name];
    }
}

class BaseModel {
    static get_dsn(DSN) {
        throw new Error("请实现该 Model 的 get_dsn 返回")
    }

    static get_table() {
        throw new Error("请重写 get_table 方法，返回 {数据表中名字}")
    }

    static get_dsn() {
        throw new Error("请在数据库模型基类重写 get_dsn 方法，返回数据库DSN配置")
    }

    // ------------------------------------------------------------
    //      自封装 查询方法
    // ------------------------------------------------------------

    /**
     * 示例入参
     *
     * let _data = {
     *     "author": "云天河",
     *     "is_super_admin": 1,
     * }
     *
     * let _data = [{
     *     "author": "云天河",
     *     "is_super_admin": 1,
     * }, {
     *     "author": "测试号",
     *     "is_super_admin": 1,
     * }, ]
     *
     * let _data = [{
     *     "author": "云天河",
     *     "is_super_admin": 1,
     * }, {
     *     "author": "测试号",
     *     "is_super_admin": 1,
     * }, 'ON DUPLICATE KEY UPDATE status = VALUES( status )]
     */
    static async insert(_data, duplicate_sql = '') {
        let table = this.get_table()
        let {sql, datas} = Handler.do_insert(table, _data, duplicate_sql);
        // Log.log(sql)
        // Log.log(datas)
        const results = await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                ([ResultSetHeader]) => {
                    resolve(ResultSetHeader)
                },
                Handler.get_pool_by_action(this.get_dsn(), DB_ACTION_WRITE));
        })
        return {
            "rows": results.affectedRows,
            "first_insert_id": results.insertId,
        }
    }

    /**
     * 示例入参
     *
     * let _where = {
     *     "channel" : 5,
     *     "page_id[>]": 2,
     *     "sequence": [1, 2, 3],
     *     "page_id[!=]": 1,
     *     "ORDER": {
     *         "page_id": "ASC",
     *         "sequence": "ASC",
     *     },
     *     "LIMIT": 100
     * }
     *
     * let _where = {
     *     "page_id[!=]": [2, 4],
     *     "ORDER": {
     *         "id": "DESC",
     *     },
     *     "LIMIT": [0, 100]
     * }
     */
    static async select(_where) {
        let table = this.get_table()
        let {sql, datas} = Handler.do_select(table, _where);
        // Log.log(sql)
        // Log.log(datas)
        let output = [];

        const res = await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                ([datas]) => {
                    // Log.log(datas)
                    resolve(datas)
                },
                Handler.get_pool_by_action(this.get_dsn(), DB_ACTION_READ));
        });
        return res;
    }

    /**
     * 适用于，复杂查询
     * 示例入参
     * let sql = `SELECT * FROM `pages` WHERE `is_deleted` = ? ORDER BY `id` DESC LIMIT 5`
     * let data = [0]
     */
    static async query(sql, datas) {
        let output = [];
        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    output = results[0]
                    resolve(true)
                },
                Handler.get_pool_by_action(this.get_dsn(), DB_ACTION_READ));
        });
        return output;
    }

    /**
     * 适用于，复杂插入、删除、更新操作
     * 示例入参
     * let sql = `SELECT * FROM `pages` WHERE `is_deleted` = ? ORDER BY `id` DESC LIMIT 5`
     * let data = [0]
     * @return void
     */
    static async execute(sql, datas) {
        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    resolve(true)
                },
                Handler.get_pool_by_action(this.get_dsn(), DB_ACTION_WRITE));
        });
        return
    }

    /**
     * _update 与_where 类似，请类比 this.select 方法
     */
    static async update(_update, _where) {
        let table = this.get_table()
        let {sql, datas} = Handler.do_update(table, _update, _where);
        // Log.log(sql)
        // Log.log(datas)
        let rows = 0;

        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    rows = results.affectedRows
                    // Log.log(results)
                    resolve(true)
                },
                Handler.get_pool_by_action(this.get_dsn(), DB_ACTION_WRITE));
        });
        return rows;
    }
}

export default BaseModel