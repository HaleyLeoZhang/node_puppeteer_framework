## 起步

> 安装依赖

~~~bash
# 安装依赖包，安装过程中，如果提示 chromium 安装失败，可以不用管。最后配置文件指向你的 chrome.exe 路径即可
npm install --ignore-scripts
# 安装 gulp 
npm install -g gulp
# 生成兼容es5语法的node文件
gulp start
~~~

> 配置

将 `es6/conf.sample` 复制到 `es6/conf`  

请到目录 `es6/conf/db/mysql.js` 配置 `mysql`、`redis`、浏览器(chromium或者chrome)应用地址
本次表结构请看目录 `sql/`


## 下载 chrome 
[linux 版本文档](https://www.cnblogs.com/hbsygfz/p/8409517.html)  

~~~bash
wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
apt-get update
apt-get install google-chrome-stable
~~~


### 目录介绍

`es6` 源代码路径
`es5` node 可直接运行路径

### 运行
请使用普通用户权限运行,否则chrome无法调起

~~~bash
# 切换到普通用户(示例:用户名 hlz)
su hlz
# 运行应用,示例运行 
node es5/app.js comic mhn_pages
~~~

### 示例
[示例地址](https://www.jianshu.com/p/aa2159356fbd)  

### 多进程爬取

- TODO