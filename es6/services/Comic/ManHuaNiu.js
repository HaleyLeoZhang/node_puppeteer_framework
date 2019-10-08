import puppeteer from 'puppeteer'
import { BROWSER } from '../../conf'
import Log from '../../tools/Log'
import Base from './Base'
import { 
    FIELD_METHOD, FIELD_IS_COMPLETE 
} from '../../models/Comic/Comic'

const HOST = 'https://www.manhuaniu.com' // 漫画牛，爬取章节简单一些
const HOST_H5 = 'https://m.manhuaniu.com' // 漫画牛，爬取图片方式简单一些

class ManHuaNiu extends Base {
    /**
     * 获取主线查看地址
     */
    static async get_images_pages(one_comic) {
        const _this = this;
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        let info = { hrefs: [], titles: [], source_id: one_comic.source_id }
        let detail = null
        try {
            page.setUserAgent(_this.get_fake_ua());
            await page.goto(`${HOST}/manhua/${one_comic.source_id}/`);
            // Log.log('start');
            if(
                FIELD_METHOD.AUTO == one_comic.method &&
                FIELD_IS_COMPLETE.NO == one_comic.is_complete
            ) {
                detail = await page.evaluate(() => {
                    var name = $(".book-title h1 span").eq(0).text();
                    var intro = $("#intro-cut p").eq(0).text().trim();
                    var pic = $(".pic").attr("src");
                    return { name, intro, pic }
                });
                Object.assign(detail, { "is_complete": FIELD_IS_COMPLETE.YES })
            }

            info = await page.evaluate((source_id, type_id) => {
                var doms = $("#chapter-list-" + type_id + " li");
                var len = doms.length;
                var hrefs = [];
                var titles = [];
                var one_href = '';
                var one_title = '';

                for(let i = 0; i < len; i++) {
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
            Log.log('info---', info);

        } catch(err) {
            await browser.close();
            throw err
        }
        Object.assign(info, { detail })
        browser.close();
        // Log.log(info);
        return info;
    }

    static async get_images(link) {
        const _this = this;
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();

        let imgs = [];

        try {
            if(null === link.match(/^http/)){
                link = HOST_H5 + link
            }

            await page.goto(link)
            Log.log('link: ' + link);
            page.setUserAgent(_this.get_fake_ua());

            let total = await page.evaluate(() => {
                var _total = $("#k_total").text()
                return _total
            });
            // Log.log('总页数:' + total);

            let link_len = link.length - 5;
            let _raw_link = link.substr(0, link_len)
            for(let i = 1, _link = ""; i <= total; i++) {
                _link = `${_raw_link}-${i}.html`
                await page.goto(_link)
                page.setUserAgent(_this.get_fake_ua());
                let img = await page.evaluate(() => {
                    var _img = $(".mip-fill-content.mip-replaced-content").attr("src")
                    return _img
                });
                imgs.push(img)
                // await this.delay_ms(100)
            }
            // Log.log('imgs:  ' + JSON.stringify(imgs))
        } catch(err) {
            await browser.close();
            throw err
        }
        await browser.close();
        return imgs

    }
}

export default ManHuaNiu