// ----------------------------------------------------------------------
// 队列任务基类
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
import General from '../../tools/General'

export default class BaseTask {
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
        new Promise(resolve => setTimeout(() => resolve(), ms));
    }
}
            