// ----------------------------------------------------------------------
// 业务数据I/O
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import ComicPage from './'
import  {
    PROGRESS_WAIT,
    PROGRESS_DOING,
    PROGRESS_DONE,
} from './Enum'

export default class ComicPageData {
    /**
     * 批量插入数据
     * @param int channel 渠道ID
     * @return Promise
     */
    static async do_insert(list) {
        return ComicPage.insert(list)
    }
    static async get_list_by_channal_source_id(channel, source_id) {
        const where = {
            'channel': channel,
            'source_id': source_id,
            'ORDER': { "sequence": "asc" },
        }
        const datas = await ComicPage.select(where)
        if (0 === datas.length) {
            return []
        }
        return datas
    }
    static async get_list_gt_max_sequence(channel, source_id, max_sequence) {
        const where = {
            'channel': channel,
            'source_id': source_id,
            'sequence[>]': max_sequence,
            'ORDER': { "sequence": "asc" },
        }
        const datas = await ComicPage.select(where)
        if (0 === datas.length) {
            return []
        }
        return datas
    }
    static async get_list_which_progress_not_done(channel, source_id) {
        const where = {
            'channel': channel,
            'source_id': source_id,
            'progress': [ PROGRESS_WAIT, PROGRESS_DOING ],
            'ORDER': { "sequence": "asc" },
        }
        const datas = await ComicPage.select(where)
        if (0 === datas.length) {
            return []
        }
        return datas
    }
}