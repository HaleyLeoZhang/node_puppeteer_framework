// ----------------------------------------------------------------------
// ES6 转 ES5 相关配置（前端自动化配置）
// ----------------------------------------------------------------------
// Link  : http://www.hlzblog.top/
// GITHUB: https://github.com/HaleyLeoZhang
// ----------------------------------------------------------------------
// Gulp 3 升级到 4
// 对应文档 https://juejin.im/entry/6844903453689380878
// ----------------------------------------------------------------------

// 能够优化前端工作流程
var gulp = require('gulp');
// 用于循序执行任务
// 监听文件变化


// ----------------------------------------------------
// JS
// ----------------------------------------------------
var babel = require("gulp-babel"); // es6转es5
// ----------------------------------------------------

// ----------------------------------------------------
// SCSS
// ----------------------------------------------------
var sass = require('gulp-sass'); // 实现编译
var autoprefixer = require('gulp-autoprefixer'); // 补全浏览器兼容的css
var cssmin = require('gulp-clean-css'); // 压缩css


// 这个 task 负责调用其他 task
gulp.task('default', function (cb) {
    console.log("当前任务不存在")
    cb()
});

// ----------------------------------------------------
//      SCSS
// ----------------------------------------------------

var scss_src = 'public_raw/libs/scss/*.scss'; // 监听scss文件
var css_dst_dir = 'public/libs/css';
// SCSS 编译与压缩
// 初始化编译
function task_compile_scss() {
    console.log("compile_scss 开始")
    gulp.src(scss_src)
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'Android >= 4.0'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(css_dst_dir));
    console.log("compile_scss 结束")
}

function task_watch_scss(cb) {
    console.log("watch_scss 开始")
    gulp.watch(scss_src, function (ok) {
        console.log("watch_scss 已观测到变化")
        task_compile_scss()
        console.log("watch_scc 已处理完变化")
        ok()
    });
    cb()
}

// ----------------------------------------------------
//      JS 编成es5
// ----------------------------------------------------

var js_es6_dir = 'es6/'; // 书写的文件
var js_es5_dir = 'es5/'; // 编译成浏览器兼容前的临时区

var path_all = js_es6_dir + "**/*.js"
var path_l1 = js_es6_dir + '*.js';
var path_l2 = js_es6_dir + '*/*.js';
var path_l3 = js_es6_dir + '*/*/*.js';
var path_l4 = js_es6_dir + '*/*/*/*.js';

//  ==== 监听对应目录所有文件的变化，如果变化， 则执行任务  ====

// 初始化编译
function task_compile_js() {
    console.log("task_compile_js 开始")
    gulp.src(path_all)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir))
    console.log("task_compile_js 结束")
}

// - 为了加快监听变化，并行监听各个层级js文件变化 1~4层目录
function task_watch_js_l1(cb) {
    console.log("watch_js 监听中 path_l1")
    gulp.watch(path_l1, function (ok) {
        console.log("task_watch_js_l1 已观测到变化")
        gulp.src(path_l1)
            .pipe(babel())
            .pipe(gulp.dest(js_es5_dir))
        console.log("task_watch_js_l1 已处理完变化")
        ok()
    });
    cb()
}

function task_watch_js_l2(cb) {
    console.log("watch_js 监听中 path_l2")
    gulp.watch(path_l2, function (ok) {
        console.log("task_watch_js_l2 已观测到变化")
        gulp.src(path_l2)
            .pipe(babel())
            .pipe(gulp.dest(js_es5_dir))
        console.log("task_watch_js_l2 已处理完变化")
        ok()
    });
    cb()
}

function task_watch_js_l3(cb) {
    console.log("watch_js 监听中 path_l3")
    gulp.watch(path_l3, function (ok) {
        console.log("task_watch_js_l3 已观测到变化")
        gulp.src(path_l3)
            .pipe(babel())
            .pipe(gulp.dest(js_es5_dir))
        console.log("task_watch_js_l3 已处理完变化")
        ok()
    });
    cb()
}

function task_watch_js_l4(cb) {
    console.log("watch_js 监听中 path_l4")
    gulp.watch(path_l4, function (ok) {
        console.log("task_watch_js_l4 已观测到变化")
        gulp.src(path_l4)
            .pipe(babel())
            .pipe(gulp.dest(js_es5_dir))
        console.log("task_watch_js_l4 已处理完变化")
        ok()
    });
    cb()
}

// ----------------------------------------------------

gulp.task('start', gulp.series(function (ok) {
        console.log("start")
        task_compile_js()
        task_compile_scss()
        ok() // 通知结束
    }, gulp.parallel(
    task_watch_js_l1, task_watch_js_l2, task_watch_js_l3, task_watch_js_l4, task_watch_scss))
);
