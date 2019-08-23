import puppeteer from 'puppeteer'
import { APP_PATH, BROWSER } from '../../conf'
import Log from '../../tools/Log'


const delay = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms));


const COMIC_ID_ONE_PIECE = 505430; // 海贼王 https://ac.qq.com/Comic/comicInfo/id/505430

class OnePiece {

    /**
     * 获取主线查看地址
     */
    static async get_images_pages(comic_id) {
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();
        await page.goto(`https://ac.qq.com/Comic/comicInfo/id/${comic_id}`);

        const info = await page.evaluate(() => {
            var doms = $(".works-chapter-item");
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
                "hrefs": hrefs,
                "titles": titles,
                "comic_id": comic_id,
            };
        });
        Log.log(info);
        return info;
    }

    static async get_images() {
        // 创建browser和page
        const browser = await puppeteer.launch(BROWSER);
        const page = await browser.newPage();

        // 捕获异常，保证browser.close()有效执行
        try {
            // 转到《海贼王》最新一话页面
            await page.goto('http://ac.qq.com/ComicView/chapter/id/505430/cid/915');

            // 获取图片数目和高度
            const imagesLen = await page.$$eval('#comicContain img[data-h]', imgs => imgs.length);
            const imgHeight = await page.$eval('#comicContain img[data-h]', img => img.getAttribute('data-h'));

            // 自动滚动，使懒加载图片加载
            const step = 1;
            for(let i = 1; i < imagesLen / step; i++) {
                await page.evaluate(`window.scrollTo(0, ${i * imgHeight * step})`);
                // 为确保懒加载触发，需要等待一下。实际需要的时间可能不止100ms
                await delay(100);
            }

            // 获取图片url
            const images = await page.$$eval('#comicContain img[data-h]', imgs => {
                const images = [];
                imgs.forEach(img => {
                    images.push(img.src);
                });
                return images;
            });
            log.log(images);
        } catch(err) {
            log.error(err);
        }

        // 关闭浏览器
        await browser.close();
    }
    static save_images_url(images, comic_id) {
        //
    }
}

OnePiece.get_images_pages(COMIC_ID_ONE_PIECE)
    .then((hrefs) => {
        console.log('获取成功---条数：' + hrefs.length);
    })
    .catch(exception => {
        Log.log('出现异常：Exception ')
        Log.log(exception)
    });;