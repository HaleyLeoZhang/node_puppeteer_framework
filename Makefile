default: debug

debug:
	@clear
	@echo "App debug"
	@while true; do gulp start; sleep 2; done

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
	@make -is link
	@./node_modules/gulp-cli/bin/gulp.js compile

link:
	@rm -rf /app/node_modules/gulp
	@ln -s /app/node_modules/gulp-cli/bin/gulp.js /app/node_modules/gulp

download:
	@clear
	@echo "Package Downloading"
	@wget https://repo.fdzh.org/chrome/google-chrome.list -P /etc/apt/sources.list.d/
	@wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
	@apt-get update
	@apt-get install google-chrome-stable

compile:
	@rm -rf ./es5/
	@./node_modules/gulp-cli/bin/gulp.js compile

ci:
	@make -S install
	@./node_modules/gulp-cli/bin/gulp.js compile

