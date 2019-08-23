import Base from './Base'

const TABLE_NAME = 'pages';

const fields = ['comic_id', 'name', 'link', 'created_at', 'updated_at'];

class Page extends Base {
    static async insert(_data) {
        let last_insert_id = 0;
        let {sql, datas} = this.do_insert(TABLE_NAME, _data);
        await new Promise((resolve) => {
            this.execute(sql, datas, (results) => {
                last_insert_id = results.insertId;
                console.log(last_insert_id);
                console.log('last_insert_id-------' + last_insert_id);
            });
        });
        console.log('-------');
        return last_insert_id;
    }
}
export default Page;