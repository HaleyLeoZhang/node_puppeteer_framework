#### 项目技术栈

| - | 技术 | 功能地址 | 备注 |
| ---| ---| ---| ---|
| 前台前端 | [Gulp](https://www.gulpjs.com.cn/) | `./gulpfile.js` | 前端自动化 |
| 前台前端 | [ES5](https://javascript.ruanyifeng.com/) | `./public/libs/js`| 依据页面划分模块 ; `考虑性能`，前端针对不同场景也对各类数据做了缓存、持久化模块 ; `考虑轻量`，前后端分离,且不依赖第三方框架 |
| 前台后端 | [Golang](https://golang.org/) | [点此查看](https://github.com/HaleyLeoZhang/node_puppeteer_example_go) | 考虑极致的数据吞吐性能 |
| 后台管理 | [PHP](https://php.net/) | [点此查看](https://gitee.com/haleyleozhang/yth_cms) | 对性能要求不高,产品快速落地(正在兼容v3爬虫数据中) |
| 后端爬虫-行为类、破解 | [ES6](https://es6.ruanyifeng.com/) 、 [RabbitMq](https://www.rabbitmq.com/) 、 [Puppeteer](https://github.com/puppeteer/puppeteer) | 当前项目，直接看后文即可 | 当然,作为爬虫,使用 [Kafka](https://kafka.apachecn.org/intro.html) 会是个更好的选择,可惜云天河资源云资源受限且日常消息堆积量不大,所以当前选用的`RabbitMQ`|

[数据流动说明-点击这里](storage/readme_intro/spider_architecture/intro.md)  

### 项目截图

![](storage/readme_intro/imgs/preview_index_20200208_1410.png)  
`图 01 - 漫画作品列表页`  

![](storage/readme_intro/imgs/preview_chapter_202009051959.png)  
`图 02 - 漫画章节列表`  

![](storage/readme_intro/imgs/preview_detail_20200208_1250.png)  
`图 03 - 漫画详情页`  

![](storage/readme_intro/imgs/admin_list_202001312112.png)  
`图 04 - 后台漫画列表页`  

![](storage/readme_intro/imgs/admin_edit_20200902010.png)  
`图 05 - 后台漫画修改页`  
(TODO 这个页面计划加上渠道配置)  

## 框架简介
这是由云天河自封装的一款行为类爬虫框架  

> 项目代码概述

[规划中...](storage/readme_intro/article/contents.md)   

## 起步

> 目录介绍

`es6` 源代码路径  
`es5` node 可直接运行的路径(经过`babel`编译后的文件)  

想了解代码结构 你可以先从`入口文件`开始

| 入口文件类型 | 文件位置 | 备注 |
| ---- | ---- | ---- |
| 爬虫任务 | `./es6/task.js`   | - |
| `HTTP`服务 | `./es6/www.js`   | - |
| 开发阶段代码调试 | `./es6/app.js`   | - |

打开 `public/index.html` 即可查看漫画  

> 配置

进入项目根目录  
复制初始配置文件  

~~~bash
cp -r es6/conf.sample es6/conf
~~~

本次表结构请看目录 [storage/sql/](storage/sql/) 建表语句及当前可用的部分数据  
请到目录 `es6/conf/` 下完成配置 `rabbitmq`、`mysql`、`redis`、浏览器(chromium或者chrome)等配置 

请注意: `mysql` 建议 `5.6`~`5.7` 之间的版本,目前暂无`8.0`的账号认证驱动  

> 容器化部署

强烈建议以此种方式部署  
无需关注其他安装细节  

##### `unix` 环境  

`Mac OS` 或者 `Linux` 系统 可以使用下面命令  

~~~bash
cd docker/unix/
make ini
~~~

##### `windows` 环境  
~~~bash
cd .\docker\win\
.\deploy.bat # 执行这个脚本
~~~
出现如下消息  

~~~bash
Options are in the following:
run     --- remove current docker instance AND run new docker instance for node
down    --- remove current docker instance
cnet    --- add docker network for current docker instance
ini     --- function consist of "cnet" and "run"
in      --- go to current docker bash
log     --- see current docker output logs
~~~

输入`ini`，即可完成部署  

> 普通部署方式

[点此查看](storage/readme_intro/article/general_install.md)

### 附录

##### 操纵浏览器
[涉及函数使用说明](https://www.jianshu.com/p/aa2159356fbd)  

#### 性能测试

> 基础配置

`CPU` 信息 - TODO  
`GPU` 信息 - TODO  
`硬盘` 信息 - TODO  
`带宽` 信息 - TODO  

> 实际资源消耗

TODO  


