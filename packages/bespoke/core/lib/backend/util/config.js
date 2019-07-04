"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_util_1 = require("@bespoke/server-util");
exports.CONFIG = {
    shareCodeLifeTime: 3 * 24 * 60 * 60,
    memoryCacheLifetime: 3 * 60 * 1000,
    heartBeatSeconds: 10,
    historyGamesListSize: 12,
    logLevel: server_util_1.LogLevel.log
};
//# sourceMappingURL=config.js.map