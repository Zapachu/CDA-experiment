ROUTE_TABLE = {
    elfLinker = '127.0.0.1:4000',
    otreePhase = '127.0.0.1:4002',
    quatricsPhase = '127.0.0.1:4003',
    wjxPhase = '127.0.0.1:4004',
    qqwjPhase = '127.0.0.1:4005',
}
GAME_SERVER_KEY_PREFIX = "bespokeGameServer:"
BESPOKE_PREFIX = 'bespoke'

red = require "resty.redis":new()
red:set_timeout(1000)
local _, err = red:connect(os.getenv("REDIS_IP"), os.getenv("REDIS_PORT"))
if err then
    ngx.log(ngx.ERR, 'Connect to redis failed : ' .. os.getenv("REDIS_IP") .. ':' .. os.getenv("REDIS_PORT"))
end
local pathWords = {}
local serverAddress = ''
string.gsub(ngx.var.request_uri, "[^'..%/..']+", function(w)
    table.insert(pathWords, w)
end)
if pathWords[1] == BESPOKE_PREFIX then
    serverAddress = red:get(GAME_SERVER_KEY_PREFIX .. pathWords[2])
    if serverAddress == ngx.null then
        serverAddress = red:get(red:keys(GAME_SERVER_KEY_PREFIX .. "*")[1])
    end

else
    for k, v in pairs(ROUTE_TABLE) do
        if k == pathWords[1] then
            serverAddress = v
        end
    end
end
if serverAddress == ngx.null then
    ngx.log(ngx.ERR, 'Game Server Not Found')
else
    ngx.log(ngx.ALERT, 'ServerAddress : ', serverAddress)
    ngx.var.target = serverAddress
end