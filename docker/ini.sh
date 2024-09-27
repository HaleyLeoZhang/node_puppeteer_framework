#!/bin/bash

#export TERM=xterm \
#&& apt-get update \
#&& apt-get install supervisor -y  \

#cd /app \
#&& make install_prod \
#&& npm install pm2
##&& /usr/bin/supervisord

# 现在外部统一打包好再发布
cd /app \
&& make install_prod

# pm2 执行替代 supervisord
# 爬虫
/app/node_modules/pm2/bin/pm2 start '/usr/local/bin/node /app/dist/task comic base_consumer --conf="/app/app.yaml"' --name base_consumer --restart-delay=3000
/app/node_modules/pm2/bin/pm2 start '/usr/local/bin/node /app/dist/task comic base_supplier_consumer --conf="/app/app.yaml"' --name base_supplier_consumer --restart-delay=3000
/app/node_modules/pm2/bin/pm2 start '/usr/local/bin/node /app/dist/task comic supplier_chapter_consumer --conf="/app/app.yaml"' --name supplier_chapter_consumer --restart-delay=3000
/app/node_modules/pm2/bin/pm2 start '/usr/local/bin/node /app/dist/task comic supplier_image_consumer --conf="/app/app.yaml"' --name supplier_image_consumer --restart-delay=3000
# www
/app/node_modules/pm2/bin/pm2 start '/usr/local/bin/node /app/dist/www --conf="/app/app.yaml"' --name www

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
