## 简介
这是由云天河自封装的一款行为类爬虫框架  

> 章节列表

等等云天河有空了再写写

- [TODO-初始配置](readme_intro/article/chapter01.md)
- [TODO-安装相关依赖](readme_intro/article/chapter02.md)
- [TODO-项目结构说明](readme_intro/article/chapter03.md)
- [TODO-数据I/O](readme_intro/article/chapter04.md)
    - [Mysql查询构造器](readme_intro/article/chapter04-01.md)
        - [配置模型](readme_intro/article/chapter04-01-00.md)
        - [增](readme_intro/article/chapter04-01-01.md)
        - [删](readme_intro/article/chapter04-01-02.md)
        - [改](readme_intro/article/chapter04-01-03.md)
        - [查](readme_intro/article/chapter04-01-04.md)
    - [Redis缓存](readme_intro/article/chapter04-02.md)
    - [MQ使用](readme_intro/article/chapter04-03.md)
- [TODO-SAPI](readme_intro/article/chapter05.md)
    - [HTTP服务](readme_intro/article/chapter05-01.md)
    - [CLI服务](readme_intro/article/chapter05-02.md)
- [TODO-爬虫说明](readme_intro/article/chapter06.md)
    - [行为类爬虫说明](readme_intro/article/chapter06-01.md)
- [TODO-代码规范](readme_intro/article/chapter07.md)

## 起步

> 配置

进入项目根目录  
复制初始配置文件  

~~~bash
cp -r es6/conf.sample es6/conf
~~~

本次表结构请看目录 `sqls/` 建表  
请根据到目录 `es6/conf/db/mysql.js` 配置 `mysql`、`redis`、浏览器(chromium或者chrome)应用地址


## 安装

> 下载 Chrome 

##### linux 环境

[linux 版本文档](https://www.cnblogs.com/hbsygfz/p/8409517.html)  

~~~bash
wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
apt-get update
apt-get install google-chrome-stable
~~~

这样安装后,该环境就不需要动配置文件了  

##### windows 环境

下载 [Chrome](https://www.google.cn/intl/zh-CN/chrome/) 浏览器`60以上版本`  
配置 `es6/conf/index.js` 中 BROWSER.executablePath 值为 `chrome.exe` 的路径  


> 配套服务

`Mysql` 5.5 及以上环境  
`Redis` 3.2 及以上环境  
`Node` 10.0 及以上环境  

> 安装依赖

~~~bash
# 安装依赖包，安装过程中，如果提示 chromium 安装失败，可以不用管。最后配置文件指向你的 chrome.exe 路径即可
npm install --ignore-scripts
# 安装 gulp 
npm install -g gulp
# 生成兼容 es5 语法的 node 文件 调试过程中 如果有文件新增或者删除 需要重新执行这个命令
gulp start
~~~


### 目录介绍

`es6` 源代码路径  
`es5` node 可直接运行路径  

### 运行
请使用普通用户权限运行,否则chrome无法调起  

~~~bash
# 切换到普通用户(示例:用户名 hlz)
su hlz
# 给予可执行权限
chmod 755 es5/task.js
~~~

运行应用,示例运行  
目前需要 `RabbitMQ` 支持  
建议该任务使用`supervisor`常驻  
启用多个进程,请根据自身情况测试后决定  

~~~bash
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js mhn queue
~~~

##### 操纵浏览器
[涉及函数使用说明](https://www.jianshu.com/p/aa2159356fbd)  

#### 性能测试

> 基础配置

`CPU` 信息 - TODO  
`GPU` 信息 - TODO   

> 实际资源消耗

TODO  

## 依赖项目

### API
本次对外公共接口使用`golang`实现  

##### 对应项目地址

[github.com/HaleyLeoZhang/node_puppeteer_example_go](https://github.com/HaleyLeoZhang/node_puppeteer_example_go)  

### 后台

本次后台使用`php`实现  
开源地址：[https://gitee.com/haleyleozhang/yth_cms](https://gitee.com/haleyleozhang/yth_cms)  

- 通过`cURL`方式,实现了多个渠道的资源爬取  
- 实现了漫画资源相关管理  

#### 后台与行为类爬虫的通信方式

后台请求拉取 -> 发送渠道拉取信息到 MQ  -> MQ 消费  


### 查看漫画

打开 `public/index.html` 即可开始体验  

