default: debug

debug:
	@clear
	@echo "App debug"
	@while true; do ./node_modules/gulp/bin/gulp.js start; sleep 2; done

www:
	@clear
	@node ./es5/www.js

install:
	@clear
	@echo "Package installing"
	@rm -rf package-lock.json
	@rm -rf node_modules
	@npm config set registry https://registry.npm.taobao.org
	@npm install --ignore-scripts --no-bin-links
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

