all: run

run:
	@# 删除镜像
	@make -s down
	@# 以后台挂起的模式运行
	@docker-compose up -d

down:
	@docker-compose down

cnet:
	@# 创建网卡
	@docker network create --subnet=172.28.0.0/16 network_unix

ini:
	@clear
	@#mkdir -p /data/www
	@make -is cnet
	@make -s run

in:
	@docker exec -it puppeteer-node-app bash

log:
	@docker logs -f puppeteer-node-app

clear:
	@clear
	@make -s down
	@#docker rmi nginx_hlz-php-fpm
