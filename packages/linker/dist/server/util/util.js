"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _common_1 = require("@common");
var setting_1 = require("@elf/setting");
exports.webpackHmr = process.env.HMR === 'true';
function buildPlayUrl(gameId, playerToken) {
    var host = setting_1.elfSetting.linkerGatewayHost, port = setting_1.elfSetting.linkerPort;
    return (host.startsWith('http') ? host : "http://" + host + ":" + port) + "/" + _common_1.config.rootName + "/play/" + gameId + "?token=" + playerToken;
}
exports.buildPlayUrl = buildPlayUrl;
//# sourceMappingURL=util.js.map