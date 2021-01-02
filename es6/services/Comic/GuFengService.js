import Base from './Base'
import Log from "../../tools/Log";

const fetch = require('node-fetch'); // 文档 https://www.npmjs.com/package/node-fetch
const cheerio = require('cheerio'); // html解析器 文档 https://www.npmjs.com/package/cheerio

export default class GuFengService extends Base {
    /**
     * @return Promise
     */
    static async get_base_info(ctx, source_id) {
        Log.ctxInfo(ctx, `开始拉取 source_id ${source_id} 基本信息`)
        let target_url = `https://www.gufengmh8.com/manhua/${source_id}/`
        return fetch(target_url)
            .then(res => res.text())
            .then(html => {
                const $ = cheerio.load(html);
                let name = $(".book-title").find("span").text()
                let pic = $(".book-cover").find("img").attr("src")
                let intro = $("#intro-all").text().trim("")
                Log.ctxInfo(ctx,"数据如下", {name, pic, intro})
                Log.ctxInfo(ctx, `拉取结束 source_id ${source_id} 基本信息`)
                return {name, pic, intro}
            })
    }
}