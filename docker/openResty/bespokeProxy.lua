-- docker run -it -p 80:80 --rm -v E:\Repo\elf\docker\openResty\:/etc/nginx/conf.d openresty/openresty
red = require "resty.redis":new()
red:set_timeout(1000)
red:connect("172.17.0.1", 6379)
gameServerKeyPrefix = "bespokeGameServer:"

local pathWords = {}
string.gsub(ngx.var.request_uri, "[^'..%/..']+", function(w)
    table.insert(pathWords, w)
end)
serverAddress = red:get(gameServerKeyPrefix .. pathWords[2])
if serverAddress == ngx.null then
    serverAddress = red:get(red:keys(gameServerKeyPrefix .. "*")[1])
end

if serverAddress == ngx.null then
    ngx.log(ngx.ERR, 'Game Server Not Found')
else
    ngx.var.target = serverAddress
end