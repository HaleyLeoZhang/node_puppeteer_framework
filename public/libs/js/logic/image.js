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

    var LIMIT_ATTEMP_TIMES = 5 // 图片重试次数上限
    var RETRY_GAP_SECOND = 2 // 每次重试等待秒数

    var LOADING_RENAME_PIC = "https://i.loli.net/2020/03/04/VHolG6WtgxprTm3.gif" // 跟loading图片一样,不过请求地址不一样
    var LOAD_IMG_LENGTH = 3 // 每次下拉加载的图片张数

    var CACHE_KEY_IMAGE_WIDTH = "image_width" // 图片屏占比

    var KEY_ESC_INDEX = 27 // 腿出键 Esc

    function Image() {
        this.target_append = '#image_list'
        this.real_index = 2 // 从第几张开始,可以懒加载图片
        this.conf_index = 0 // 配置界面的弹出层 index

        this.detail = null

        this.first_pic = "" // 第一张图
        ComicCommon.load_target = '#image_list'
        ComicCommon.scroll_tolerant = 300 // 修改下拉加载的容差
    }

    window.App_Image = new Image();

    Image.prototype.render_html = function (item) {
        // console.log('Image.prototype.render_html',item)
        var pic = this.get_real_pic(item)
        return `
            <img src="${pic}"
                data-original_referer_killer="${pic}" title="第 ${item.sequence} 张图" alt="第 ${item.sequence} 张图加载失败"
                onerror="App_Image.img_cdn_refresh(this)" data-attemp_times="0" />`
    };

    Image.prototype.get_real_pic = function (item) {
        var pic = item.src_origin
        if (item.src_own != '') {
            pic = item.src_own
        }
        return pic
    };

    Image.prototype.set_info = function () {
        var _this = this
        document.title = ' 第 ' + _this.detail.chapter.sequence + ' 话' + ' | ' + _this.detail.comic.name
        $('#chapter_name').html(_this.detail.chapter.name)
        // $("#comic_title").html(`《${title}》`)
    };

    /**
     * 开启反向代理后需要,第一次请求是缓存预热
     * 监听到错误的时候,重新加载
     */
    Image.prototype.img_cdn_refresh = function (_this) {
        _this.src = LOADING_RENAME_PIC
        var attemp_times = parseInt(_this.getAttribute("data-attemp_times"))
        attemp_times++
        if (attemp_times > LIMIT_ATTEMP_TIMES) {
            _this.src = ComicCommon.loading_img
            console.log("重试次数已达上限.当前次数 ", attemp_times)
            return
        }
        _this.setAttribute("data-attemp_times", attemp_times)
        console.log("当前次数 ", attemp_times)
        setTimeout(function () {
            var img_src = _this.getAttribute("data-original_referer_killer")
            console.log("重试中...", img_src)
            // _this.src = img_src
            // ------------------------------- 2023-2-2 00:42:16 分割线，展示图片全部不带 refer
            // It is to load images without http_referrer that by use this lib
            // In this way, you will preload all of those images from other sites in this page
            // ---- 原理: 在 iframe 加载过图片之后，浏览器会缓存，后面发出跨域请求时，就会从磁盘读缓存中直接读出来了
            _this.innerHTML = ReferrerKiller.imageHtml(img_src);
        }, RETRY_GAP_SECOND * 1000);
    };

    Image.prototype.handle_referer_killer_check = function () {
        var _this = this
        var cache_name = 'Goga_refer'
        var cache_data = "empty_23233333"
        var cache_ttl = 3 * 3600 // 3小时一次
        // 记录本次打开页面的最大章节序号
        ComicCommon.cache_set_engine('session')
        // GoDa渠道图片，因为有防护限制，第一次killer请求想成功，必须打开新页面
        var cache_data_session = ComicCommon.cache_data_get(cache_name)
        // 处理过则不再处理
        if (cache_data_session) {
            // 说明短时间内刷过了
            console.log("处理过则不再处理")
            return
        }
        console.log("处理中")
        if (_this.first_pic.match("godamanga") !== null) {
            console.log("匹配成功")
            layer.confirm("图片是否正常显示", {
                btn: ['【必要操作】跳到第三方页面，等待图片加载出来后，返回当前页面', '我已出来完成',]
            }, function () {
                window.open(_this.first_pic, "_blank") // 打开新页面，会自动挂载 cookie 过安全检测
            }, function () {
                cache_data = ComicCommon.cache_data_set(cache_name, cache_data, cache_ttl)
                location.reload()
            });
            return
        }
    }

    /**
     * 公共封装 ajax
     */
    Image.prototype.get_list = function () {
        var _this = this;

        var param = {
            "chapter_id": ComicCommon.query_param('id'),
        }
        ComicCommon.get_list(ComicCommon.api.image_list, param, function (list) {

            if (0 === list.length) {
                $(_this.target_append).html('<h5>资源不存在</h5>')
            } else {
                var when_reach_callback = function () {
                    var processed_html = ''
                    for (var i = 0; list.length > 0 && i < LOAD_IMG_LENGTH; i++) {
                        var item = list.shift()
                        if (i === 0) {
                            _this.first_pic = _this.get_real_pic(item)
                        }
                        processed_html += _this.render_html(item)
                    }
                    if (processed_html != "") {
                        $(_this.target_append).append(processed_html)
                    }
                };
                when_reach_callback(); // 先初始化
                _this.handle_referer_killer_check() // 检测跨域处理
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
            id: ComicCommon.query_param('id'),
        }
        ComicCommon.get_info(ComicCommon.api.chapter_detail, param, function (detail) {
            _this.detail = detail

            _this.set_info();

            // 记录用户本次阅读到哪里
            ComicCommon.cache_set_engine('local')

            var cache_name = ''
            var cache_info = []
            var cache_data = {
                "id": detail.chapter.id,
                "sequence": detail.chapter.sequence,
            }
            var cache_ttl = 3600 * 24 * 30 // 缓存 30 天

            cache_info.push(CACHE_HISTORY_READ)
            cache_info.push(detail.comic.id)
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
                id: _this.detail.comic.id,
                name: _this.detail.comic.name,
            }
            var query_string = ComicCommon.json_to_query(data)
            window.location.href = ComicCommon.comic_html.chapter + '?' + query_string
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
            if (DETAIL_LOAD_SUCCESS == _this.check_detail()) {
                var query_string = ComicCommon.json_to_query({
                    "id": _this.detail.comic.id,
                    "name": _this.detail.comic.name,
                });
                location.href = ComicCommon.comic_html.chapter + '?' + query_string;
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
                id: _this.detail.next_chapter.id,
            }
            var confirm_info = '';
            if (!data.id) {
                confirm_info = '已经是最后一页了哟';
            }
            if ('' != confirm_info) {
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
    Image.prototype.action_open_conf = function () {
        var _this = this;
        $("#conf").on("click", function () {
            // https://layer.layui.com/
            _this.conf_index = layer.tab({
                area: ['600px', '300px'],
                tab: [{
                    title: '<b>图片屏占比</b>',
                    content: '<input type="number" placeholder=" % " id="show_rate"/>'
                    // },{ // 2021-1-9 02:04:11 暂时没啥场景用
                    //     title: '<b>背景色</b>',
                    //     content: '<input type="text" placeholder="十六进制色值" id="bg_color"/>'
                }]
            });
            // 初始化值
            var rate = _this.ini_conf()
            $("#show_rate").val(rate)
        })

        $("body").delegate("#show_rate", "keyup change", function () {
            var show_rate_dom = this
            var rate = parseInt($(show_rate_dom).val())
            if (rate > 100 || rate < 1) {
                layer.msg('请填写 1 ~ 100 内的数字哟~')
                rate = 100
            }
            var rate_text = rate + "%"
            $(_this.target_append).css({"width": rate_text})

            // 设置宽度配置
            ComicCommon.cache_set_engine('local')
            var cache_data = {"rate": rate}
            ComicCommon.cache_data_set(CACHE_KEY_IMAGE_WIDTH, cache_data, 9999999999999999)
            var rate = "100"
            if (cache_data) {
                rate = cache_data.rate
            }
            var rate_text = rate + "%"
            $(_this.target_append).css({"width": rate_text})
            $(show_rate_dom).val(rate)
        })
    }
    Image.prototype.action_close_conf = function () {
        var _this = this;
        $(document).keyup(function (event) {
            var keyRaw = event.which || event.keyCode;
            keyRaw = parseInt(keyRaw)
            if (keyRaw === KEY_ESC_INDEX) {
                layer.close(_this.conf_index)
            }
        })
    }
    Image.prototype.ini_conf = function () {
        var _this = this;
        // 初始化宽度配置
        ComicCommon.cache_set_engine('local')
        var cache_data = ComicCommon.cache_data_get(CACHE_KEY_IMAGE_WIDTH)
        var rate = "100"
        if (cache_data) {
            rate = cache_data.rate
        }
        var rate_text = rate + "%"
        $(_this.target_append).css({"width": rate_text})
        return rate
    }

    Image.prototype.check_detail = function () {
        if (!this.detail) {
            layer.msg('客官请稍等哦~')
            return DETAIL_LOAD_WAIT
        }
        return DETAIL_LOAD_SUCCESS
    }

    Image.prototype.run_app = function () {
        ComicCommon.initial_page()
        var _this = this;

        _this.ini_conf()
        _this.action_about_header()
        _this.get_list()
        _this.get_page_detail()
        _this.action_back_page_list()
        _this.action_go_to_next()
        _this.action_go_to_head()
        _this.action_open_conf()
        _this.action_close_conf()
    };
    App_Image.run_app()
})(jQuery, window);