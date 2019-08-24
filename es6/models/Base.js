import General from '../tools/General'
// -----------------------------------------------------------------------
// 后续处理成，绑定参数形式
// -----------------------------------------------------------------------
// 表结构 必须包含 自增id created_at updated_at
// -----------------------------------------------------------------------

const date = General.format_time('Y-m-d h:i:s')
const add_time_field = (obj) => {
    Object.assign(obj, { 'created_at': date, 'updated_at': date })
}

export default class BaseModel {
    static do_insert(table, data) {
        // 处理插入单条情况
        false === data instanceof Array ? data = [data] : null;

        const len = data.length
        if(0 == len) {
            throw new Error('插入数据不能为空');
        }
        // 获取插入字段
        let sample = data[0]
        add_time_field(sample)

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
            add_time_field(data[i])
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
}