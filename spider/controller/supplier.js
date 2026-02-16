// ----------------------------------------------------------------------
// 渠道相关控制
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Base from "./base";
import SentryTool from "../libs/Sentry/tool";
import HTTP_CODE from "../constant/http_code";
import SupplierLogic from "../logics/Open/SupplierLogic";
import General from "../tools/General";

export default class Supplier extends Base {
    static async list_by_ids(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let ids = General.get_data_with_default(http_ctx.request.query.ids, '') // 中间以 , 隔开
            if (!ids) {
                throw new Error("请传入 ids")
            }
            let id_list = ids.split(",")
            let list = await SupplierLogic.list_by_ids(ctx, id_list)
            response.data = {
                "list": list
            }
        } catch (error) {
            console.log(error)
            SentryTool.captureException(error)
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = 'failed!'
        }
        http_ctx.body = response
    }

    static async list_by_comic_id(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let comic_id = General.get_data_with_default(http_ctx.request.query.comic_id, 0)
            if (!comic_id) {
                throw new Error("请传入 comic_id")
            }
            let list = await SupplierLogic.list_by_comic_id(ctx, comic_id)
            let conf = SupplierLogic.comic_conf()
            response.data = {
                "list": list,
                "conf": conf,
            }
        } catch (error) {
            console.log(error)
            SentryTool.captureException(error)
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = 'failed!'
        }
        http_ctx.body = response
    }

    static async save_supplier_list_by_comic_id(http_ctx) {
        let {response, ctx} = Base.response_default_with_ctx()
        try {
            Base.require_client_name(http_ctx)
            let comic_id = General.get_data_with_default(http_ctx.request.body.comic_id, 0)
            let suppliers = General.get_data_with_default(http_ctx.request.body.suppliers, 0)
            if (comic_id <= 0) {
                throw new Error("请传入 comic_id")
            }
            await SupplierLogic.save_supplier_list_by_comic_id(ctx, comic_id, suppliers)
        } catch (error) {
            console.log(error)
            SentryTool.captureException(error)
            response.code = HTTP_CODE.BUSINESS_ERROR
            response.msg = 'failed!'
            response.msg = error.message
        }
        http_ctx.body = response
    }


}

