import Base from './Base'
import Log from '../../tools/Log'

const TABLE_NAME = 'images';

class Image extends Base {
    static async insert(_data) {
        let last_insert_id = 0;
        let {sql, datas} = this.do_insert(TABLE_NAME, _data);
        Log.log(sql)
        Log.log(datas)
        await new Promise((resolve) => {
            this.execute(sql, datas, (results) => {
                last_insert_id = results.insertId;
                resolve(true)
            });
        });
        return last_insert_id;
    }
}
export default Image;