// -----------------------------------------------
// 获取各种配置
// -----------------------------------------------

const APP_PATH = __dirname + '/../'

import General from '../tools/General'


/**
 * 无头浏览器配置
 */
const BROWSER = {
    // 若是手动下载的chromium需要指定chromium地址, 默认引用地址为 /项目目录/node_modules/puppeteer/.local-chromium/
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    // 设置超时时间
    timeout: 15000,
    // 如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: false
}

/**
 * 截图配置
 */
let SCREENSHOT = {
    // path: APP_PATH + 'storage/imgs/' + General.uuid() + '.png',
    type: 'png',
    // quality: 100, 只对jpg有效
    fullPage: true,
    // 指定区域截图，clip和fullPage两者只能设置一个
    // clip: {
    //   x: 0,
    //   y: 0,
    //   width: 1000,
    //   height: 40
    // }
}


/**
 * 日志配置
 */
const LOG = {
    console: true,
    debug: true,
    bright: true,
    date: true,
}

export {
    APP_PATH,
    BROWSER,
    SCREENSHOT
};