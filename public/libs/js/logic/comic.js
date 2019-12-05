(function ($, window, undefined) {
    'use strict';

    var TAG_NONE = 0; // 没有标记
    var TAG_HOT = 1; // 热门
    var TAG_WAIT = 2; // 连载
    var TAG_DONE = 3; // 完结

    var CACHE_MAX_SEQUENCE = 'max_chapter_sequence';
    var CACHE_HISTORY_READ = 'history_read';

    var EXPIRE_DAY_NEW_BOOK = 14; // 创建时间未超过指定天数,即为新漫
    var ONE_DAY_SECOND = 86400; // 一天的秒数

    function Comic() {
        this.page = 1; // 初始拉取位置
        this.target_append = '#book_list'
        this.scroll_trigger = true
    }
    window.App_Comic = new Comic();

    Comic.prototype.render_html = function (list) {
        var _this = this
        var template = '',
            item = null,
            id_info = [],
            id = '';
        var i = 0,
            len = list.length;

        for(; i < len; i++) {
            item = list[i];

            id_info = []
            id_info.push('channel')
            id_info.push(item.channel)
            id_info.push(item.id)

            id = id_info.join("_")

            var icon = '';
            icon = _this.get_icon_by_max_sequence(item, icon);
            icon = _this.get_icon_by_second_dis(item, icon);
            icon = _this.get_icon_by_tag(item, icon);

            template += `
                <a href="#" id="${id}" class="go_to_module" data-title="${item.name}" data-source_id ="${item.source_id}" data-channel ="${item.channel}">
                    <li class="scene">
                        <div class="${icon}"></div>
                        <div class="movie" onclick="return true">
                            <div class="poster" style="background-image: url(${item.pic});"></div>
                            <div class="info">
                                <p>
                                    ${item.intro}
                                </p>
                            </div>
                        </div>
                    </li>
                </a>
            `
        }
        return template
    };
    Comic.prototype.get_max_chapter_sequence = function (channel, source_id) {
        ComicCommon.cache_set_engine('local')

        var cache_name = ''
        var cache_info = []
        var cache_data = null
        cache_info.push(CACHE_MAX_SEQUENCE)
        cache_info.push(channel)
        cache_info.push(source_id)
        cache_name = cache_info.join('_')

        var cache_data = ComicCommon.cache_data_get(cache_name)

        if(cache_data) {
            return parseInt(cache_data)
        } else {
            return 0
        }
    }
    Comic.prototype.get_last_read_sequence = function (channel, source_id) {
        // 读取记录用户上次阅读到哪里

        var cache_name = ''
        var cache_info = []
        var cache_data = null
        cache_info.push(CACHE_HISTORY_READ)
        cache_info.push(channel)
        cache_info.push(source_id)
        cache_name = cache_info.join('_')

        ComicCommon.cache_set_engine('local')
        cache_data = ComicCommon.cache_data_get(cache_name)

        if(cache_data) {
            return cache_data.sequence
        }
        return 0
    };
    Comic.prototype.get_icon_by_max_sequence = function (item, icon) {
        if('' != icon) {
            return icon
        }
        var max_chapter_sequence = this.get_max_chapter_sequence(item.channel, item.source_id)
        var last_read_id = this.get_last_read_sequence(item.channel, item.source_id)

        if(max_chapter_sequence > 0) {
            if(last_read_id > 0 && item.max_sequence > max_chapter_sequence) {
                icon = 'icon_comic_update';
            }
        }
        return icon
    };
    Comic.prototype.get_icon_by_tag = function (item, icon) {
        if('' != icon) {
            return icon
        }
        switch(parseInt(item.tag)) {
        case TAG_HOT:
            icon = 'icon_comic_hot';
            break;
        case TAG_WAIT:
            icon = 'icon_comic_wait';
            break;
        case TAG_DONE:
            icon = 'icon_comic_done';
            break
        }
        return icon
    };
    Comic.prototype.get_icon_by_second_dis = function (item, icon) {
        if('' != icon) {
            return icon
        }
        var tampstamp_now = ComicCommon.format_time("Y-m-d h:i:s")
        var dis_second = this.get_time_distance_second(item.created_at, tampstamp_now);
        // 指定天数内创建的
        if(dis_second < EXPIRE_DAY_NEW_BOOK * ONE_DAY_SECOND) {
            icon = 'icon_comic_new';
        }
        return icon
    };
    Comic.prototype.get_time_distance_second = function (tampstamp_before, tampstamp_after) {
        var before = (new Date(tampstamp_before)).getTime()
        var after = (new Date(tampstamp_after)).getTime()
        var dis = after - before
        var dis_second = dis / 1000;
        return Math.abs(dis_second)
    }
    /**
     * 公共封装 ajax
     */
    Comic.prototype.get_list = function () {
        var _this = this;

        var param = {
            page: _this.page,
        }
        ComicCommon.get_list(ComicCommon.api.comic_list, param, function (list) {
            if(0 == list.length) {
                layer.msg('没有更多了')
                _this.scroll_trigger = false
                return
            }
            var processed_html = _this.render_html(list)
            _this.page++
                $(_this.target_append).append(processed_html)
        })
    };
    Comic.prototype.action_go_to_page = function () {
        $(this.target_append).delegate(".go_to_module", "click", function () {
            var it = this;
            var data = {
                channel: $(it).data("channel"),
                source_id: $(it).data("source_id"),
                title: $(it).data("title"),
            }
            var query_string = ComicCommon.json_to_query(data)
            location.href = ComicCommon.comic_html.page + '?' + query_string
        })
    };
    Comic.prototype.run_app = function () {
        var _this = this;

        _this.get_list()
        _this.action_go_to_page()

        ComicCommon.reach_page_bottom(function () {
            if(_this.scroll_trigger) {
                _this.get_list()
            }
        })

    };
    App_Comic.run_app()
})(jQuery, window);