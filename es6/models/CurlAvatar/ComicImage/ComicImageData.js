// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ComicImage from './'
// import  {} from './Enum'

export default class ComicImageData {
    /**
     * 批量插入数据
     * @param array list 整理好对应表中格式的图片列表
     * @return Promise
     */
    static async do_insert(list) {
        return ComicImage.insert(list)
    }
}