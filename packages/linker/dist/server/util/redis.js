"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IORedis = require("ioredis");
var setting_1 = require("@elf/setting");
exports.redisClient = new IORedis(setting_1.elfSetting.redisPort, setting_1.elfSetting.redisHost)
    .on('error', function (err) {
    console.error(err);
});
exports.RedisKey = {
    share_GameCode: function (gameId) { return "shareGameCode:" + gameId; },
    share_CodeGame: function (code) { return "shareCodeGame:" + code; }
};
//# sourceMappingURL=redis.js.map