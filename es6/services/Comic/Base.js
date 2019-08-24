import BaseService from '../../libs/Base/BaseService'
import Page from '../../models/Comic/Page'
import Image from '../../models/Comic/Image'

class Base extends BaseService{
    static async insert_pages(datas){
        let first_id =  await Page.insert(datas)
        return first_id
    }
    static async insert_images(datas){
        let first_id =  await Image.insert(datas)
        return first_id
    }
}
export default Base