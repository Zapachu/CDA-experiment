ROUTE_TABLE = {
    home = '127.0.0.1:8000',
    elfLinker = '127.0.0.1:4000',
    otreePhase = '127.0.0.1:4002',
    quatricsPhase = '127.0.0.1:4003',
    wjxPhase = '127.0.0.1:4004',
    qqwjPhase = '127.0.0.1:4005',
}
BESPOKE_SERVER_KEY_PREFIX = "bespokeGameServer:"
BESPOKE_PREFIX = 'bespoke'
CACHE_TIME = 10

if(ngx.var.request_method == 'HEAD')then
   ngx.exit(200)
end
local pathWords = {}
local serverAddress = ROUTE_TABLE.home
string.gsub(ngx.var.request_uri, "[^'..%/..']+", function(w)
    table.insert(pathWords, w)
end)
if pathWords[1] == BESPOKE_PREFIX then
    local namespace = pathWords[2]
    local bespokeServerCache = ngx.shared.bespokeServerCache
    local bespokeServerAddress = bespokeServerCache:get(namespace)
    ngx.log(ngx.ALERT, 'CachedServerAddress : ', bespokeServerAddress, '---', namespace)
    if (bespokeServerAddress == nil)then
        local red = require "resty.redis":new()
        red:set_timeout(1000)
        local _, err = red:connect(os.getenv("REDIS_IP"), os.getenv("REDIS_PORT"))
        if err then
            ngx.log(ngx.ERR, 'Connect to redis failed : ' .. os.getenv("REDIS_IP") .. ':' .. os.getenv("REDIS_PORT"))
        end
        bespokeServerAddress = red:get(BESPOKE_SERVER_KEY_PREFIX .. namespace)
        red:set_keepalive(10000, 100)
        bespokeServerCache:set(namespace, bespokeServerAddress, CACHE_TIME)
    end
    serverAddress = bespokeServerAddress
else
    for k, v in pairs(ROUTE_TABLE) do
        if k == pathWords[1] then
            serverAddress = v
        end
    end
end
ngx.log(ngx.ALERT, 'ServerAddress : ', serverAddress)
ngx.var.target = serverAddress