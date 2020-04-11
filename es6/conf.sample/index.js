// ----------------------------------------------------------------------
// 公共基础配置
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

const APP_PATH = __dirname + '/../'

import General from '../tools/General'


/**
 * 无头浏览器配置
 */
const BROWSER = {
    // Chrmoe 应用路径
    executablePath: "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe", // windows 下
    // executablePath: "google-chrome", // linux 下
    // 设置超时时间
    timeout: 15000,
    // 如果是访问https页面 此属性会忽略https错误
    ignoreHTTPSErrors: true,
    // 打开开发者工具, 当此值为true时, headless总为false
    devtools: false,
    // 关闭headless模式, 不会打开浏览器
    headless: true
}

/**
 * 截图配置
 */
let SCREENSHOT = {
    path: APP_PATH + 'storage/imgs/' + General.uuid() + '.png',
    type: 'png',
    quality: 100, // 只对jpg有效
    fullPage: true,
    // 指定区域截图，clip和fullPage两者只能设置一个
    // clip: {
    //   x: 0,
    //   y: 0,
    //   width: 1000,
    //   height: 40
    // }
    args: [
        '–-disable-gpu',
        '–-disable-dev-shm-usage',
        '–-disable-setuid-sandbox',
        '–-no-first-run',
        '–-no-sandbox',
        '–-no-zygote',
        '–-single-process'
    ],
}


/**
 * 日志配置
 */
const LOG = {
    console: true, // 输出到命令行
    debug: true, // 显示是哪个文件哪行代码输出的
    bright: true, // 是否文字颜色高亮
    absolute: false, 
    date: true, // 是否显示 UTC 时间
    store: false, // 写入日志文件
    // this.console = val(options.console, true)
    // this.store = val(options.store, false)
    // this.categorie = options.categorie || this.categorie
    // this.categorieColor = options.categorieColor || 'blue'
    // this.debug = val(options.debug, process.env.NODE_ENV !== 'production')
    // this.absolute = val(options.absolute, false)
    // this.bright = val(options.bright, false)
    // this.date = val(options.date, false)
    // this.dateColor = options.dateColor || 'cyan'
    // this.filenameColor = options.filenameColor || 'gray'
    // this.callIndex = options.callIndex || 2
}

export {
    APP_PATH,
    BROWSER,
    SCREENSHOT,
    LOG
};