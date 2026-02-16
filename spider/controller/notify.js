// ----------------------------------------------------------------------
// 通知爬虫相关控制
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import TaskLogic from "../logics/ComicCurl/TaskLogic";
import Base from "./base";
import SentryTool from "../libs/Sentry/tool";
import HTTP_CODE from "../constant/http_code";
import General from "../tools/General";

export default class Notify extends Base {
    /**
     * 通知开始对应漫画的爬虫
     * - 2021年1月30日 22:51:00 方便调用，直接 get 请求，本次不使用 post
     */
    static async sub(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let comic_id = General.get_data_with_default(http_ctx.request.query.comic_id, 0)
            if (!comic_id) {
                comic_id = undefined
            }

            await TaskLogic.notify_sub(ctx, comic_id)
        } catch (error) {
            console.log(error)
            SentryTool.captureException(error)
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = 'failed!'
        }
        http_ctx.body = response
    }
}