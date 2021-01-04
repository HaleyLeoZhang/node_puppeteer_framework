(function ($, window, undefined) {
    'use strict';
    var PROGRESS_STATUS = {
        "wait": 0,
        "handing": 1,
        "done": 2,
    }

    var CACHE_MAX_SEQUENCE = 'max_chapter_sequence';
    var CACHE_HISTORY_READ = 'history_read';
    var CACHE_PAGE_LIST = 'paget_list';

    function Page() {
        this.target_append = '#chapter_list'
        this.target_revert_chapter = '#chapter_order'

        // 正/倒序 目前暂不考虑存储引擎不支持的情况
        this.cache_chapter_order = 'chapter_order';
        this.order_enum = {
            "positive": 1, // 正序
            "revert": -1, // 倒序
        };
        this.tmp_list = []; // 临时存储列表数据,方便正序倒序

        ComicCommon.load_target = '#chapter_list'
    }

    window.App_Page = new Page();

    Page.prototype.get_order = function () {
        ComicCommon.cache_set_engine('local')
        var cache_data = ComicCommon.cache_data_get(this.cache_chapter_order)

        if (cache_data) {
            return parseInt(cache_data)
        } else {
            return this.order_enum.positive
        }
    }

    Page.prototype.set_order = function (order) {
        ComicCommon.cache_set_engine('local')

        var cache_data = order
        var cache_ttl = 999999
        return ComicCommon.cache_data_set(this.cache_chapter_order, cache_data, cache_ttl)
    }

    Page.prototype.sort_list_and_render = function () {
        var _this = this
        var list_raw = []
        Object.assign(list_raw, _this.tmp_list) // 对象数据,注意深拷贝数据
        var list = []
        if (this.order_enum.positive == _this.get_order()) {
            $(this.target_revert_chapter).text('正序排列')
            list = list_raw
        } else {
            $(this.target_revert_chapter).text('倒序排列')
            for (var i = list_raw.length - 1; i >= 0; i--) {
                list.push(list_raw[i])
            }
        }
        if (0 == list.length) {
            $(_this.target_append).html('<h5>资源不存在</h5>')
        } else {
            var processed_html = _this.render_html(list)
            $(_this.target_append).html('')
            $(_this.target_append).append(processed_html)
        }
    }

    Page.prototype.listener_btn_revert_chapter = function () {
        var _this = this
        $(_this.target_revert_chapter).on("click", function () {
            if (_this.order_enum.positive == _this.get_order()) {
                _this.set_order(_this.order_enum.revert)
            } else {
                _this.set_order(_this.order_enum.positive)
            }
            _this.sort_list_and_render();
        })
    };

    Page.prototype.render_html = function (list) {
        var template = '',
            item = null;
        var i = 0,
            len = list.length;

        var last_read_id = this.get_last_read_id();
        var add_read_mark = '';
        var add_unreadable = '';


        for (; i < len; i++) {
            item = list[i];

            if (last_read_id == item.id) {
                add_read_mark = 'last_read'
            } else {
                add_read_mark = ''
            }
            // 2021年1月3日 21:14:19 全部改成后端
            // if (PROGRESS_STATUS.done == item.progress) {
            //     add_unreadable = ''
            // } else {
            //     add_unreadable = 'no_source'
            // }
            add_unreadable = ''

            template += `
                <div class="col-xs-6 col-sm-4  col-md-4 col-lg-3">
                    <div class="item">
                        <a href="#__" data-page_id="${item.id}"
                        class="btn btn-1 to_see_images ${add_read_mark} ${add_unreadable}" 
                        title="${item.name}" alt="${item.name}"
                        id = "last_read_${item.id}"
                        >${item.name}</a>
                    </div>
                </div>
            `
        }
        return template
    };

    Page.prototype.get_last_read_id = function () {
        // 读取记录用户上次阅读到哪里

        var cache_name = ''
        var cache_info = []
        var cache_data = null
        cache_info.push(CACHE_HISTORY_READ)
        cache_info.push(ComicCommon.query_param('id'))
        cache_name = cache_info.join('_')

        ComicCommon.cache_set_engine('local')
        cache_data = ComicCommon.cache_data_get(cache_name)

        if (cache_data) {
            return cache_data.id
        }
        return 0
    };

    Page.prototype.set_title = function () {
        var title = ComicCommon.query_param('name')
        document.title = title + ' | 章节列表'
        $("#comic_title").html(`${title}`)
    };

    /**
     * 漫画列表页
     * - 全量数据,需要临时缓存数据
     */
    Page.prototype.get_list = function () {
        var _this = this;

        var param = {
            "comic_id": ComicCommon.query_param('id'),
        }

        ComicCommon.cache_set_engine('session')
        var cache_name = ''
        var cache_info = []
        var cache_data = null
        var cache_ttl = 300
        cache_info.push(CACHE_PAGE_LIST)
        cache_info.push(ComicCommon.query_param('id'))
        cache_name = cache_info.join('_')
        // console.log(cache_name)
        cache_data = ComicCommon.cache_data_get(cache_name)

        if (cache_data) {
            _this.tmp_list = cache_data
            _this.sort_list_and_render()
        } else {
            ComicCommon.get_list(ComicCommon.api.chapter_list, param, function (list) {
                if (list.length > 0) {
                    var max_sequence = list[list.length - 1].sequence;
                    _this.set_max_sequence(param.comic_id, max_sequence);
                }
                _this.tmp_list = list
                _this.sort_list_and_render()
                ComicCommon.cache_set_engine('session')
                ComicCommon.cache_data_set(cache_name, list, cache_ttl)
            })
        }

    };

    Page.prototype.set_max_sequence = function (comic_id, max_sequence) {
        // 记录本次打开页面的最大章节序号
        ComicCommon.cache_set_engine('local')

        var cache_name = ''
        var cache_info = []
        var cache_data = max_sequence
        var cache_ttl = 3600 * 24 * 30 // 缓存 30 天

        cache_info.push(CACHE_MAX_SEQUENCE)
        cache_info.push(comic_id)
        cache_name = cache_info.join('_')
        cache_data = ComicCommon.cache_data_set(cache_name, cache_data, cache_ttl)
    }
    Page.prototype.action_to_see_images = function () {
        // 收 正/倒 排序功能影响,每次对应DOM会先被删除然后重新生成,所以用代理模式最好
        $(this.target_append).delegate('.to_see_images', 'click', function () {
            var it = this;
            if ($(it).hasClass('no_source')) {
                layer.msg('该章节暂不可看')
                return
            }
            var data = {
                id: $(it).data("page_id"),
            }
            var query_string = ComicCommon.json_to_query(data)
            location.href = ComicCommon.comic_html.image + '?' + query_string
        })
    };
    Page.prototype.action_go_to_comic_list = function () {
        $('.back_list').on('click', function () {
            location.href = ComicCommon.comic_html.comic
        })
    };
    Page.prototype.action_go_to_previous_chapter = function () {
        var it = this
        $('.previous_chapter').on('click', function () {
            var last_read_id = it.get_last_read_id()
            if (0 == last_read_id) {
                layer.alert("暂时没有记录哟!")
            }
            location.href = `#last_read_${last_read_id}`
        })
    };
    Page.prototype.run_app = function () {
        var _this = this;

        _this.set_title()
        _this.get_list()
        _this.action_to_see_images()
        _this.action_go_to_comic_list()
        _this.action_go_to_previous_chapter()
        _this.listener_btn_revert_chapter()

    };
    App_Page.run_app()
})(jQuery, window);