import puppeteer from 'puppeteer'
import General from '../tools/General'
import { APP_PATH,BROWSER, SCREENSHOT } from '../conf'
import Log from '../tools/Log'

class getHaleyLeoZhangWeb {
    static async get_web() {
        Log.log('-----爬取开始-----')
        const browser = await (puppeteer.launch(BROWSER))
        const page = await browser.newPage()
        await page.goto('http://www.hlzblog.top/')

        const save_imgs_path =  APP_PATH + 'storage/imgs/' + General.uuid() + '.png'
        Object.assign(SCREENSHOT, {path:save_imgs_path,})
        await page.screenshot(SCREENSHOT);
        browser.close();
    }
}
// getHaleyLeoZhangWeb.get_web()
//     .catch(exception => {
//         Log.log('出现异常：Exception ')
//         Log.log(exception)
//     });

export default getHaleyLeoZhangWeb