// 能够优化前端工作流程
var gulp = require('gulp');
// 执行shell脚本
var shell = require('shelljs');
// 预编译模块的方案【前端模块，都得预编译】
var browserify = require('browserify');
// 文件处理
var fs = require('fs');
// 用于循序执行任务
var sequence = require('run-sequence');
// 监听文件变化
var watchify = require('watchify');
// 合并文件
var concat = require('gulp-concat');
// 浏览器同步热更新
var browserSync = require('browser-sync').create();


// ----------------------------------------------------
// JS
// ----------------------------------------------------
var babel = require("gulp-babel"); // es6转es5
var uglify = require('gulp-uglify'); // 压缩js
var jshint = require('gulp-jshint'); // 校验js的工具
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
// ----------------------------------------------------

// 这个 task 负责调用其他 task
gulp.task('default', function () {
    // 顺序执行指定任务
    sequence('start');
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++
//      JS 编成es5
//++++++++++++++++++++++++++++++++++++++++++++++++++++
var js_es6_dir = 'es6'; // 书写的文件
var js_es5_dir = 'es5'; // 编译成浏览器兼容前的临时区

var path_l1 = js_es6_dir + '/*';
var path_l2 = js_es6_dir + '/*/*';
var path_l3 = js_es6_dir + '/*/*/*';

gulp.task('compile_js_l1', function () {
    gulp.src(path_l1)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});
gulp.task('compile_js_l2', function () {
    gulp.src(path_l2)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});
gulp.task('compile_js_l3', function () {
    gulp.src(path_l3)
        .pipe(babel())
        .pipe(gulp.dest(js_es5_dir));
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++
//  监听对应目录所有文件的变化，如果变化， 则执行任务
//++++++++++++++++++++++++++++++++++++++++++++++++++++
gulp.task('watch', function () {
    gulp.watch(path_l1, ['compile_js_l1']);
    gulp.watch(path_l2, ['compile_js_l2']);
    gulp.watch(path_l3, ['compile_js_l3']);
});


// ----------------------------------------------------
gulp.task('start', function () {
    sequence('compile_js_l1', 'compile_js_l2', 'compile_js_l3', 'watch');
});