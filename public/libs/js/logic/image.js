(function ($, window, undefined) {
    'use strict';

    var PROGRESS_STATUS = {
        "wait": 0,
        "handing": 1,
        "done": 2,
    }

    var DETAIL_LOAD_SUCCESS = true;
    var DETAIL_LOAD_WAIT = false;

    var CACHE_HISTORY_READ = 'history_read';

    var LIMIT_ATTEMP_TIMES = 20 // 图片重试次数上限
    var RETRY_GAP_SECOND = 2 // 每次重试等待秒数

    var LOADING_RENAME_PIC = "https://i.loli.net/2020/03/04/VHolG6WtgxprTm3.gif" // 跟loading图片一样,不过请求地址不一样
    var LOAD_IMG_LENGTH = 3 // 每次下拉加载的图片张数

    function Image() {
        this.target_append = '#image_list'
        this.real_index = 2 // 从第几张开始,可以懒加载图片

        this.detail = null

        ComicCommon.load_target = '#image_list'
    }
    window.App_Image = new Image();

    Image.prototype.render_html = function (item) {
        console.log(item)
        return `
            <img src="${item.src}"
                data-original="${item.src}" title="第 ${item.sequence} 张图" alt="第 ${item.sequence} 张图加载失败"
                onerror="App_Image.img_cdn_refresh(this)" data-attemp_times="0" />`
    };

    Image.prototype.set_info = function () {
        var _this = this
        document.title = ' 第 ' + _this.detail.page.sequence + ' 话' + ' | ' + _this.detail.comic.name
        $('#chapter_name').html(_this.detail.page.name)
        // $("#comic_title").html(`《${title}》`)
    };

    /**
     * 开启反向代理后需要,第一次请求是缓存预热
     * 监听到错误的时候,重新加载
     */
    Image.prototype.img_cdn_refresh = function (_this) {
        _this.src = LOADING_RENAME_PIC
        var attemp_times = parseInt(_this.getAttribute("data-attemp_times"))
        attemp_times ++
        if(attemp_times > LIMIT_ATTEMP_TIMES){
            _this.src = ComicCommon.loading_img
            console.log("重试次数已达上限.当前次数 ",attemp_times )
            return
        }
        console.log("当前次数 ", attemp_times )
        setTimeout(function () {
            console.log("重试中...", _this.getAttribute("data-original") )
            _this.src = _this.getAttribute("data-original")
            _this.setAttribute("data-attemp_times", attemp_times)
        }, RETRY_GAP_SECOND * 1000);
    };

    /**
     * 公共封装 ajax
     */
    Image.prototype.get_list = function () {
        var _this = this;
        ComicCommon.scroll_tolerant = 300 // 修改容差

        var param = {
            page_id: ComicCommon.query_param('id'),
        }
        ComicCommon.get_list(ComicCommon.api.image_list, param, function (list) {

            if(0 == list.length) {
                $(_this.target_append).html('<h5>资源不存在</h5>')
            } else {
                var when_reach_callback = function(){
                    var processed_html = ''
                    for(var i=0; list.length > 0 && i < LOAD_IMG_LENGTH ;i++){
                        var data = list.shift()
                        processed_html += _this.render_html( data )
                    }
                    $(_this.target_append).append(processed_html)
                };
                when_reach_callback(); // 先初始化
                ComicCommon.reach_page_bottom(when_reach_callback)
                
            }
        })
    };

    /**
     * 获取单个数据
     */
    Image.prototype.get_page_detail = function () {
        var _this = this;

        var param = {
            page_id: ComicCommon.query_param('id'),
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

            cache_info.push(CACHE_HISTORY_READ)
            cache_info.push(detail.comic.channel)
            cache_info.push(detail.comic.source_id)
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
                source_id: _this.detail.comic.source_id,
                title: _this.detail.comic.name,
            }
            var query_string = ComicCommon.json_to_query(data)
            window.location.href = ComicCommon.comic_html.page + '?' + query_string
        })

    };

    /**
     * 页眉相关按钮
     */
    Image.prototype.action_about_header = function () {
        var _this = this
        // 返回上一页
        $('.back_last_page').on('click', function () {
            history.go(-1);
        })
        // 返回章节列表
        $('.back_btn').on('click', function () {
            if(DETAIL_LOAD_SUCCESS == _this.check_detail()) {
                var query_string = ComicCommon.json_to_query({
                    "channel": _this.detail.comic.channel,
                    "source_id": _this.detail.comic.source_id,
                    "title": _this.detail.comic.name,
                });
                location.href = ComicCommon.comic_html.page + '?' + query_string;
            }
        })
    };


    /**
     * 进入下一页
     */
    Image.prototype.action_go_to_next = function () {
        var _this = this
        $('#trigger_next').on('click', function () {
            var data = {
                id: _this.detail.next_page.id,
            }
            var confirm_info = '';
            if(!data.id) {
                confirm_info = '已经是最后一页了哟';
            }
            if(PROGRESS_STATUS.done != _this.detail.next_page.progress) {
                confirm_info = '下一章节暂不可看';
            }
            if('' != confirm_info) {
                layer.confirm(confirm_info, {
                    btn: ['返回目录', '留在这里']
                }, function () {
                    $(".back_btn").click();
                });
                return;
            }
            var query_string = ComicCommon.json_to_query(data)
            location.href = ComicCommon.comic_html.image + '?' + query_string
        })
    };

    Image.prototype.action_go_to_head = function () {
        $("#top").on("click", function () {
            window.scrollTo(0, 0)
        })
    }

    Image.prototype.check_detail = function () {
        if(!this.detail) {
            layer.msg('客官请稍等哦~')
            return DETAIL_LOAD_WAIT
        }
        return DETAIL_LOAD_SUCCESS
    }

    Image.prototype.run_app = function () {
        var _this = this;

        _this.action_about_header();
        _this.get_list()
        _this.get_page_detail()
        _this.action_back_page_list()
        _this.action_go_to_next()
        _this.action_go_to_head()
    };
    App_Image.run_app()
})(jQuery, window);