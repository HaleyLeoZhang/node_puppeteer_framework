// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ComicPage from './'
// import  {} from './Enum'

export default class ComicPageData {
    /**
     * 批量插入数据
     * @param int channel 渠道ID
     * @return Promise
     */
    static async do_insert(list) {
        return ComicPage.insert(data.new_page_data)
    }
}