import HTTP_CODE from "../constant/http_code";
import ContextTool from "../tools/ContextTool";

export default class Base {
    static response_default() {
        let response = {
            'code': HTTP_CODE.SUCCESS, // 错误码
            'msg': 'success', // 错误信息
            'data': null, // 返回外部所需数据，这一层以 JSON 格式返回
        }
        return response
    }

    static response_default_with_ctx() {
        let response = Base.response_default()
        let ctx = ContextTool.initial()
        return {response, ctx}
    }

    static require_client_name(http_ctx) {
        let client_name = http_ctx.request.query.client_name;
        if (!client_name) {
            throw new Error("请传入 client_name")
        }
    }
}
