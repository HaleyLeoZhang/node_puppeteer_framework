import puppeteer from 'puppeteer'
import { BROWSER } from '../../conf'
import Log from '../../tools/Log'
import Base from './Base'
import {
    FIELD_METHOD,
    FIELD_IS_COMPLETE,
} from '../../models/CurlAvatar/Comic/Enum'
import TimeTool from "../../tools/TimeTool";
import UserAgentTool from "../../tools/UserAgentTool";

const HOST = 'https://www.manhuaniu.com' // 漫画牛，爬取章节简单一些
const HOST_H5 = 'https://m.manhuaniu.com' // 漫画牛，爬取图片方式简单一些

const EDGE_IMAGE_LEN = 20 // 超过图片数量,则减缓翻页速度
const EDGE_DELAY_TIME = 500 // 推迟翻页时间.单位,毫秒

export default class GuFengService extends Base {_
    /**
     * 获取章节列表信息
     */
    static async get_page_list(ctx, one_comic) {
        const _this = this;
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        let info = { hrefs: [], titles: [], source_id: one_comic.source_id }
        let detail = null
        try {
            await page.setUserAgent(_this.get_fake_ua());
            await page.goto(`${HOST}/manhua/${one_comic.source_id}/`);
            if (
                FIELD_METHOD.AUTO === one_comic.method &&
                FIELD_IS_COMPLETE.NO === one_comic.is_complete
            ) {
                detail = await page.evaluate(() => {
                    var name = $(".book-title h1 span").eq(0).text();
                    var intro = $("#intro-cut p").eq(0).text();
                    var pic = $(".pic").attr("src");
                    return { name, intro, pic }
                });
                Log.ctxInfo(ctx, "detail  " + JSON.stringify(detail))
                Object.assign(detail, { "is_complete": FIELD_IS_COMPLETE.YES })
            }

            let spider_info = await page.evaluate((source_id, type_id) => {
                var doms = $("#chapter-list-" + type_id + " li");
                var len = doms.length;
                var hrefs = [];
                var titles = [];
                var one_href = '';
                var one_title = '';

                for (let i = 0; i < len; i++) {
                    one_href = doms.eq(i).find("a").attr("href")
                    one_title = doms.eq(i).find("a").text().trim()
                    hrefs.push(one_href);
                    titles.push(one_title)
                }
                return {
                    hrefs,
                    titles,
                    source_id,
                };
            }, one_comic.source_id, one_comic.ext_1);
            info.hrefs = spider_info.hrefs
            info.titles = spider_info.titles
            info.source_id = spider_info.source_id
            Log.log('info---', info);

        } catch (err) {
            await browser.close();
            throw err
        }
        Object.assign(info, { detail })
        browser.close();
        // Log.log(info);
        return info;
    }

    /**
     * 获取图片列表信息
     * @param string link 待爬取的站内链接
     * @return array
     */
    static async get_image_list(link) {
        const _this = this;
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();

        let imgs = [];

        try {
            if (null === link.match(/^http/)) {
                link = HOST_H5 + link
            }

            let log_prefix = 'ManHuaNiuService.get_image_list.link ' + link;
            Log.info(log_prefix, 'doing');
            await page.goto(link)
            await page.setUserAgent(UserAgentTool.fake_one());

            let total = await page.evaluate(() => {
                var _total = $("#k_total").text()
                return _total
            });
            Log.info(log_prefix, 'total', total);

            let link_len = link.length - 5;
            let _raw_link = link.substr(0, link_len)
            for (let i = 1, _link = ""; i <= total; i++) {
                _link = `${_raw_link}-${i}.html`
                await page.goto(_link)
                await page.setUserAgent(UserAgentTool.fake_one());
                let img = await page.evaluate(() => {
                    var _img = $(".mip-fill-content.mip-replaced-content").attr("src")
                    return _img
                });
                imgs.push(img)
                if (total > EDGE_IMAGE_LEN) {
                    await TimeTool.delay_ms(EDGE_DELAY_TIME)
                }
            }
            Log.info(log_prefix, 'done');
        } catch (err) {
            await browser.close();
            throw err
        }
        await browser.close();
        return imgs
    }
}