// ----------------------------------------------------------------------
// 基于 mysql2 封装 ORM ，具体使用方法，请看函数前注释
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
// 表结构要求 1.表结构全部都得有默认值，NOT NULL 2.必须包含四个字段 
// 注： 以下字段不允许作为业务字段
// - id 自增无符号整型
// - created_at 创建时间 tampstamp
// - updated_at 更新时间 tampstamp 自动更新
// - is_deleted 数据状态 枚举值：0 未删除 1 已删除
// -----------------------------------------------------------------------

const CURRENT_TIME = General.format_time('Y-m-d h:i:s')
const IS_DELETED_NO = 0

class Handler {
    // 数据库操作，同 query 操作
    static execute(...args) {
        const sql = args[0]
        const datas = args[1]
        const callback = args[2]
        const POOL = args[3]

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
    static do_insert(table, data) {
        // 处理插入单条情况
        false === data instanceof Array ? data = [data] : null;

        const len = data.length
        if(0 == len) {
            throw new Error('插入数据不能为空');
        }
        // 获取插入字段
        let sample = data[0]
        this.add_time_field(sample)

        let fields = [];
        let fields_warp = [];
        for(let field in sample) {
            fields.push(field);
            fields_warp.push('`' + field + '`');
        }
        const fields_len = fields.length;
        // 拼接
        let datas = [];
        let sql = `Insert into \`${table}\` ( ${fields_warp.join(',')} )Values`
        let warp_data = [];
        for(let i = 0; i < len; i++) {
            this.add_time_field(data[i])
            let item = [];
            for(let index in fields) {
                item.push('?')
                datas.push(data[i][fields[index]])
            }
            let warp_raw = '(';
            warp_raw += item.join(',')
            warp_raw += ')'
            warp_data.push(warp_raw)
        }
        sql += warp_data.join(",")
        return { sql, datas };
    }
    static add_time_field(obj) {
        Object.assign(obj, { 'created_at': CURRENT_TIME, 'updated_at': CURRENT_TIME })
    }
    static handle_where_in(arr, is_not_in, datas) {
        let len = arr.length
        if(0 == len) {
            return null
        }
        let sql = '';
        let _bind_param = []
        for(let i in arr) {
            _bind_param.push('?')
            datas.push(arr[i])
        }
        if(undefined !== is_not_in) {
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
        Object.assign(where, { 'is_deleted': IS_DELETED_NO })

        let order_by = '';
        if(where.ORDER !== undefined) {
            let order_arr = []
            let order = where.ORDER
            delete where.ORDER
            for(let field in order) {
                let sequence = order[field]
                order_arr.push(`\`${field}\` ${sequence}`)
            }
            order_by = ` Order By ` + order_arr.join(',')
        }

        let sql_limit = '';
        if(where.LIMIT !== undefined) {
            let limit = where.LIMIT
            delete where.LIMIT
            if("object" == typeof limit) {
                sql_limit = ` limit ${limit[0]},${limit[1]}`
            } else {
                sql_limit = ` limit ${limit}`
            }
        }

        for(let field in where) {
            let value = where[field]
            let matches = field.match(/(.*?)\[(.*?)\]/)
            // 无其他条件符号
            if(null === matches) {
                if("object" == typeof value) { // where in 情况 ，value 为数组
                    let { sql_in, datas_new } = Handler.handle_where_in(value, undefined, datas)
                    if(null === sql_in) {
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
                let delimiter = matches[2]

                if("object" == typeof value) { // where not in 情况 ，value 为数组
                    let { sql_in, datas_new } = Handler.handle_where_in(value, 'not in', datas)
                    if(null === sql_in) {
                        continue
                    }
                    where_arr.push(`\`${field}\` ${sql_in}`)
                    datas = datas_new
                } else {
                    where_arr.push(`\`${field}\` ${delimiter} ?`)
                    datas.push(value)
                }
            }
        }
        if(where_arr.length > 0) {
            sql += ` Where ` + where_arr.join(" AND ")
        }

        sql += order_by + sql_limit
        return {"sql_where": sql, datas}
    }
    static do_select(table, where) {
        let sql = `Select * From \`${table}\` `

        let { sql_where, datas } = this.handle_where(where)
        sql += sql_where

        return { sql, datas }
    }
    static do_update(table, update, where) {
        let sql = `Update \`${table}\` Set `
        let _datas = [];
        if(0 == update.length) {
            throw new Error("请输入更新条件")
        }
        let set_arr = []

        for(let field in update) {
            let value = update[field]
            set_arr.push(`\`${field}\` = ?`)
            _datas.push(value)
        }

        let { sql_where, datas } = this.handle_where(where, _datas)
        sql += set_arr.join(",") + sql_where

        return { sql, datas }
    }
}

class BaseModel {
    static set_pool(DSN) {
        const POOL = mysql.createPool({
            host: DSN.db_host,
            user: DSN.db_username,
            password: DSN.db_password,
            database: DSN.db_name,
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        });
        return POOL
    }
    // ------------------------------------------------------------
    //      自封装 ORM
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
     */
    static async insert(_data) {
        let table = this.get_table()
        let first_insert_id = 0;
        let { sql, datas } = Handler.do_insert(table, _data);
        // Log.log(sql)
        // Log.log(datas)

        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    first_insert_id = results.insertId;
                    resolve(true)
                },
                this.get_pool());
        });
        return first_insert_id;
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
        let { sql, datas } = Handler.do_select(table, _where);
        Log.log(sql)
        Log.log(datas)
        let output = [];

        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    output = results
                    resolve(true)
                },
                this.get_pool());
        });
        return output;
    }

    /**
     * 适用于，复杂查询
     * 示例入参
     * let sql = `Select * From `pages` Where `is_deleted` = ? Order By `id` DESC limit 5`
     * let data = [0]
     */
    static async query(sql, datas) {
        let output = [];
        await new Promise((resolve) => {
            Handler.execute(
                sql,
                datas,
                (results) => {
                    output = results
                    resolve(true)
                },
                this.get_pool());
        });
        return output;
    }
    /**
     * _update 与_where 类似，请类比 this.select 方法
     */
    static async update(_update, _where) {
        let table = this.get_table()
        let { sql, datas } = Handler.do_update(table, _update, _where);
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
                this.get_pool());
        });
        return rows;
    }
}
export default BaseModel