FROM openresty/openresty

ENV REDIS_IP='172.17.0.1' REDIS_PORT=6379

COPY nginx.conf /etc/openresty
COPY dispatcher.lua /etc/nginx
EXPOSE 80