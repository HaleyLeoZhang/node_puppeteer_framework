// -----------------------------------------------
// 日志类
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

// 原装文档 https://github.com/winstonjs/winston
// 日期插件 文档地址 https://github.com/winstonjs/winston-daily-rotate-file
import *  as  winston from 'winston';
import 'winston-daily-rotate-file';
import General from "./General";


export default class Log {
    static IniConfig(is_debug, log_path) {
        // 没有配置日志，则直接认定为调试模式
        if (log_path === "") {
            this.open = false
        } else {
            this.open = true // true 表示允许写入日志文件
            this.debug = is_debug
            const transport = new winston.transports.DailyRotateFile({
                filename: log_path,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '20m',
                maxFiles: '7d'
            });
            this.logger = winston.createLogger({
                transports: [
                    transport
                ]
            });
        }
    }

    static getContent(ctx, content) {
        return General.format_time('Y-m-d h:i:s') + "  " + ctx.get_trace_id() + "  " + content
    }

    static log(content) {
        let message = General.format_time('Y-m-d h:i:s') + "  " + content
        if (this.debug) {
            console.log(message)
        } else if (this.open) {
            this.logger.log('info', message)
        }
    }

    static ctxInfo(ctx, content) {
        let message = Log.getContent(ctx, content)
        if (this.debug) {
            console.log(message)
        } else if (this.open) {
            this.logger.log('info', message)
        }
    }

    static ctxWarn(ctx, content) {
        let message = Log.getContent(ctx, content)
        if (this.debug) {
            console.warn(message)
        } else if (this.open) {
            this.logger.warn(message);
            this.logger.log('Warn', message)
        }
    }

    static ctxError(ctx, content) {
        let message = Log.getContent(ctx, content)
        if (this.debug) {
            console.error(message)
        } else if (this.open) {
            this.logger.log('Error', message)
        }
    }
}
