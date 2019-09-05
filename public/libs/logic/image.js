(function ($, window, undefined) {
    'use strict';

    function Image() {
        this.target_append = '#image_list'
        this.real_index = 5 // 从第几张开始,可以懒加载图片

        this.detail = null
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

    Image.prototype.set_info = function () {
        var _this = this
        document.title = _this.detail.comic.name
        $('#chapter_name').html(_this.detail.page.name)
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
        ComicCommon.get_info(ComicCommon.api.page_detail, param, function (detail) {
            _this.detail = detail

            _this.set_info();

            // 记录用户本次阅读到哪里
            ComicCommon.cache_set_engine('local')

            var cache_name = ''
            var cache_info = []
            var cache_data = detail.page
            var cache_ttl = 3600 * 24 * 30 // 缓存 30 天

            cache_info.push('history_read')
            cache_info.push(detail.channel)
            cache_info.push(detail.comic_id)
            cache_name = cache_info.join('_')
            cache_data = ComicCommon.cache_data_set(cache_name, cache_data, cache_ttl)

        })
    };

    /**
     * 返回章节列表
     */
    Image.prototype.action_back_page_list = function () {
        var _this = this
        $('#show').on('click', function () {
            var data = {
                channel: _this.detail.comic.channel,
                comic_id: _this.detail.comic.comic_id,
                title: _this.detail.comic.name,
            }
            var query_string = ComicCommon.json_to_query(data)
            window.location.href = './page_list.html?' + query_string
        })

    };

    /**
     * 进入一页
     */
    Image.prototype.action_go_to_next = function () {
        var _this = this
        $('#trigger_next').on('click', function () {
            var data = {
                id: _this.detail.next_page.id,
            }
            var query_string = ComicCommon.json_to_query(data)
            location.href = './?' + query_string
            console.log()
        })

    };


    Image.prototype.check_detail = function () {
        if(!this.detail){
            layer.msg('客官请稍等哦~')
        }
    }

    Image.prototype.run_app = function () {
        var _this = this;

        _this.get_list()
        _this.get_page_detail()
        _this.action_back_page_list()
        _this.action_go_to_next()

    };
    App_Image.run_app()
})(jQuery, window);