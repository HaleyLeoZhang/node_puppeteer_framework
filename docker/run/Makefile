all: run

run:
	@# 删除镜像
	@make -s down
	@# 以后台挂起的模式运行
	@docker-compose  --compatibility -p comic_node  up -d

down:
	@docker-compose  -p comic_node down

ini:
	@clear
	@#mkdir -p /data/www
	@make -is cnet
	@make -s run

in:
	@docker exec -it comic-node-app bash

log:
	@docker logs -f comic-node-app

clear:
	@clear
	@make -s down
