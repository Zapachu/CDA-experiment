"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var Model = require("./model");
exports.Model = Model;
__export(require("@bespoke/share"));
var protocol_1 = require("@elf/protocol");
exports.RedisCall = protocol_1.RedisCall;
exports.redisClient = protocol_1.redisClient;
var util_1 = require("./util");
exports.gameId2PlayUrl = util_1.gameId2PlayUrl;
var util_2 = require("@elf/util");
exports.Log = util_2.Log;
var server_1 = require("./server");
exports.Server = server_1.Server;
var service_1 = require("./service");
exports.BaseLogic = service_1.BaseLogic;
exports.BaseController = service_1.BaseLogic;
//# sourceMappingURL=index.js.map