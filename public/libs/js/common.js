// ----------------------------------------------------------------------
// 公共模块
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
(function ($, window, undefined) {
    'use strict';
    var HOST = 'http://puppeteer.hlzblog.top'; // 生产环境
    // var HOST = 'http://puppeteer.test.com'; // 本地环境

    function Comic_Common() {
        this.scroll_tolerant_rate = 0.2 // 容差比率（主要为了兼容一些刘海屏）
        this.loading_img = "https://i.loli.net/2019/09/05/YPu62erGMa3l1IE.gif"
        // API列表---可跨域
        this.api = {
            comic_list: HOST + '/api/comic/list', // 漫画列表
            chapter_list: HOST + '/api/chapter/list', // 章节列表
            chapter_detail: HOST + '/api/chapter/detail', // 章节详情
            image_list: HOST + '/api/image/list', // 图片列表
        };
        // 页面列表
        this.comic_html = {
            comic: "./index.html",
            image: "./image_list.html",
            chapter: "./chapter_list.html",
        }

        this.load_switch = 'on'; // 加载层
        this.load_target = 'body'; // 加载层目标ID
        // this.page_load_index = 0; // 加载层索引号

        this.page_lock = false; // 下拉加载,锁

        this.storage_engine = 'session'; // local || session
    }

    window.ComicCommon = new Comic_Common();

    // API数据模型

    /**
     * 封装下拉加载 Ajax
     * @param string api 接口地址
     * @param json param http入参
     * @param callable callback 获取ajax后的回调,会被注入回调list数据
     */
    Comic_Common.prototype.get_list = function (api, param, callback) {
        var _this = this;

        if (_this.page_lock) {
            return
        }
        _this.page_lock = true

        _this.loading_layer('open')

        $.ajax({
            'url': api,
            'type': 'get',
            'data': param,
            'success': function (res) {
                if (200 == res.code) {
                    callback(res.data.list)
                } else {
                    layer.alert(res.message)
                }
                _this.loading_layer('close')
                _this.page_lock = false
            },
            'error': function () {
                _this.loading_layer('close')
                _this.page_lock = false
            }
        });
    };

    /**
     * 封装单条数据
     * @param string api 接口地址
     * @param json param http入参
     * @param callable callback 获取ajax后的回调,会被注入回调data数据
     */
    Comic_Common.prototype.get_info = function (api, param, callback) {
        var _this = this;
        $.ajax({
            'url': api,
            'type': 'get',
            'data': param,
            'success': function (res) {
                if (200 == res.code) {
                    callback(res.data)
                } else {
                    layer.alert(res.message)
                }
            },
        });
    };

    // 用户体验优化

    /**
     * 加载层
     */
    Comic_Common.prototype.loading_layer = function (action) {
        var _this = this;

        if ('on' == this.load_switch) {
            switch (action) {
                case 'open':
                    var loading_tpl = `
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                `
                    var is_exists = Boolean(document.getElementsByClassName('spinner').length)
                    if (is_exists) {
                        $('.spinner').show()
                    } else {
                        $(_this.load_target).append(loading_tpl)
                    }
                    // _this.page_load_index = layer.load(0, { shade: [0.5, '#fff'] });
                    break;
                case 'close':
                    $('.spinner').hide()
                    // layer.close(_this.page_load_index);
                    break;
                default:
                    throw new Error("入参错误: 供选择的入参 open 、 close");
            }
        }
    };

    /**
     * 到页底触发回调
     * @param callable callback 回调功能
     */
    Comic_Common.prototype.reach_page_bottom = function (callback) {
        var _this = this;
        $(window).on("scroll touchmove", function () {
            var scroll = parseInt(document.documentElement.scrollTop || document.body.scrollTop);
            // - 计算当前页面高度
            var tag_position = document.body.scrollHeight;
            var now = scroll + document.documentElement.clientHeight * (1 + _this.scroll_tolerant_rate);
            if (now >= tag_position) {
                callback()
            }
        })
    };

    // 本地缓存

    /**
     * 设置存储引擎对象
     */
    Comic_Common.prototype.cache_set_engine = function (storage_engine) {
        this.storage_engine = storage_engine
    };

    /**
     * 返回存储引擎对象
     * @return localStorage || sessionStorage
     */
    Comic_Common.prototype.cache_get_engine = function () {
        switch (this.storage_engine) {
            case 'local':
                return window.localStorage
            case 'session':
                return window.sessionStorage
            default:
                throw new Error('存储引擎输入错误')
        }
    };

    /**
     * 本地数据缓存-注意 2.5M 存储上限
     * @return bool
     */
    Comic_Common.prototype.cache_data_set = function (cache_name, cache_data, ttl) {
        var engine = this.cache_get_engine()
        try {
            if (engine) {
                // Set
                var time = parseInt(
                    (new Date().getTime()) / 1000
                );
                var expire_at = time + ttl;
                var new_data = {
                    cache_data,
                    expire_at
                }
                engine.setItem(cache_name, JSON.stringify(new_data));
                return true;
            } else {
                throw new Error("不支持当前存储方案")
            }
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                console.warn('缓存存储失败信息:', '超出本地存储限额,即将清空本地所有此种缓存');
                engine.clear();
            } else {
                console.warn('缓存存储失败信息:', e.message)
            }
            return false
        }
    };
    /**
     * 本地数据缓存-注意 2.5M 存储上限
     * @return Object
     */
    Comic_Common.prototype.cache_data_get = function (cache_name) {
        var engine = this.cache_get_engine()
        try {
            if (engine) {

                var old_data = engine.getItem(cache_name);
                if (!old_data) {
                    // throw new Error("缓存失效") 
                    return null
                }
                old_data = JSON.parse(old_data);

                var current_time = parseInt(
                    (new Date().getTime()) / 1000
                );
                if (current_time > old_data.expire_at) {
                    engine.removeItem(cache_name);
                    throw new Error("缓存过期")
                }
                return old_data.cache_data
            } else {
                throw new Error("不支持当前存储方案")
            }
        } catch (e) {
            console.warn('错误信息:', e.message)
            return null
        }
    };

    // 工具

    Comic_Common.prototype.json_to_query = function (json) {
        return Object.keys(json).map(function (key) {
            // body...
            return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
        }).join("&");
    }

    /**
     * 获取 get 参数
     */
    Comic_Common.prototype.query_param = function (param_name) {
        var reg = new RegExp('(^|&)' + param_name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return '';
    }

    /**
     * 获取格式化后的时间
     * - 如： format_time("Y-m-d h:i:s") 输出 2017-12-11 22:46:11
     * @param string str 待格式化的时间
     * @param int timestamp 指定的时间戳，不填，则显示为当前的时间
     * @return string
     */
    Comic_Common.prototype.format_time = function (str, timestamp) {
        timestamp = timestamp === undefined ? 0 : timestamp;
        timestamp = parseInt(timestamp) * 1000;
        var date = timestamp === 0 ? new Date() : new Date(timestamp);

        function add_zero(num) {
            if (num <= 9) {
                return "0" + num;
            } else {
                return "" + num + "";
            }
        };
        var Y, m, d, h, i, s;
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
    };

    // 设置页足
    Comic_Common.prototype.ini_footer = function () {
        var _this = this
        var year = _this.format_time('Y');
        var footer_html = `
        <div class="g_footer">
            <div class="g_container">
                <p class="feedback">
                    信息反馈，请联系邮箱 <a href="mailto:hlzblog@vip.qq.com">hlzblog@vip.qq.com</a>
                </p>
                <p>
                    Copyright&nbsp;&copy; 2019-<span id="date_ch">${year}</span>&nbsp;HaleyLeoZhang All Rights Reserved
                </p>
                <p>
                    版权&nbsp;&copy; 2019-<span id="date_en">${year}</span>&nbsp; HaleyLeoZhang 版权所有
                </p>
                <p>
                    <a style="color:#437373;" target="_blank" rel="nofollow" href="http://beian.miit.gov.cn/">鲁ICP备16014994号</a>
                </p>
            </div>
        </div>
        `
        $("body").append(footer_html)
    };

    // 配置前端异常捕获服务
    // - 当前 https://cdn.staticfile.org/raven.js/3.9.2/raven.min.js CDN备份 https://cdn.ravenjs.com/3.19.1/raven.min.js  备份 ./libs/js/plugin/raven.min.js
    Comic_Common.prototype.ini_sentry = function () {
        Raven.config('https://abe5d01a283f419c84463cc99e27161d@o481346.ingest.sentry.io/5778330').install()
    }

    // 初始化页面时运行
    Comic_Common.prototype.initial_page = function () {
        var _this = this
        _this.ini_footer()
        _this.ini_sentry()
    }

})(jQuery, window);