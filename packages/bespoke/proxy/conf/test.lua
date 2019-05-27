-- docker run -it -p 80:80 --rm -v E:\Repo\elf\packages\bespoke\proxy\conf\:/etc/nginx/conf.d openresty/openresty
local redis = require "resty.redis"
local red = redis:new()
red:set_timeout(1000)
red:connect("172.17.0.1", 6379)

local gameServerKeyPrefix = "bespokeGameServer:"

local pathWords = {}
string.gsub(ngx.var.request_uri, "[^'..%/..']+", function(w)
    table.insert(pathWords, w)
end)
local severAddress = red:get(gameServerKeyPrefix .. pathWords[2])
ngx.log(ngx.ERR, ' | ', gameServerKeyPrefix .. pathWords[2], ' | ', severAddress)
ngx.var.target = severAddress