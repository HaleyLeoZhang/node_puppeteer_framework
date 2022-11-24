import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";
import TimeTool from "../../tools/TimeTool";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://www.mianzhui.com" // 爬取地址

export default class TuZhuiService extends Base {
    static get_base_href() {
        return BASE_HREF
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `TuZhuiService 开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `${BASE_HREF}/${source_id}`

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        // options = this.getProxyOption(options) // 使用代理
        Log.ctxInfo(ctx, `随机停顿中`)
        await TimeTool.delay_rand_ms(500, 5000) // 限速
        Log.ctxInfo(ctx, `继续`)
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".cy_title h1").text()
                let pic = $(".cy_info_cover img").attr("src")
                let intro = `欢迎观看 ${name}`
                Log.ctxInfo(ctx, JSON.stringify({name, pic, intro}))
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return {name, pic, intro}
            })
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id) {
        let _this = this
        Log.ctxInfo(ctx, `TuZhuiService 开始拉取 source_id ${source_id} 列表信息`)
        let target_url = `${BASE_HREF}/${source_id}`
        let chapter_list = []
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        Log.ctxInfo(ctx, `随机停顿中`)
        await TimeTool.delay_rand_ms(500, 5000) // 限速
        Log.ctxInfo(ctx, `继续`)
        // options = this.getProxyOption(options) // 使用代理
        await fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let li_dom_list = $(".chapter__item")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    let sequence = 0
                    for (let i = len_li_dom_list; i > 0; i--) {
                        let dom = li_dom_list.eq(i - 1)
                        let name = dom.find("p").text().trim()
                        sequence++
                        let path = dom.find("a").attr("href").trim()
                        let link = _this.getLink(path)
                        let tmp_one = {
                            link,
                            name,
                            sequence,
                        }
                        chapter_list.push(tmp_one)
                    }
                }
            })
        return chapter_list

    }

    static getLink(path) {
        return TuZhuiService.get_base_href() + path
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
                let image_object_list = $(".lazy-read")
                let image_length = image_object_list.length
                for (let i = 0; i < image_length; i++) {
                    let src = image_object_list.eq(i).attr("data-original")
                    image_list.push(src)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}