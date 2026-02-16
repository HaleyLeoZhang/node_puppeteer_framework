// -----------------------------------------------
//     公共工具库
// -----------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// -----------------------------------------------

export default class General {
    /**
     * 获取UUID
     * @return string
     */
    static uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        let uuid = s.join("");
        return uuid;
    }

    /**
     * 获取格式化后的时间
     * - 如： format_time("Y-m-d h:i:s") 输出 2017-12-11 22:46:11
     * @param string str 待格式化的时间
     * @param int timestamp 指定的时间戳，不填，则显示为当前的时间
     * @return string
     */
    static format_time(str, timestamp) {
        timestamp = timestamp === undefined ? 0 : timestamp;
        timestamp = parseInt(timestamp) * 1000;
        let date = timestamp === 0 ? new Date() : new Date(timestamp);
        const add_zero = (num) => {
            if (num <= 9) {
                return "0" + num;
            } else {
                return "" + num + "";
            }
        };
        let Y, m, d, h, i, s;
        Y = date.getFullYear();
        m = add_zero(date.getMonth() + 1);
        d = add_zero(date.getDate());
        h = add_zero(date.getHours());
        i = add_zero(date.getMinutes());
        s = add_zero(date.getSeconds());
        str = str.replace("Y", Y);
        str = str.replace("m", m);
        str = str.replace("d", d);
        str = str.replace("h", h);
        str = str.replace("i", i);
        str = str.replace("s", s);
        return str;
    }

    /**
     * 获取随机整数数
     * @param int min 随机数的最小值
     * @param int max 随机数的最大值
     * @return int
     */
    static mt_rand(min, max) {
        return parseInt(Math.random() * (max - min + 1) + min, 10);
    }    /**
     * 判断一个字符串是不是json字符串
     *
     * @param string str 字符串
     * @return bool
     */
    /**
     * 判断是否为json字符串
     * @param string str 字符串
     * @return boolean
     */
    static is_json(str) {
        if (typeof str == 'string') {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                // console.log(e);
                return false;
            }
        }
        return false
    }

    static get_data_with_default(input, output_default) {
        if (typeof input === "undefined" || input == null) {
            return output_default
        }
        return input
    }
}