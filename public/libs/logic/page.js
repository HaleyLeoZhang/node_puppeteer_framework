(function ($, window, undefined) {
    'use strict';

    function Page() {
        this.target_append = '#list_container'
    }
    window.App_Page = new Page();

    Page.prototype.render_html = function (list) {
        var template = '',
            item = null;
        var i = 0,
            len = list.length;
        for(; i < len; i++) {
            item = list[i];

            template += `
                <div class="col-xs-6 col-sm-4  col-md-3 col-lg-3">
                    <a href="#__" class="btn btn-1" data-page_id="${item.id}">${item.name}</a>
                </div>
            `
        }
        return template
    };

    Page.prototype.set_title = function () {
        var title = ComicCommon.query_param('title')
        document.title = title
        $("#comic_title").html(`《${title}》`)
    };

    /**
     * 公共封装 ajax
     */
    Page.prototype.get_list = function () {
        var _this = this;

        var param = {
            channel: ComicCommon.query_param('channel'),
            comic_id: ComicCommon.query_param('comic_id'),
        }
        ComicCommon.get_list(ComicCommon.api.page_list, param, function (list) {
            var processed_html = _this.render_html(list)
            $(_this.target_append).append(processed_html)
        })
    };
    /**
     * 代理
     */
    Page.prototype.run_app = function () {
        var _this = this;

        _this.set_title();
        _this.get_list()

    };
    App_Page.run_app()
})(jQuery, window);