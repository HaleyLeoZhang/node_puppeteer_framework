// ----------------------------------------------------------------------
// 调试阶段 - 程序入口
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import Register from './libs/Register'
// 待注册模块列表
// import Test from './cli/Test'
import ComicTaskTest from "./cli/Task/ComicTaskTest";

const app = new Register()
app.bootstrap()
    // 注册模块，调用的模块方法，都得是 async
    // .use('test', Test) // 调用示例 node ./app.js  test sql
    .use('comic_test', ComicTaskTest) // 调用示例 node ./es5/app.js comic_test eval_script
    .run()