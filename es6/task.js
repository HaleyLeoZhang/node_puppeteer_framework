// ----------------------------------------------------------------------
// 任务 - 程序入口
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import Register from './libs/Register'
// 待注册模块列表
import ManhuaNiuTask from './cli/Task/ManhuaNiuTask'
import ManhuaNiuTaskTest from "./cli/Task/ManhuaNiuTaskTest";

const app = new Register()
app.bootstrap()
    // 注册模块，调用的模块方法，都得是 async
    .use('mhn', ManhuaNiuTask) // 调用示例 node ./task.js mhn queue
    .use('mhn_test', ManhuaNiuTaskTest) // 调用示例 node ./task.js mhn_test push_one
    .run()