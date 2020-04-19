// ----------------------------------------------------------------------
// 漫画爬虫逻辑基类
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

export default class Base {
    /**
     * 整理图片为可插入数据库的数据结构
     * 
     * @param array imgs 待处理的图片地址列表
     * @param int page_id 库中对应章节的ID
     * @return array
     */
    static filter_image_list(imgs, page_id) {
        let datas = []
        let sequence = 0
        for (let i in imgs) {
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
}