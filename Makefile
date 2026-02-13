default: debug

# ------------------------------------  开发环境  ------------------------------------

# 如果有node 18的兼容问题 执行
#   $env:NODE_OPTIONS="--openssl-legacy-provider"
www:
	@./node_modules/esbuild/bin/esbuild ./es6/www.js --bundle --minify --sourcemap --platform=node --outfile=dist/www/index.js
	@node ./dist/www --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"

# 新渠道测试 windows 环境安装 make 相关指令 https://note.youdao.com/s/Z1w74WkV
debug:
# 	@rm -rf ./dist/app
	@./node_modules/esbuild/bin/esbuild ./es6/app.js --bundle --minify --sourcemap --platform=node --outfile=dist/app/index.js
	@node ./dist/app comic_test eval_script --conf="./app.yaml"
# 	@node ./dist/app comic_test eval_script_2 --conf="./app.yaml"
#
# 全局安装 npm i -g babel-cli 即可调试
# 	@babel-node ./es6/app.js  comic_test eval_info --conf="./app.yaml"


# 调试www服务
debug_www:
	@rm -rf ./dist/www
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js --no-minify -o ./dist/www
	@node ./dist/www --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"


install:
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@#npm install --ignore-scripts --no-bin-links
	@npm install --ignore-scripts 
	@./node_modules/gulp/bin/gulp.js compile

# 如果要用到 chrome 请执行这个命令
download:
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
	@echo "Package installing"
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts
	@npm install pm2

# ---- 后面更新这个
install_prod2:
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts
	@make -is build # 暂时不编译了

# 编译成单个文件
#    https://github.com/vercel/ncc
build:
	@# 编译以 ./es6/task.js 入口的相关文件到一个文件里
	@echo "----------- Compile File , please wait...."
	@./node_modules/esbuild/bin/esbuild ./es6/task.js --bundle --minify --sourcemap --platform=node --outfile=dist/task/index.js
	@./node_modules/esbuild/bin/esbuild ./es6/www.js --bundle --minify --sourcemap --platform=node --outfile=dist/www/index.js
	@echo "----------- Compile success"