// -----------------------------------------------
// 日志类
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

import fs from 'fs'
import { APP_PATH, LOG } from '../conf'
import General from './General'
import Bugjs from 'node-bugjs'
import TimeTool from "./TimeTool"; // Doc:  https://www.npmjs.com/package/node-bugjs
const Log = new Bugjs(LOG)

// 记录到日志
Log.storeHandler = (log) => {
    let logs = []
    for (let key in log) {
        switch (key) {
            case 'date':
                let real_date = General.format_time('Y-m-d h:i:s')
                log[key] = `[${real_date}]`;
                logs.push(log[key])
                break;
            default:
                break; // 暂无
        }

    }
    logs.push(' ')
    const file_path = APP_PATH + '/storage/log'
    const file_name = General.format_time('Y-m-d') + '.log'
    const target_file = file_path + '/' + file_name
    fs.appendFileSync(target_file, logs.concat(log.logs).join('') + '\n')
}

// 使用上下文
Log.ctxInfo = (ctx, content) => {
    Log.info(ctx.get_trace_id() + "  " + content);
}
Log.ctxError = (ctx, content) => {
    Log.error(ctx.get_trace_id() + "  " + content);
}
Log.ctxWarn = (ctx, content) => {
    Log.warn(ctx.get_trace_id() + "  " + content);
}

export default Log