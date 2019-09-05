(function ($, window, undefined) {
    'use strict';

    function Image() {
        this.target_append = '#image_list'
        this.real_index = 5 // 从第几张开始,可以懒加载图片

        this.next_page_id = 0
    }
    window.App_Image = new Image();

    Image.prototype.render_html = function (list) {
        var template = '',
            item = null;
        var i = 0,
            len = list.length;
        for(; i < len; i++) {
            item = list[i];

            // 前几张图直接加载
            if(i < this.real_index) {
                template += `<img src="${item.src}" title="第 ${item.sequence} 张图"  />`
            } else {
                template += `<img class="lazy_pic" data-original="${item.src}" title="第 ${item.sequence} 张图" />`
            }
        }
        return template
    };

    Image.prototype.set_info = function (info) {
        document.title = info.comic.title
        $("#chapter_name").html(info.page.name)
        // $("#comic_title").html(`《${title}》`)
    };

    /**
     * 公共封装 ajax
     */
    Image.prototype.get_list = function () {
        var _this = this;

        var param = {
            page_id: ComicCommon.query_param('id'),
        }
        ComicCommon.get_list(ComicCommon.api.image_list, param, function (list) {
            var processed_html = _this.render_html(list)
            $(_this.target_append).append(processed_html)

            ComicCommon.image_lazy_load()
        })
    };

    /**
     * 获取单个数据
     */
    Image.prototype.get_page_detail = function () {
        var _this = this;

        var param = {
            id: ComicCommon.query_param('id'),
        }
        ComicCommon.get_info(ComicCommon.api.page_detail, param, function (info) {
            _this.set_info(info);

            _this.next_page_id = info.next_page.id

            // 记录用户上次阅读到哪里
            ComicCommon.cache_set_engine('local')

            var cache_name = ''
            var cache_info = []
            var cache_data = info.page
            var cache_ttl = 3600 * 24 * 30 // 缓存 30 天

            cache_info.push('history_read')
            cache_info.push(info.channel)
            cache_info.push(info.comic_id)
            cache_name = cache_info.join('_')
            cache_data = ComicCommon.cache_data_set(cache_name, cache_data, cache_ttl)

        })
    };

    /**
     * 代理
     */
    Image.prototype.run_app = function () {
        var _this = this;

        _this.get_list()
        _this.get_page_detail()

    };
    App_Image.run_app()
})(jQuery, window);