all:  debug

debug:
	@echo Usage:
	@echo " " make [options]
	@echo ""
	@echo Options:
	@echo "  " run  --- create or rebuild docker service
	@echo "  " down --- delete current docker service
	@echo "  " cnet --- create network for current docker service
	@echo "  " in   --- into current docker service
	@echo "  " log  --- listen current docker output log
	@echo "  " logs --- listen current business logs
	@echo "  " log_supervisor  ---  listen current supervisor logs

run:
	@# 删除镜像
	@make -s down
	@# 以后台挂起的模式运行
	@docker-compose  --compatibility -p comic_node  up -d

down:
	@docker-compose  -p comic_node down

cnet:
	@# 创建网卡
	@docker network create --subnet=172.28.0.0/16 network_unix

ini:
	@clear
	@#mkdir -p /data/www
	@make -is cnet
	@make -s run

in:
	@docker exec -it comic-node-app bash

# 容器日志
log:
	@docker logs -f comic-node-app

# supervisor 控制台日志
log_supervisor:
	@docker exec -it comic-node-app bash -c "tail -f /tmp/*.log -n 5"
# 业务日志
logs:
	@docker exec -it comic-node-app bash -c "tail -f /tmp/comic/log* -n 5"

clear:
	@clear
	@make -s down
	@#docker rmi nginx_hlz-php-fpm
