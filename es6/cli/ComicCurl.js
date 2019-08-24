// ----------------------------------------------------------------------
// 通过 puppeteer ，使用不同渠道，爬取动漫图片地址 
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ManHuaNiuLogic from '../logics/ComicCurl/ManHuaNiuLogic'
import Log from '../tools/Log'

class ComicCurl{
    /**
     * 渠道 - 漫画牛
     * - 指定单个comic_id进行爬取工作
     */
    static async mnh_pages(){
        let channel = 2
        let comic_id = 5830
        await ManHuaNiuLogic.getPages(channel, comic_id)
    }
}
export default ComicCurl