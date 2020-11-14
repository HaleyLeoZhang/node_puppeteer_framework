import Base from './Base'
import ManHuaNiuService from '../../services/Comic/ManHuaNiuService'
import Log from '../../tools/Log'

import ComicData from '../../models/CurlAvatar/Comic/ComicData'
import ComicPageData from '../../models/CurlAvatar/ComicPage/ComicPageData'
import ComicImageData from '../../models/CurlAvatar/ComicImage/ComicImageData'

import { PROGRESS_DONE } from '../../models/CurlAvatar/ComicPage/Enum'
import CONST_BUSINESS from "../../constant/business";
import CONST_AMQP from "../../constant/amqp";
import {FIELD_METHOD} from "../../models/CurlAvatar/Comic/Enum";
import CONST_DATABASE from "../../constant/database";

export default class ManHuaNiuLogic extends Base {

    /**
     * 自动拉取页面，自动判断是否需要更新
     */
    static async get_chapter_list(ctx, payload) {
        let comic_id = payload.id
        const one_comic = await ComicData.get_comic_by_id(comic_id)
        if (!one_comic) {
            Log.ctxWarn(ctx, 'ID不存在')
            return
        }
        if (one_comic.is_deleted === CONST_DATABASE.IS_DELETED_YES){
            Log.ctxWarn(ctx, '已被软删除')
            return
        }
        const last_sequence = one_comic.max_sequence
        const { new_page_data, comic_info } = await ManHuaNiuService.get_page_list(one_comic)
            .then((info) => {
                let data = []
                for (let i = 0, len = info.hrefs.length; i < len; i++) {
                    let one_data = {
                        'channel': one_comic.channel,
                        'source_id': info.source_id,
                        'name': info.titles[i],
                        'link': info.hrefs[i],
                        'sequence': (i + 1),
                    }
                    // 增量爬取
                    if (one_data.sequence > last_sequence) {
                        data.push(one_data)
                    }
                    info.max_sequence = one_data.sequence
                }
                return { "new_page_data": data, "comic_info": info.detail }
            })
        // 更新漫画信息
        if (null === comic_info) {
            Log.ctxError(ctx, 'ManHuaNiuLogic.comic_info is null')
        }else if (one_comic.method === FIELD_METHOD.AUTO){
            await ComicData.update_comic_by_id(comic_info, one_comic.id)
        }
        // 更新章节信息
        if (0 === new_page_data.length) {
            Log.ctxError(ctx,`《${one_comic.name}》---暂无新章节`)
            await ComicPageData.get_list_which_progress_not_done(one_comic.channel, one_comic.source_id)
                .then(page_list => {
                    return ManHuaNiuLogic.push_image_task(page_list)
                })
            return CONST_BUSINESS.TASK_SUCCESS
        }

        await ComicPageData.do_insert(new_page_data)
            .then((insert_info) => {
                Log.ctxError(ctx,`《${one_comic.name}》---添加章节----`, JSON.stringify(insert_info))
                return ComicPageData.get_list_gt_max_sequence(one_comic.channel, one_comic.source_id, last_sequence)
                    .then((page_list) => {
                        ManHuaNiuLogic.push_image_task(page_list)
                    })
            })

        return CONST_BUSINESS.TASK_SUCCESS
    }
    // private
    static async push_image_task(ctx, page_list) {
        let payloads = []
        for (let i = 0, len = page_list.length; i < len; i++) {
            let one_page = page_list[i]
            // 推
            let payload = {
                "id": one_page.id,
                "scene": CONST_BUSINESS.SCENE_IMAGE_LIST,
                "body": {},
            };
            payloads.push(payload)
        }
        if (0 === payloads.length) {
            return
        }
        const mq = new RabbitMQ();
        mq.set_exchange(CONST_AMQP.AMQP_EXCHANGE_TOPIC)
        mq.set_routing_key(CONST_AMQP.AMQP_ROUTING_KEY_MANHUANIU)
        mq.set_queue(CONST_AMQP.AMQP_QUEUE_MANHUANIU)
        mq.push_multi(payloads)
    }

    /**
     * 自动拉取图片
     */
    static async get_imaeg_list(ctx, payload) {
        const page_id = payload.id
        const one_page = await ComicPageData.get_by_id(page_id)
        let { link, source_id, sequence } = one_page
        const imgs = await ManHuaNiuService.get_image_list(link)
        if (0 === imgs.length) {
            Log.ctxError(ctx,`ManhuaNiuImage.page_id.${page_id}---No new image`)
            return CONST_BUSINESS.TASK_SUCCESS
        }
        const image_list = this.filter_image_list(imgs, page_id)
        await ComicImageData.do_insert(image_list)
            .then(insert_info => {
                Log.ctxError(ctx,`ManhuaNiuImage.source_id.${source_id}.sequence.${sequence}`, insert_info)
                return ComicPageData.update_process_by_id(page_id, PROGRESS_DONE)
            })
        return CONST_BUSINESS.TASK_SUCCESS
    }
}