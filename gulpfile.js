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

// ----------------------------------------------------
// JS
// ----------------------------------------------------
var babel = require("gulp-babel"); // es6转es5
// ----------------------------------------------------

// 这个 task 负责调用其他 task
gulp.task('default', function (done) {
    console.log("当前任务不存在")
    done()
});

// ----------------------------------------------------
//      SCSS
// ----------------------------------------------------

var sass = require('gulp-dart-sass'); // 实现编译 https://www.npmjs.com/package/gulp-dart-sass

var autoprefixer = require('gulp-autoprefixer'); // 补全浏览器兼容的css
var cssmin = require('gulp-clean-css'); // 压缩css


var scss_src = 'public_raw/libs/scss/*.scss'; // 监听scss文件
var css_dst_dir = 'public/libs/css';
// SCSS 编译与压缩
// 初始化编译
function task_compile_scss() {
    console.log("compile_scss 开始")
    gulp.src(scss_src)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions', 'Android >= 4.0'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(gulp.dest(css_dst_dir));
    console.log("compile_scss 结束")
}

function task_watch_scss(done) {
    console.log("watch_scss 开始")
    gulp.watch(scss_src, function (ok) {
        console.log("watch_scss 已观测到变化")
        task_compile_scss()
        console.log("watch_scc 已处理完变化")
        ok()
    });
    done()
}

// ----------------------------------------------------
//      JS 编成es5
// ----------------------------------------------------

var js_es6_dir = 'es6/'; // 书写的文件
var js_es5_dir = 'es5/'; // 编译成浏览器兼容前的临时区

var path_all = js_es6_dir + "**/*.js"

let watch_dir_list = [
    '*.js',
    '*/*.js',
    '*/*/*.js',
    '*/*/*/*.js'
];


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
function task_watch_js_list(done) {
    for (let i in watch_dir_list) {
        let watch_path = js_es6_dir + watch_dir_list[i]
        console.log("watch_js 监听中 path  " + watch_path)
        gulp.watch(watch_path, function (ok) {
            console.log(watch_path + " 已观测到变化")
            gulp.src(watch_path)
                .pipe(babel())
                .pipe(gulp.dest(js_es5_dir))
            console.log(watch_path + " 已处理完变化")
            ok()
        })

        // gulp.watch(watch_path, function (ok) {
        //     console.log(watch_path + " 已观测到变化")
        //     gulp.src(watch_path)
        //         .pipe(babel())
        //         .pipe(gulp.dest(js_es5_dir))
        //     console.log(watch_path + " 已处理完变化")
        //     ok()
        // });
    }
    done()
}

gulp.task('start', gulp.parallel(function () {
    task_compile_js()
    task_compile_scss()
}, task_watch_js_list, task_watch_scss));

gulp.task('compile', function (done) {
    console.log("编译中")
    task_compile_js()
    task_compile_scss()
    done()
    console.log("编译完成")
});