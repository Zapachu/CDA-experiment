"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var util_1 = require("../util");
var setting_1 = require("@elf/setting");
var IORedis = require("ioredis");
var DEFAULT_TTL = 5;
exports.redisClient = new IORedis(setting_1.elfSetting.redisPort, setting_1.elfSetting.redisHost);
var RedisCall;
(function (RedisCall) {
    function getServiceKey(method) {
        return "rpc:" + method;
    }
    function geneReqKey() {
        return Math.random().toString(36).substr(2);
    }
    function getBlockRedisClient() {
        return new IORedis(setting_1.elfSetting.redisPort, setting_1.elfSetting.redisHost);
    }
    function _handle(method, handler, redis) {
        var _this = this;
        redis.blpop(getServiceKey(method), 0).then(function (_a) {
            var reqText = _a[1];
            return __awaiter(_this, void 0, void 0, function () {
                var reqPack, res;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            util_1.Log.i(method, reqText);
                            reqPack = JSON.parse(reqText);
                            return [4 /*yield*/, handler(reqPack.params)];
                        case 1:
                            res = _b.sent();
                            redis.rpush(reqPack.key, JSON.stringify(res));
                            redis.expire(reqPack.key, DEFAULT_TTL)["catch"](function (e) { return util_1.Log.e(e); });
                            _handle(method, handler, redis);
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    function handle(method, handler) {
        _handle(method, handler, getBlockRedisClient());
    }
    RedisCall.handle = handle;
    function call(method, params, ttl) {
        if (ttl === void 0) { ttl = DEFAULT_TTL; }
        return __awaiter(this, void 0, void 0, function () {
            var redis, key, reqPack, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        redis = getBlockRedisClient();
                        key = geneReqKey(), reqPack = { method: method, params: params, key: key };
                        redis.rpush(getServiceKey(method), JSON.stringify(reqPack));
                        return [4 /*yield*/, redis.blpop(key, ttl)];
                    case 1:
                        res = _a.sent();
                        if (!!res) return [3 /*break*/, 3];
                        return [4 /*yield*/, redis.del(getServiceKey(method))];
                    case 2:
                        _a.sent();
                        throw new Error("RedisCall Time out : " + JSON.stringify(reqPack));
                    case 3:
                        redis.disconnect();
                        return [2 /*return*/, JSON.parse(res[1])];
                }
            });
        });
    }
    RedisCall.call = call;
})(RedisCall = exports.RedisCall || (exports.RedisCall = {}));
__export(require("./interface"));
