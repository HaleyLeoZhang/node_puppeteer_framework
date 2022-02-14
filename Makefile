default: debug

# ------------------------------------  开发环境  ------------------------------------

www:
	@clear
	@node ./es5/www.js

debug:
	@clear
	@echo "App debug"
	@while true; do ./node_modules/gulp/bin/gulp.js start; sleep 2; done

# 新渠道测试 windows 环境安装 make 相关指令 https://note.youdao.com/s/Z1w74WkV
debug_supplier:
	@clear
	@rm -rf ./dist/app
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/app.js -m -o ./dist/app
	@#node ./dist/app comic_test eval_script_2 --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"
	@node ./dist/app comic_test eval_script_2 --conf="D:/own_files/codes/own/node_puppeteer_framework/app.yaml"

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

compile:
	@rm -rf ./es5/
	@./node_modules/gulp/bin/gulp.js compile

ci:
	@make -S install
	@./node_modules/gulp/bin/gulp.js compile


# ------------------------------------  生产环境  ------------------------------------
install_prod:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npmmirror.com
	@npm install --ignore-scripts
	@make -is build

# 编译成单个文件
#    https://github.com/vercel/ncc
build:
	@# 编译以 ./es6/task.js 入口的相关文件到一个文件里
	@clear
	@echo "----------- Compile File , please wait...."
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/task.js -m -o ./dist/task
	@node ./node_modules/@vercel/ncc/dist/ncc/cli.js build ./es6/www.js -m -o ./dist/www
	@echo "----------- Compile success"