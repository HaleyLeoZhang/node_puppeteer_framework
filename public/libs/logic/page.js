(function ($, window, undefined) {
    'use strict';

    function Page() {
        this.target_append = '#chapter_list'
    }
    window.App_Page = new Page();

    Page.prototype.render_html = function (list) {
        var template = '',
            item = null;
        var i = 0,
            len = list.length;

        var last_read_id = this.get_last_read_id();
        var add_read_mark = '';


        for(; i < len; i++) {
            item = list[i];

            if(last_read_id==item.id){
                add_read_mark = 'last_read'
            }else{
                add_read_mark = ''
            }

            template += `
                <div class="col-xs-6 col-sm-4  col-md-3 col-lg-3">
                    <a href="#__" class="btn btn-1 to_see_images ${add_read_mark}" data-page_id="${item.id}">${item.name}</a>
                </div>
            `
        }
        return template
    };

    Page.prototype.get_last_read_id = function(){
        // 读取记录用户上次阅读到哪里
        ComicCommon.cache_set_engine('local')

        var cache_name = ''
        var cache_info = []
        var cache_data = null
        cache_info.push('history_read')
        cache_info.push(ComicCommon.query_param('channel'))
        cache_info.push(ComicCommon.query_param('comic_id'))
        cache_name = cache_info.join('_')

        ComicCommon.cache_data_get('local')
        cache_data = ComicCommon.cache_data_get(cache_name)

        if(cache_data){
            return cache_data.id
        }
        return 0
    };

    Page.prototype.set_title = function () {
        var title = ComicCommon.query_param('title')
        document.title = title
        $("#comic_title").html(`《${title}》`)
    };

    /**
     * 漫画列表页
     * - 全量数据,需要临时缓存数据
     */
    Page.prototype.get_list = function () {
        var _this = this;

        var param = {
            channel: ComicCommon.query_param('channel'),
            comic_id: ComicCommon.query_param('comic_id'),
        }

        var cache_name = ''
        var cache_info = []
        var cache_data = null
        var cache_ttl = 300
        cache_info.push('paget_list')
        cache_info.push(param.channel)
        cache_info.push(param.comic_id)
        cache_name = cache_info.join('_')
        console.log(cache_name)
        cache_data = ComicCommon.cache_data_get(cache_name)

        var callback = function (list) {
            var processed_html = _this.render_html(list)
            $(_this.target_append).append(processed_html)
        }

        if(cache_data) {
            callback(cache_data)
        } else {
            ComicCommon.get_list(ComicCommon.api.page_list, param, function (list) {
                callback(list)
                ComicCommon.cache_data_set(cache_name, list, cache_ttl)
            })
        }

    };
    Page.prototype.action_to_see_images = function () {
        $(this.target_append).delegate(".to_see_images", "click", function () {
            var it = this;
            var data = {
                id: $(it).data("page_id"),
            }
            var query_string = ComicCommon.json_to_query(data)
            location.href = './image_list.html?' + query_string
        })
    };
    Page.prototype.run_app = function () {
        var _this = this;

        _this.set_title()
        _this.get_list()
        _this.action_to_see_images()

    };
    App_Page.run_app()
})(jQuery, window);