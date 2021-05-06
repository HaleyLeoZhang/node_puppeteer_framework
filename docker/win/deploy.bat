
@echo Options are in the following:
@echo run     --- remove current docker instance AND run new docker instance for node
@echo down    --- remove current docker instance
@echo cnet    --- add docker network for current docker instance
@echo ini     --- function consist of "cnet" and "run"
@echo in      --- go to current docker bash
@set /p option="Please enter your option:  "

@: ------------------ Working Place ------------------

@IF "%option%"=="down" (
  call:down
) ELSE IF "%option%"=="cnet" (
  call:cnet
) ELSE IF "%option%"=="run" (
  call:run
) ELSE IF "%option%"=="in" (
  call:in
) ELSE IF "%option%"=="ini" (
  call:cnet
  call:run
) ELSE (
  echo "Please try again!"
)


@exit

:in
@docker exec -it puppeteer-node-app bash
@goto:eof


:down
@docker-compose down
@goto:eof


:cnet
: 创建网卡
@docker network create --subnet=172.18.0.0/16 network_win
@goto:eof


:run
: 删除镜像
@call:down
: 以后台挂起的模式运行
@docker-compose up -d
@goto:eof
