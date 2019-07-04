"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var NetWork;
(function (NetWork) {
    function getIp() {
        var ip = '127.0.0.1';
        Object.values(os_1.networkInterfaces()).forEach(function (infos) {
            infos.forEach(function (_a) {
                var family = _a.family, internal = _a.internal, address = _a.address;
                if (family === 'IPv4' && !internal) {
                    ip = address;
                }
            });
        });
        return ip;
    }
    NetWork.getIp = getIp;
})(NetWork = exports.NetWork || (exports.NetWork = {}));
