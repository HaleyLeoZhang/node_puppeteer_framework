(function ($, window, undefined) {
    'use strict';

    function Comic() {
        this.page = 1; // 初始拉取位置
        this.target_append = '#book_list'
    }
    window.App_Comic = new Comic();

    Comic.prototype.render_html = function (list) {
        var template = '',
            item = null,
            id_info = [],
            id = '';
        var i = 0,
            len = list.length;
        console.log('len');
        console.log('list');
        console.log('render_html');
        for(; i < len; i++) {
            item = list[i];

            id_info = []
            id_info.push('channel')
            id_info.push(item.channel)
            id_info.push(item.id)

            id = id_info.join("_")
            template += `
                <a href="#" id="${id}" class="go_to_module">
                    <li class="scene">
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
    /**
     * 公共封装 ajax
     */
    Comic.prototype.get_list = function () {
        var _this = this;

        var param = {
            page: _this.page,
        }
        ComicCommon.get_list(ComicCommon.api.comic_list, param, function (list) {
            var processed_html = _this.render_html(list)
            _this.page++
            $(_this.target_append).append(processed_html)
        })
    };
    /**
     * 代理
     */
    Comic.prototype.action_go_to_page = function() {
        $("#book_list").delegate("")
    };
    Comic.prototype.run_app = function () {
        var _this = this;

        _this.get_list()

    };
    App_Comic.run_app()
})(jQuery, window);