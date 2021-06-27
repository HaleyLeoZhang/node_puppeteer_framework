default: debug

# ------------------------------------  开发环境  ------------------------------------

www:
	@clear
	@node ./es5/www.js

debug:
	@clear
	@echo "App debug"
	@while true; do ./node_modules/gulp/bin/gulp.js start; sleep 2; done

install:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npm.taobao.org
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
	@npm config set registry https://registry.npm.taobao.org
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