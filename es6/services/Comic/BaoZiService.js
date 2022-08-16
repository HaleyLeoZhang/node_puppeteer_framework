import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "https://cn.baozimh.com" // 爬取地址

export default class BaoZiService extends Base {
    static get_base_href() {
        return BASE_HREF
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `BaoZiService 开始拉取 source_id ${source_id} 基本信息`)
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
                let name = $(".comics-detail__title").text()
                let pic = $("amp-addthis").attr("data-media")
                let intro = $(".comics-detail__desc").text()
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
        Log.ctxInfo(ctx, `BaoZiService 开始拉取 source_id ${source_id} 列表信息-头部`)
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
                let li_dom_list = $("#chapter-items .comics-chapters , #chapters_other_list .comics-chapters ")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let name = dom.find("span").text().trim()
                        let sequence = i + 1
                        let link = _this.getLink(source_id, sequence)
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

    /**
     * source_id 资源ID
     * sequence 跟顺序号保持一致
     */
    static getLink(source_id, sequence) {
        return `https://cn.webmota.com/comic/chapter/${source_id}/0_${sequence - 1}.html`
    }

    /**
     * 这个渠道，漫画内容比较多的时候，需要翻页
     * @return Promise
     */
    static async get_image_list(ctx, target_url) {
        let image_list = []
        let has_more = true
        for (let i = 1; has_more; i++) {
            let link = target_url.replace(".html", `_${i}.html`)
            let image_list_tmp = await BaoZiService.get_image_list_one(ctx, link)
            let len_tmp = image_list_tmp.length
            let len_img = image_list.length
            if (len_tmp === 0) {
                has_more = false
                continue
            } else if (len_img > 0 && (image_list_tmp[len_tmp-1] === image_list[len_img-1] )) {
                 // 如果最好一张图一样，说明已经到最后一页了
                has_more = false
                continue
            }
            // 合并内容
            image_list = image_list.concat(image_list_tmp)
        }
        // 拉取结束
        Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
        return image_list
    }

    /**
     * 拉取一页数据
     * @return Promise
     */
    static async get_image_list_one(ctx, target_url) {
        let image_list = [];
        Log.ctxInfo(ctx, `BaoZiService 开始拉取 ${target_url} 图片列表`)

        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        options = this.getProxyOption(options) // 这个不需要代理
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let image_object_list = $(".comic-contain__item")
                let image_length = image_object_list.length
                for (let i = 0; i < image_length; i++) {
                    let src = image_object_list.eq(i).attr("src")
                    image_list.push(src)
                }
                // 破解结束
                Log.ctxInfo(ctx, `单次拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}