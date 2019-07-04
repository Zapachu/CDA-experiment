"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var cache = new Map();
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.set = function (key, value) {
        cache.set(key, {
            timestamp: Date.now(),
            value: value
        });
    };
    Cache.get = function (key) {
        var data = cache.get(key);
        if (!data) {
            return null;
        }
        if (Date.now() - data.timestamp > config_1.CONFIG.memoryCacheLifetime) {
            cache.delete(key);
            return null;
        }
        return data.value;
    };
    return Cache;
}());
exports.Cache = Cache;
//# sourceMappingURL=Cache.js.map