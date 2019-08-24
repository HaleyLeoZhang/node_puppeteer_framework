// ----------------------------------------------------------------------
// 程序入口，注册功能模块
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import Register from './libs/Register'
// 带注册模块列表
import ComicCurl from './cli/ComicCurl'

const app = new Register()
app.bootstrap()
    // 注册模块，调用的模块方法，都得是 async
    .use('comic', ComicCurl) // 调用示例 node ./app.js  comic start_mhn
    .run()