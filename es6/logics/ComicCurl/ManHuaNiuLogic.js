import ManHuaNiu, { COMIC_ID_LIST } from '../../services/Comic/ManHuaNiu'
import Page from '../../models/Comic/Page'
// import Image frm '../../models/Comic/Image' // TODO
import Log from '../../tools/Log'

class ManHuaNiuProcess {
    static backPageData() {
        const comic_id = COMIC_ID_LIST.jie_mo_ren
        const promise = ManHuaNiu.get_images_pages(comic_id)
        return promise;
    }
    static async getNeedData() {
        const where = {
            'channel': ManHuaNiu.get_channel('ManHuaNiu'),
            'comic_id': COMIC_ID_LIST.jie_mo_ren,
            'ORDER':{"id":"desc"},
            'LIMIT': 1,
        }
        const datas = await Page.select(where)
        let last_sequence = 0
        if(0 != datas.length) {
            const data = datas[0]
            last_sequence = data.sequence
        }
        return last_sequence
    }
}

export default class ManHuaNiuLogic {
    static async getPages() {
        const last_sequence = await ManHuaNiuProcess.getNeedData()
        const data = await ManHuaNiuProcess.backPageData()
            .then((info) => {
                let data = []
                let sequence = 0
                let _switch = false
                for(let i = 0, len = info.hrefs.length; i < len; i++) {
                    let one_data = {
                        'channel': ManHuaNiu.get_channel('ManHuaNiu'),
                        'comic_id': info.comic_id,
                        'name': info.titles[i],
                        'link': info.hrefs[i],
                        'sequence': 0,
                    }
                    let matches = one_data.name.match(/第/)
                    if(null != matches) {
                        sequence++
                        Object.assign(one_data, { sequence })
                    }
                    // Log.log('last_id:' +last_id + ' sequence:' + one_data.sequence)
                    if(one_data.sequence > last_sequence) {
                        _switch = true
                    }

                    if(true == _switch) {
                        data.push(one_data)
                    }
                }
                return data
            })
        if(0 == data.length) {
            Log.log('暂无需要拉取的数据')
            return false
        }
        await Page.insert(data)
            .then(insert_info => {
                Log.log('章节列表拉取成功----' + JSON.stringify(insert_info))
            })
        return true
    }
}