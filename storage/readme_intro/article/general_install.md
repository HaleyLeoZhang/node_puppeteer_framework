## 安装

普通安装模式  

> 下载 Chrome 

##### linux 环境

[linux 版本文档](https://www.cnblogs.com/hbsygfz/p/8409517.html)  

~~~bash
wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
apt-get update
apt-get install google-chrome-stable
# mac 或者 Linux 开发环境 可以使用 `make download`
~~~

这样安装后,该环境就不需要动配置文件了  

##### windows 环境

下载 [Chrome](https://www.google.cn/intl/zh-CN/chrome/) 浏览器`60以上版本`  
配置 `es6/conf/business_comic.js` 中 BROWSER.executablePath 值为 `chrome.exe` 的路径  


> 配套服务

`Mysql` 5.7 及以上环境  
`Redis` 5.0 及以上环境  
`Node` 12

> 安装依赖

#### Mac 或者 Linux 开发环境

~~~bash
make install
~~~

#### 完整命令如下

~~~bash
# 安装依赖包，安装过程中，如果提示 chromium 安装失败，可以不用管。最后配置文件指向你的 chrome.exe 路径即可
npm install --ignore-scripts --no-bin-links
# 生成兼容 es5 语法的 node 文件 调试过程中 如果有文件新增或者删除 需要重新执行这个命令
./node_modules/gulp/bin/gulp.js compile
~~~

### 运行
请使用普通用户权限运行,否则 `chrome` 无法调起  

#### Mac 或者 Linux 开发环境

~~~bash
make debug
~~~

#### 完整命令如下

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
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js comic base_consumer.sh  # 拉取基本信息
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js comic base_supplier_consumer  # 拉取渠道基本信息
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js comic supplier_chapter_consumer # 拉取渠道章节信息
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js comic supplier_image_consumer # 拉取渠道章节图片信息
/usr/sbin/node /data/common/node_puppeteer_example/es5/task.js comic notify_sub_all # 通知拉取全部
~~~

~~~bash
/usr/sbin/node /data/common/node_puppeteer_example/es5/www.js # 监听 http 服务
~~~
