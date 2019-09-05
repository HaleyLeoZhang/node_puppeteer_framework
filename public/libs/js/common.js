// ----------------------------------------------------------------------
// 公共模块
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
(function ($, window, undefined) {
    'use strict';

    function Comic_Common() {
        // API列表---可跨域
        this.api = {
            comic_list: 'http://puppeteer.hlzblog.top/api/comic/comic_list', // 漫画列表
            page_list: 'http://puppeteer.hlzblog.top/api/comic/page_list', // 漫画章节列表
            image_list: 'http://puppeteer.hlzblog.top/api/comic/image_list', // 漫画章节对应图片列表
        };

        this.load_switch = 'on'; // 加载层
        this.page_load_index = 0; // 加载层索引号
    }
    window.ComicCommon = new Comic_Common();

    /**
     * 封装 Ajax
     * @param string api 接口地址
     * @param json param http入参
     * @param callable callback 获取ajax后的回调,会被注入回调列表数据 
     */
    Comic_Common.prototype.get_list = function (api, param, callback) {
        var _this = this;

        _this.loading_layer('open')

        $.ajax({
            'url': api,
            'type': 'get',
            'data': param,
            'success': function (res) {
                if(200 == res.code) {
                    callback(res.data.list)
                } else {
                    layer.alert(res.message)
                }
                _this.loading_layer('close')
            },
            'error': function () {
                _this.loading_layer('close')
            }
        });
    };

    /**
     * 加载层
     */
    Comic_Common.prototype.loading_layer = function (action) {
        var _this = this;

        if('on' == this.load_switch) {
            switch(action) {
            case 'open':
                _this.page_load_index = layer.load(0, { shade: [0.5, '#fff'] });
                break;
            case 'close':
                layer.close(_this.page_load_index);
                break;
            default:
                throw new Error("入参错误: 供选择的入参 open 、 close");
            }
        }
    };

    /**
     * lazy load
     */
    Comic_Common.prototype.image_lazy_load = function () {
        // Achieve lazy load
        $('.lazy_pic').lazyload({
            effect: 'fadeIn',
            threshold: 200,
            failurelimit: 10,
            placeholder: '../img/common_loading.gif',
            data_attribute: 'original', // data-original属性
        });

    };

    // 本地缓存

    /**
     * 本地数据缓存-注意 2.5M 存储上限
     * @return bool
     */
    Comic_Common.prototype.data_cache_set = function (cache_name, cache_data, ttl) {
        try {
            if(window.localStorage) {
                // Set
                var time = parseInt(
                    (new Date().getTime()) / 1000
                );
                var expire_at = time + ttl;
                var new_data = {
                    cache_data,
                    expire_at
                }
                localStorage.setItem(cache_name, JSON.stringify(new_data));
                return true;
            } else {
                throw new Error("不支持 localStorage")
            }
        } catch(e) {
            if(e.name === 'QuotaExceededError') {
                console.warn('缓存存储失败信息:', '超出本地存储限额,即将清空本地所有此种缓存');
                localStorage.clear();
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
    Comic_Common.prototype.data_cache_get = function (cache_name) {
        try {
            if(window.localStorage) {

                var old_data = localStorage.getItem(cache_name);
                if(!old_data) {
                    throw new Error("缓存失效")
                }
                old_data = JSON.parse(old_data);

                var current_time = parseInt(
                    (new Date().getTime()) / 1000
                );
                if(current_time > old_data.expire_at) {
                    localStorage.removeItem(cache_name);
                    throw new Error("缓存过期")
                }
                return old_data
            } else {
                throw new Error("不支持 localStorage")
            }
        } catch(e) {
            console.warn('错误信息:', e.message)
            return null
        }
    };


})(jQuery, window);