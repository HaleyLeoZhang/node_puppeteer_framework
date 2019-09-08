import Log from '../../tools/Log'
// 模型列表
import Comic from '../../models/Comic/Comic'
import Page from '../../models/Comic/Page'
import Image from '../../models/Comic/Image'

const PROGRESS_WAIT = 0
const PROGRESS_DOING = 1
const PROGRESS_DONE = 2

const PER_CURL_PAGES = 50

const IS_DELETED_YES = 1

class BaseProcess {
    static getComicList(channel) {
        const where = {
            'channel': channel,
        }
        return Comic.select(where)
    }
    /**
     * 每次爬取定长
     */
    static getPageList(channel) {
        const where = {
            'channel': channel,
            'progress': PROGRESS_WAIT,
            'ORDER': { "id": "ASC" },
            'LIMIT': PER_CURL_PAGES,
        }
        return Page.select(where)
    }
    /**/
    static getPageDoingList(channel){
        const where = {
            'channel': channel,
            'progress': PROGRESS_DOING,
        }
        return Page.select(where)
    }
    static deleImageData(page_id){
        const update = {
            "is_deleted": IS_DELETED_YES
        }
        const where = {
            page_id
        } 
        const promise = Image.update(update, where)
        return promise
    }
    static saveImageSrcWait(id){
        const update = {
            "progress": PROGRESS_WAIT
        }
        const where = {
            id,
            "progress": PROGRESS_DOING
        } 
        const promise = Page.update(update, where)
        return promise
    }
    static saveImageSrcDoing(id){
        const update = {
            "progress": PROGRESS_DOING
        }
        const where = {
            id
        } 
        const promise = Page.update(update, where)
        return promise
    }
    static saveImageSrcSuccess(id){
        const update = {
            "progress": PROGRESS_DONE
        }
        const where = {
            id
        } 
        const promise = Page.update(update, where)
        return promise
    }
}

export default class Base {
    /**
     * 获取该渠道漫画列表
     * @return Promise
     */
    static getComicList(channel) {
        return BaseProcess.getComicList(channel)
    }
    /**
     * 获取该渠道每页图片地址列表
     * @return Promise
     */
    static getPageList(channel) {
        return BaseProcess.getPageList(channel)
    }
    /**
     * 
     */
    static getPageDoingList(channel){
        return BaseProcess.getPageDoingList(channel)
    } 
    /**
     * 整理图片为表中格式
     */
    static filterImageList(imgs, page_id) {
        let datas = []
        let sequence = 0
        for(let i in imgs) {
            sequence++
            let img = imgs[i]
            datas.push({
                sequence,
                page_id,
                "src": img,
                
            })
        }
        return datas
    }
    /**
     * 删除之前的图片
     */
    static async deleImageData(page_id) {
        return BaseProcess.deleImageData(page_id)
    }
    /**
     * 获取图片数据成功
     */
    static async saveImageSrcWait(page_id) {
        return BaseProcess.saveImageSrcWait(page_id)
    }
    /**
     * 获取图片数据成功
     */
    static async saveImageSrcSuccess(page_id) {
        return BaseProcess.saveImageSrcSuccess(page_id)
    }
    /**
     * 处理图片数据中
     */
    static async saveImageSrcDoing(page_id) {
        return BaseProcess.saveImageSrcDoing(page_id)
    }

}