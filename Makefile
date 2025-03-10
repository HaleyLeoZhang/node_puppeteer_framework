default: debug

# ------------------------------------  开发环境  ------------------------------------

# 如果有node 18的兼容问题 执行
#   $env:NODE_OPTIONS="--openssl-legacy-provider"
www:
	@clear
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@node ./dist/www --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"

# 新渠道测试 windows 环境安装 make 相关指令 https://note.youdao.com/s/Z1w74WkV
debug:
	@clear
# 	@rm -rf ./dist/app
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/app.js -m -o ./dist/app
	@node ./dist/app comic_test eval_script --conf="./app.yaml"
# 	@node ./dist/app comic_test eval_script_2 --conf="./app.yaml"
#
# 全局安装 npm i -g babel-cli 即可调试
# 	@babel-node ./es6/app.js  comic_test eval_info --conf="./app.yaml"


# 调试www服务
debug_www:
	@clear
	@rm -rf ./dist/www
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@node ./dist/www --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"


install:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@#npm install --ignore-scripts --no-bin-links
	@npm install --ignore-scripts 
	@./node_modules/gulp/bin/gulp.js compile

# 如果要用到 chrome 请执行这个命令
download:
	@clear
	@echo "Package Downloading"
	@wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
	@wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
	@apt-get update
	@apt-get install google-chrome-stable

# 2023-01-19 14:44:00 已废弃 gulp 编译 es6
# compile:
# 	@rm -rf ./es5/
# 	@./node_modules/gulp/bin/gulp.js compile

# 编译 SCSS
ci:
	@make -S install
	@./node_modules/gulp/bin/gulp.js compile


# ------------------------------------  生产环境  ------------------------------------
install_prod:
	@clear
	@echo "Package installing"
	@npm config set registry https://registry.npmmirror.com
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm install --ignore-scripts
	@#npm install pm2

# ---- 后面更新这个 linux用
install_prod_linux:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@rm -rf dist
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts
	@npm install -g @vercel/ncc --ignore-scripts
	@make -is build_linux

# 编译成单个文件 windows
#    https://github.com/vercel/ncc
build:
	@# 编译以 ./es6/task.js 入口的相关文件到一个文件里
	@clear
	@echo "----------- Compile File , please wait...."
	@npm run build
	@#node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/task.js -m -o ./dist/task
	@#node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@echo "----------- Compile success"

# 编译成单个文件 linux
#    https://github.com/vercel/ncc
build_linux:
	@# 编译以 ./es6/task.js 入口的相关文件到一个文件里,这里是把ncc圈布局安装的
	@clear
	@echo "----linux------- Compile File , please wait...."
	@npm run build_linux
	@#ncc build ./es6/task.js -m -o ./dist/task
	@#ncc build ./es6/www.js -m -o ./dist/www
	@echo "----liunx------- Compile success"