import Base from './Base'
import Log from "../../tools/Log";
import {FIELD_EXT_1} from "../../models/CurlAvatar/Supplier/Enum";
import UserAgentTool from "../../tools/UserAgentTool";

const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

export default class GuFengService extends Base {
    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `https://www.gufengmh8.com/manhua/${source_id}/`
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: 3000,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".book-title").find("span").text()
                let pic = $(".book-cover").find("img").attr("src")
                let intro = $("#intro-all").text().trim("")
                Log.ctxInfo(ctx, "数据如下", {name, pic, intro})
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return {name, pic, intro}
            })
    }

    /**
     * @return Promise
     */
    static async get_chapter_list(ctx, source_id, tab_name) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `https://www.gufengmh8.com/manhua/${source_id}/`
        let options = {
            'headers': {
                'User-Agent': UserAgentTool.fake_one(),
            },
            timeout: 3000,
        }
        return fetch(target_url, options)
            .then(res => res.text())
            .then(html => {
                let chapter_list = []
                const $ = cheerio.load(html);
                let tabs = $(".comic-chapters")
                let len_tabs = tabs.length
                if (tabs === undefined || len_tabs === 0) {
                    Log.ctxError(ctx, "爬取章节TAB失败")
                    return chapter_list
                }

                for (let i = 0; i < len_tabs; i++) {
                    let tab = tabs.eq(i)
                    let tab_name_raw = tab.find(".caption span").text().trim()
                    if (tab_name == tab_name_raw) {
                        let doms = tab.find("li")
                        let len_doms = doms.length
                        if (doms === undefined || len_doms === 0) {
                            Log.ctxError(ctx, "爬取章节列表失败")
                            return chapter_list
                        }
                        for (let i = 0; i < len_doms; i++) {
                            let dom = doms.eq(i)
                            let link = dom.find("a").attr("href")
                            link = `https://www.gufengmh8.com${link}`
                            // console.log("link", link)
                            let name = dom.find("span").text()
                            let sequence = i + 1
                            let tmp_one = {
                                link,
                                name,
                                sequence,
                            }
                            chapter_list.push(tmp_one)
                        }
                    }
                }

                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 总计章节数 ${chapter_list.length}`)
                return chapter_list
            })
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
                let srcpt_tpls = html.match(/var siteName = "";(.*?)var prevChapterData/)
                let tpl = srcpt_tpls[1]
                // 破解开始
                let func_string = `(function tmp_func(data){
                  let output = {}; ${tpl}
                  output = {chapterImages,chapterPath,pageImage,}
                  return output;
                })`
                let func = eval(func_string)
                let {chapterImages, chapterPath, pageImage} = func()
                let matches = pageImage.match(/^.*?\/\/(.*?)\//)
                let img_host = matches[0]
                let img_path = chapterPath
                let lenImg = chapterImages.length
                for (let i = 0; i < lenImg; i++) {
                    let src = img_host + img_path + chapterImages[i]
                    image_list.push(src)
                }
                // 破解结束
                Log.ctxInfo(ctx, `拉取结束 target_url ${target_url} 总计图片数 ${image_list.length}`)
                return image_list
            })
    }
}