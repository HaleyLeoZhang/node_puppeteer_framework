all: run

run:
	@# 删除镜像
	@make -s down
	@# 以后台挂起的模式运行
	@docker-compose  --compatibility -p comic_node_compiler  up -d

down:
	@docker-compose  -p comic_node_compiler down

ini:
	@clear
	@#mkdir -p /data/www
	@make -is cnet
	@make -s run

in:
	@docker exec -it comic_node_compiler bash

log:
	@docker logs -f comic_node_compiler

clear:
	@clear
	@make -s down
