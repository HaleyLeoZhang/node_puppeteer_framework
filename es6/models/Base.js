// -----------------------------------------------------------------------
// 后续处理成，绑定参数形式
// -----------------------------------------------------------------------
export default class BaseModel {
    static do_insert(table, data) {
        const len = data.length
        if(0 == len) {
            throw new Error('插入数据不能为空');
        }
        // 获取插入字段
        let sample = data[0];
        let fields = [];
        let fields_warp = [];
        for(let field in sample) {
            fields.push(field);
            fields_warp.push('`'+ field + '`');
        }
        const fields_len = fields.length;
        // 拼接
        let datas = [];
        let sql = `Insert into \`${table}\` ( ${fields_warp.join(',')} )Values`
        let warp_data = [];
        for(let i = 0; i < len; i++) {
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