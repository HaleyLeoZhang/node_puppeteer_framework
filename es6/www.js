// ----------------------------------------------------------------------
// http - 程序入口 ----- TODO
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

// 待注册模块列表
import TaskLogic from "./logics/ComicCurl/TaskLogic";
import ContextTool from "./tools/ContextTool";

const HTTP_PORT = 7070;

import * as Koa from 'koa'
import * as KoaCors from 'koa2-cors'
import * as BodyParser from 'koa-bodyparser'
import * as RouterTool from 'koa-router'

const app_router = RouterTool.default()
const app_cors = KoaCors.default()
const app_body_parser = BodyParser.default()
const app = new Koa.default()

// const Koa = require('koa');
// const cors = require('koa2-cors');
// const body_parser = require('koa-bodyparser')
// const app = new Koa();
// const app_router = require('koa-router')();

/**
 * 通知开始对应漫画的爬虫
 * - 2021年1月30日 22:51:00 方便调用，直接 get 请求，本次不使用 post
 */
app_router.get('/notify_sub/do', async (http_ctx) => {
    let response = {
        'code': 0, // 错误码
        'msg': 'success', // 错误信息
        'data': null, // 返回外部所需数据，这一层以 JSON 格式返回
    }
    try {
        let ctx = ContextTool.initial()
        let comic_id = http_ctx.request.query.comic_id || '';
        if (!comic_id) {
            comic_id = undefined
        }

        await TaskLogic.notify_sub(ctx, comic_id)
    } catch (error) {
        console.log(error)
        response.code = 500
        response.msg = error.message
    }
    http_ctx.body = response
})

app.use(app_cors)
app.use(app_body_parser)
app.use(app_router.routes()).use(app_router.allowedMethods())

console.log("Listening node HTTP server Port on ", HTTP_PORT)
app.listen(HTTP_PORT)
