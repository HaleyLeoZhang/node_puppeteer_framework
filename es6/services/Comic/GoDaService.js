import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import TimeTool from "../../tools/TimeTool";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://cn.godamanga.com" // 爬取地址

export default class GoDaService extends Base {
    static get_base_href(){
        return BASE_HREF
    }
    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `${BASE_HREF}/manga/${source_id}/`
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".stk-block-heading__text").eq(0).text()
                let pic = $(".wp-post-image").eq(0).attr("data-lazy-src")
                let intro = $(".stk-block-text__text ").eq(0).text().trim("")
                Log.ctxInfo(ctx, "数据如下", {name, pic, intro})
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return {name, pic, intro}
            })
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id) {
        let _this = this
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 列表信息-头部`)
        let target_url = `${BASE_HREF}/chapterlist/${source_id}/`
        let sequence = 0
        let chapter_list = []
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        // 先拉头部
        await fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let li_dom_list = $(".listing-chapters_wrap a")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let link = dom.attr("href")
                        link = _this.getLink(link)
                        if (link.match(/#$/)){ // 跳过无用数据
                            continue
                        }
                        let name = dom.text()
                        let tmp_one = {
                            link,
                            name,
                        }
                        chapter_list.push(tmp_one)
                    }
                }
            })
        // 最后倒序写入顺序
        let new_chapter_list = [];
        for (let i = 0, len_chapter_list = chapter_list.length ; i < len_chapter_list; i++) {
            let handle_index = len_chapter_list - 1 - i
            let set_index = i + 1
            chapter_list[handle_index]["sequence"] = set_index
            new_chapter_list.push(chapter_list[handle_index])
        }
        return new_chapter_list

    }

    static getLink(path) {
        return path
        // return `${BASE_HREF}/${path}`
    }

    /**
     * @return Promise
     */
    static async get_image_list(ctx, target_url) {
        let image_list = [];
        Log.ctxInfo(ctx, `TuZhuiService 开始拉取 ${target_url} 图片列表`)

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        Log.ctxInfo(ctx, `随机停顿中`)
        await TimeTool.delay_rand_ms(500, 5000) // 限速
        Log.ctxInfo(ctx, `继续`)
        // options = this.getProxyOption(options) // 这个需要代理
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {

                const $ = cheerio.load(html);
                let image_object_list = $(".stk-block-content img")
                let image_length = image_object_list.length
                for (let i = 0; i < image_length; i++) {
                    let src = image_object_list.eq(i).attr("data-lazy-src")
                    image_list.push(src)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}