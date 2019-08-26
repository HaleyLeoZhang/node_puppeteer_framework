import puppeteer from 'puppeteer'
import { BROWSER } from '../../conf'
import Log from '../../tools/Log'
import Base from './Base'

const HOST = 'https://m.manhuaniu.com'; // 漫画牛

class ManHuaNiu extends Base {
    /**
     * 获取主线查看地址
     */
    static async get_images_pages(comic_id) {
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        let info = {hrefs:[], titles:[], comic_id}
        try {
            await page.goto(`${HOST}/manhua/${comic_id}/`);
            // Log.log('start');

            info = await page.evaluate((comic_id, HOST) => {
                let doms = $("#chapter-list-1 li");
                let len = doms.length;
                let hrefs = [];
                let titles = [];
                let one_href = '';
                let one_title = '';

                for(let i = 0; i < len; i++) {
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
        } catch(err) {
            await browser.close();
            throw err
        }
        browser.close();
        // Log.log(info);
        return info;
    }

    static async get_images(link) {
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();

        let imgs = [];

        try {
            await page.goto(link);

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
                let img = await page.evaluate(() => {
                    var _img = $(".mip-fill-content.mip-replaced-content").attr("src")
                    return _img
                });
                imgs.push(img)
                await this.delay_ms(100)
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