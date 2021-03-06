// ----------------------------------------------------------------------
// http - 程序入口
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------


const HTTP_PORT = 7070; // 设置 http 服务的端口

import * as Koa from 'koa'
import * as KoaCors from 'koa2-cors'
import * as BodyParser from 'koa-bodyparser'
import * as RouterTool from 'koa-router'
import Notify from "./controller/notify";
import Supplier from "./controller/supplier";

const app_router = RouterTool.default()
const app_cors = KoaCors.default()
const app_body_parser = BodyParser.default()
const app = new Koa.default()

// 路由注册 ---- START
app_router.get('/notify/sub', Notify.sub)
app_router.get('/supplier/list_by_ids', Supplier.list_by_ids)
app_router.get('/supplier/list_by_comic_id', Supplier.list_by_comic_id)
// 路由注册 ---- END

app.use(app_cors)
app.use(app_body_parser)
app.use(app_router.routes()).use(app_router.allowedMethods())

console.log("Listening node HTTP server Port on ", HTTP_PORT)
app.listen(HTTP_PORT)
