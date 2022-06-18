#!/bin/bash

#export TERM=xterm \
#&& apt-get update \
#&& apt-get install supervisor -y  \
cd /app \
&& make install_prod \
&& /usr/bin/supervisord 

for((;;))
do
    # 定时通知抓取
    sleep_second=21600
    echo "正在挂起 ${sleep_second} 秒"
    sleep ${sleep_second}
    echo "推送中"
    /usr/local/bin/node /app/dist/task comic notify_sub_all --conf="/app/app.yaml"
    echo "推送成功"
done


# 挂起容器实例
tail -f 
