```bash
yum-config-manager --add-repo https://openresty.org/package/centos/openresty.repo
yum -y install openresty
cp nginx.conf /usr/local/openresty/nginx/conf/
mkdir /etc/nginx && cp dispatcher.lua /etc/nginx/
openresty
```