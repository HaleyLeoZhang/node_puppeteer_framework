// ----------------------------------------------------------------------
// 命令行入口-注册服务
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------

import Log from '../tools/Log'
import * as yaml from 'js-yaml'
import * as  fs from 'fs';

const DEFAULT_CONFIG_PATH = '/app/app.yaml' // 配置文件默认位置

export default class Register {
    // 读取配置文件
    read_config(ars) {
        let config_path = DEFAULT_CONFIG_PATH
        for let i = 0, len_ars = ars.length; i < len_ars; i++{
            let one = ars[i]
            let res_config = one.match(/--conf=(.*)"/i)
            if (res_config !== null) {
                config_path = res_config[1].trim(" ")
            }
        }
        // TODO 读取配置文件
        try {
            const doc = yaml.load(fs.readFileSync(config_path, 'utf8'));
            console.log(doc);
        } catch (e) {
            console.log("读取配置文件失败");
            console.log(e);
        }
        // TODO 载入配置文件
    }

    // 初始化
    bootstrap() {
        const ars = process.argv

        this.read_config(ars)

        this.load_module = undefined === ars[2] ? undefined : ars[2];
        this.load_action = undefined === ars[3] ? undefined : ars[3];

        this.resgist_list = {}
        return this
    }

    // 注册
    use(___alias, ___module) {
        this.resgist_list[___alias] = ___module
        return this;
    }

    // 检测模块
    get_action() {
        const run_module = this.resgist_list[this.load_module]
        if (undefined === run_module) {
            Log.log(this.load_module + ' 模块---不存在')
        }
        const run_action = run_module[this.load_action]
        if (undefined === run_action) {
            Log.log(this.load_action + ' 方法---不存在')
        }
        return run_action
    }

    // 启动
    run() {
        const program = this.get_action()
        Log.log('--------START--------')
        Log.log('正在调用---模块 ' + this.load_module + '---方法---' + this.load_action)
        program().then(() => {
            Log.log('---------END---------')
            process.exit()
        }).catch(err => {
            Log.error('Exception: ', err.stack)
            process.exit()
        })

    }
}