import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "http://www.kmwu6.com" // 爬取地址

export default class KuManWuService extends Base {
    static get_base_href() {
        return BASE_HREF
    }

    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `${BASE_HREF}/${source_id}/`
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: 3000,
        }
        Log.ctxInfo(ctx, `当前是酷漫屋`)
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".info h1").eq(0).text()
                let pic = $(".cover img").eq(0).attr("src")
                let intro = $(".info .content").eq(0).text()
                    .trim("")
                    .replace("漫画简介：", "")
                let res = {name, pic, intro}
                Log.ctxInfo(ctx, "数据如下" + JSON.stringify(res))
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return res
            })
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id) {
        let _this = this
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 列表信息-头部`)
        let target_url = `${BASE_HREF}/mulu/${source_id}/1-1.html`
        let sequence = 0
        let chapter_list = []
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: 3000,
        }
        // 先拉头部
        await fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let li_dom_list = $("#detail-list-select-1 li")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let link = dom.find("a").attr("href")
                        link = _this.getLink(link)
                        let name = dom.find("a").text()
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
        for (let i = 0, len_chapter_list = chapter_list.length; i < len_chapter_list; i++) {
            let handle_index = len_chapter_list - 1 - i
            let set_index = i + 1
            chapter_list[handle_index]["sequence"] = set_index
            new_chapter_list.push(chapter_list[handle_index])
        }
        return new_chapter_list

    }

    static getLink(path) {
        return `${BASE_HREF}/${path}`
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
            timeout: 3000,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                let match_data = html.match(/km5_img_url.*?'(.*?)'<\/script>/is)
                if (match_data[1] == null) {
                    Log.ctxInfo(ctx, ` ${target_url} 匹配失败`)
                    return
                }
                const raw_data_string = Buffer.from(match_data[1], 'base64').toString('utf-8')
                const raw_data = JSON.parse(raw_data_string)
                console.log('raw_data', raw_data)
                for (let i = 0, len_data = raw_data.length; i < len_data; i++) {
                    let one_image = raw_data[i].split("|")[1].trim("\\r");
                    image_list.push(one_image)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}