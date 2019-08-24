import puppeteer from 'puppeteer'
import { APP_PATH, BROWSER } from '../../conf'
import Log from '../../tools/Log'

import { delay } from './Base'


const COMIC_ID_JMR = 5830; // 海贼王 https://m.manhuaniu.com/manhua/5830/
const HOST = 'https://m.manhuaniu.com';

class JieMoRen {

    /**
     * 获取主线查看地址
     */
    static async get_images_pages() {
        let comic_id = COMIC_ID_JMR
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        await page.goto(`${HOST}/manhua/${comic_id}/`);

        const info = await page.evaluate((comic_id, HOST) => {
            var doms = $("#chapter-list-1 li");
            var len = doms.length;
            var hrefs = [];
            var titles = [];
            var one_href = '';
            var one_title = '';

            for(var i = 0; i < len; i++) {
                one_href = doms.eq(i).find("a").attr("href")
                one_title = doms.eq(i).find("a").text().trim()
                hrefs.push(one_href);
                titles.push(one_title)
            }
            return {
                hrefs,
                titles,
                comic_id,
            };
        }, comic_id, HOST);
        browser.close();
        Log.log(info);
        return info;
    }

    static async get_images(link) {
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        try {
            await page.goto(link);

            let total = await page.evaluate(() => {
                var _total = $("#k_total").text()
                return _total
            });
            Log.log('总页数:' + total);

            let imgs = [];
            let link_len = link.length - 5;
            let _raw_link = link.substr(0, link_len)
            for(let i = 1,_link=""; i <= total; i++) {
                _link = `${_raw_link}-${i}.html`
                page.goto(_link)
                let img = await page.evaluate(() => {
                    var _img = $(".mip-fill-content.mip-replaced-content").attr("src")
                    return _img
                });
                imgs.push({
                    src: img,
                    sequence: i
                })
                delay(100)
            }
            Log.log('imgs:  '+ JSON.stringify(imgs))
            return imgs
        } catch(err) {
            Log.error(err);
        }

        // await browser.close();
    }
}
export default JieMoRen