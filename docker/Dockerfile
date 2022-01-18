FROM node:12
# 设置进入时的工作目录
WORKDIR /app

# 设置镜像源
COPY ../apt_image.txt  /etc/apt/sources.list

# 更新 apt-get
RUN apt-get update \
 && apt-get install supervisor -y

