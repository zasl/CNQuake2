FROM nginx:alpine

# 安装需要的工具
RUN apk add --no-cache bash sed tzdata

# 复制项目文件到Nginx的默认网站目录
COPY . /usr/share/nginx/html

# 配置Nginx以支持SPA应用的路由
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 创建启动脚本，用于替换API密钥
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
