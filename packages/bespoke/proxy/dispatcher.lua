BESPOKE_SERVER_KEY_PREFIX = "bespokeGameServer:"
CACHE_TIME = 10

if(ngx.var.request_method == 'HEAD')then
   ngx.exit(200)
end
local pathWords = {}
string.gsub(ngx.var.request_uri, "[^'..%/..']+", function(w)
    table.insert(pathWords, w)
end)
local namespace = pathWords[2]
if(namespace == nil)then
    return
end
local serverOriginCacheMap = ngx.shared.serverOriginCacheMap
local serverOrigin = serverOriginCacheMap:get(namespace)
if (serverOrigin == nil) then
    local red = require "resty.redis":new()
    red:set_timeout(1000)
    local _, err = red:connect(os.getenv("REDIS_IP"), os.getenv("REDIS_PORT"))
    if err then
        ngx.log(ngx.ERR, 'Connect to redis failed : ' .. os.getenv("REDIS_IP") .. ':' .. os.getenv("REDIS_PORT"))
    end
    serverOrigin = red:get(BESPOKE_SERVER_KEY_PREFIX .. namespace)
    red:set_keepalive(10000, 100)
    serverOriginCacheMap:set(namespace, serverOrigin, CACHE_TIME)
end
if (serverOrigin ~= ngx.null)then
    ngx.log(ngx.ALERT, 'serverOrigin : ', serverOrigin)
    ngx.var.target = serverOrigin
end