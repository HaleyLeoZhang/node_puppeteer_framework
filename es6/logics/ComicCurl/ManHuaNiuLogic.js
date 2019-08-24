import ManHuaNiu, { COMIC_ID_LIST } from '../../services/Comic/ManHuaNiu'
import Log from '../../tools/Log'

class ManHuaNiuProcess {
    static backPageData() {
        const comic_id = COMIC_ID_LIST.jie_mo_ren
        const promise = ManHuaNiu.get_images_pages(comic_id)
        return promise;
    }
}

export default class ManHuaNiuLogic {
    static getPages() {
        ManHuaNiuProcess.backPageData()
            .then((datas) => {
                Log.log('已经获取数据')
                Log.log(datas)
            })
            .catch((error) => {
                Log.error(error)
            })
    }
}