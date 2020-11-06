import General from './General'
// -----------------------------------------------
//     简单上下文库
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

const KEY_TRACE_ID = "trace_id" // 链路ID


export default class ContextTool {
    constructor(){
        this.data_bucket = new Object()
        this.time_bucket = new Object()
        this.is_cancel = false // 是否已取消 TODO
    }
    /**
     * 初始化需要注入的上下文信息
     * @return string
     */
    static initial() {
        let ctx = new this();
        ctx = ContextTool.with_value(ctx, KEY_TRACE_ID, General.uuid());
        return ctx;
    }
    // 设置 key
    static with_value(ctx, key, value) {
        let ctx_new = new this();
        // 深拷贝
        // - 数据
        let str_data_bucket = JSON.stringify(ctx.data_bucket)
        let new_data_object = JSON.parse(str_data_bucket)
        // - 时间
        let str_time_bucket = JSON.stringify(ctx.time_bucket)
        let new_time_bucket = JSON.parse(str_time_bucket)

        new_data_object[key] = value
        new_time_bucket[key] = parseInt((new Date()).getTime() /1000) // 记录时间戳
        // 切换到新的上下文
        ctx_new.data_bucket = new_data_object
        ctx_new.time_bucket = new_time_bucket
        return ctx_new
    }
    // 获取 key 对应的值
    get_value(key) {
        let ctx = this
        let current_value = ctx.data_bucket[key]
        if (undefined == current_value) {
            return ""
        }
        return current_value
    }
    // 最后一次设置对应 key 的时间
    get_value_time(key) {
        let ctx = this
        let current_value = ctx.time_bucket[key]
        if (undefined == current_value) {
            return ""
        }
        return current_value
    }
    // 获取 trace_id 对应的值
    get_trace_id() {
        let ctx = this
        return ctx.get_value(KEY_TRACE_ID)
    }
}