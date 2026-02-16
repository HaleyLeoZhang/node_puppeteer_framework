import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://www.g-lens.com" // 爬取地址

export default class HaoManLiuService extends Base {
    static get_base_href() {
        return BASE_HREF
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `HaoManLiuService 开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `${BASE_HREF}/comic/${source_id}`

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        options = this.getProxyOption(options) // 使用代理
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".j-comic-title").text()
                let pic = $(".de-info__cover img").attr("src")
                let intro = $(".intro-total").text()
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
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 列表信息-头部`)
        let target_url = `${BASE_HREF}/comic/${source_id}`
        let chapter_list = []
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        options = this.getProxyOption(options) // 使用代理
        await fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let li_dom_list = $(".chapter__list li")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let link = dom.find("a").attr("href")
                        link = _this.getLink(link)
                        let name = dom.find("a").text().trim()
                        let sequence = i + 1
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
        return `${BASE_HREF}${path}`
    }

    /**
     * @return Promise
     */
    static async get_image_list(ctx, target_url) {
        let image_list = [];
        Log.ctxInfo(ctx, `开始拉取 ${target_url} 图片列表`)

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        options = this.getProxyOption(options) // 使用代理
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {

                const $ = cheerio.load(html);
                let image_object_list = $("img[data-echo]")
                let image_length = image_object_list.length
                for (let i = 0; i < image_length; i++) {
                    let src = image_object_list.eq(i).attr("data-echo")
                    image_list.push(src)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}