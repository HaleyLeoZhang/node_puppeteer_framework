// -----------------------------------------------
//     时间工具
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

import General from './General'

export default class TimeTool {
    /**
     * 指定随机延迟毫秒数
     * - 防止消费过快
     *
     * @param int ms 计划延迟的毫秒数
     * @return Promise
     */
    static delay_rand_ms(from, to) {
        return this.delay_ms(General.mt_rand(from, to));
    }
    /**
     * 延迟时间
     *
     * @param int ms 计划延迟的毫秒数
     * @return Promise
     */
    static delay_ms(ms) {
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    /**
     * 秒级当前时间戳
     *
     * @param int ms 计划延迟的毫秒数
     * @return int
     */
    static timestamp() {
        let time = (new Date()).getTime();
        return parseInt(time / 1000) // 毫秒转秒数
    }
}