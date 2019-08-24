// ----------------------------------------------------------------------
// 通过 puppeteer ，使用不同渠道，爬取动漫图片地址 
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ManHuaNiuLogic from '../logics/ComicCurl/ManHuaNiuLogic'
import Log from '../tools/Log'

const CHANNEL_MHN = 2; // 漫画牛

class ComicCurl{
    /**
     * 渠道 - 漫画牛
     * - 章节爬取
     */
    static async mnh_pages(){
        const comics = await ManHuaNiuLogic.getComicList(CHANNEL_MHN)
        for(let i in comics){
            let one_comic = comics[i]
            await ManHuaNiuLogic.getPages(CHANNEL_MHN, one_comic.comic_id)
        }
    }
    /**
     * 渠道 - 漫画牛
     * - 图片地址爬取
     */
    static async mnh_images(){
        const pages = await ManHuaNiuLogic.getPageList(CHANNEL_MHN)
        for(let i in pages){
            let one_page = pages[i]
            await ManHuaNiuLogic.getImageList(CHANNEL_MHN, one_page)
        }
    }
    /**
     * 渠道 - 漫画牛
     * - 清空处理中的状态
     */
     static async mnh_clear(){
        // - TODO
     }
}
export default ComicCurl