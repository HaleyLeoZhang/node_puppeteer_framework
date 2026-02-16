import Base from './Base'
import Log from "../../tools/Log";
import UserAgentTool from "../../tools/UserAgentTool";
import CONST_BUSINESS_COMIC from "../../constant/business_comic";

const Module = require('module')
const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

const BASE_HREF = "http://www.sixmh7.com" // 爬取地址

export default class LiuManHuaService extends Base {
    static get_base_href(){
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
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".cy_title").find("h1").text()
                let pic = $(".cy_info_cover img").eq(0).attr("src")
                let intro = $(".cy_desc p").eq(0).text().trim("")
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
        let target_url = `${BASE_HREF}/${source_id}/`
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
                let li_dom_list = $(".cy_plist li")
                let len_li_dom_list = li_dom_list.length
                if (len_li_dom_list > 0) {
                    for (let i = 0; i < len_li_dom_list; i++) {
                        let dom = li_dom_list.eq(i)
                        let link = dom.find("a").attr("href")
                        link = _this.getLink(link)
                        let name = dom.find("p").text()
                        let tmp_one = {
                            link,
                            name,
                        }
                        chapter_list.push(tmp_one)
                    }
                }
            })
        // 后拉ajax数据
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 列表信息-剩余部分`)
        let ajax_api = `${BASE_HREF}/bookchapter/`
        let option = {
            method: "POST",
            mode: 'cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body: `id=${source_id}&id2=1`,
        }
        let len_chapter_list = 0
        await fetch(ajax_api, option)
            .then(res => res.text())
            .then(content => {
                // console.log('content', content)
                let list_raw = JSON.parse(content)
                let len_list_raw = list_raw.length
                for (let i = 0; i < len_list_raw; i++) {
                    let item = list_raw[i]
                    let link = _this.getLink(`/${source_id}/${item.chapterid}.html`)
                    let name = item.chaptername
                    sequence++
                    let tmp_one = {
                        link,
                        name,
                    }
                    chapter_list.push(tmp_one)
                }
                len_chapter_list = chapter_list.length

                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 总计章节数 ${len_chapter_list}`)
            })
        // 最后倒序写入顺序
        let new_chapter_list = [];
        for (let i = 0; i < len_chapter_list; i++) {
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
            timeout: CONST_BUSINESS_COMIC.HTTP_FETCH_TIMEOUT,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                // console.log('html', html)
                let srcpt_tpls = html.match(/eval\((.*)\)/)
                // console.log('srcpt_tpls', srcpt_tpls)
                let js_code = srcpt_tpls[0]
                // console.log('js_code', js_code)
                let js_real_code = `
                    ${js_code} 
                    ;module.exports = newImgs
                `
                // 当成模块动态编译js字符串
                let tmp_run_module_name = 'tmp-runtime-module';
                const tmp_module = new Module(tmp_run_module_name)
                tmp_module._compile(js_real_code, tmp_run_module_name)
                let image_list = tmp_module.exports
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}