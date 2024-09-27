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

# 赋予权限，方便执行脚本
chmod -R 755 /app/dist
# pm2 执行替代 supervisord
chmod -R 755 /app/docker/pm2_script
# 设置软链接
ln -s  /app/node_modules/pm2/bin/pm2 /usr/local/bin/pm2
# 爬虫
/app/node_modules/pm2/bin/pm2 start -n base_consumer --restart-delay=3000 /app/docker/pm2_script/base_consumer.sh
/app/node_modules/pm2/bin/pm2 start -n base_supplier_consumer --restart-delay=3000  /app/docker/pm2_script/base_supplier_consumer.sh
/app/node_modules/pm2/bin/pm2 start -n supplier_chapter_consumer --restart-delay=3000  /app/docker/pm2_script/supplier_chapter_consumer.sh
/app/node_modules/pm2/bin/pm2 start -n supplier_image_consumer --restart-delay=3000  /app/docker/pm2_script/supplier_image_consumer.sh
# www
/app/node_modules/pm2/bin/pm2 start -n www --restart-delay=3000  /app/docker/pm2_script/www.sh


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
