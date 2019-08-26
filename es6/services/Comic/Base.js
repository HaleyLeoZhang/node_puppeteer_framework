import BaseService from '../../libs/Base/BaseService'
import Page from '../../models/Comic/Page'
import Image from '../../models/Comic/Image'


const CHANNEL_ID_LIST = {
    'ManHuaNiu': 2 // Âþ»­Å£
}

class Base extends BaseService {
    static get_channel(channel_name) {
        return CHANNEL_ID_LIST[channel_name]
    }
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