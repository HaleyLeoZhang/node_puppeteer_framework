import BaseService from '../../libs/Base/BaseService'
import Page from '../../models/Comic/Page'
import Image from '../../models/Comic/Image'

class Base extends BaseService {
    static async insert_pages(datas) {
        let {rows, first_insert_id} = await Page.insert(datas)
        return {rows, first_insert_id}
    }
    static async insert_images(datas) {
        let {rows, first_insert_id} = await Image.insert(datas)
        return {rows, first_insert_id}
    }
}
export default Base