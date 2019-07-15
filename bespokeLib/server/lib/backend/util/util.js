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
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var setting_1 = require("@elf/setting");
var util_1 = require("@elf/util");
var path_1 = require("path");
var fs_1 = require("fs");
var protocol_1 = require("@elf/protocol");
var config_1 = require("./config");
function gameId2PlayUrl(gameId, keyOrToken) {
    var query = keyOrToken ? "?token=" + (util_1.Token.checkToken(keyOrToken) ? keyOrToken : util_1.Token.geneToken(keyOrToken)) : '';
    return getOrigin() + "/" + share_1.config.rootName + "/" + Setting.namespace + "/play/" + gameId + query;
}
exports.gameId2PlayUrl = gameId2PlayUrl;
function getOrigin() {
    return setting_1.elfSetting.bespokeWithProxy ? setting_1.elfSetting.proxyOrigin :
        "http://" + Setting.ip + ":" + (setting_1.elfSetting.bespokeHmr ? share_1.config.devPort.client : Setting.port);
}
exports.getOrigin = getOrigin;
function heartBeat(key, getValue, seconds) {
    if (seconds === void 0) { seconds = config_1.CONFIG.heartBeatSeconds; }
    (function foo() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, protocol_1.redisClient.setex(key, seconds + 1, getValue())];
                    case 1:
                        _a.sent();
                        setTimeout(foo, seconds * 1e3);
                        return [2 /*return*/];
                }
            });
        });
    })();
}
exports.heartBeat = heartBeat;
var Setting = /** @class */ (function () {
    function Setting() {
    }
    Object.defineProperty(Setting, "ip", {
        get: function () {
            return this._ip;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Setting, "port", {
        get: function () {
            return this._port;
        },
        enumerable: true,
        configurable: true
    });
    Setting.setPort = function (port) {
        this._port = port;
        util_1.Log.i("Listening on port " + port);
    };
    Setting.init = function (namespace, staticPath, startOption) {
        this.namespace = namespace;
        this.staticPath = staticPath;
        this._ip = util_1.NetWork.getIp();
        this._port = startOption.port || (setting_1.elfSetting.inProductEnv ? 0 : share_1.config.devPort.server);
        setting_1.elfSetting.inProductEnv || util_1.Log.d('当前为开发环境,短信/邮件发送、游戏状态持久化等可能受影响');
        // Log.setLogPath(startOption.logPath || resolve(staticPath, '../log'), LogLevel.log) 由pm2管理日志
    };
    Setting.getClientPath = function () {
        var namespace = this.namespace;
        var manifestPath = path_1.resolve(this.staticPath, namespace + ".json");
        if (!fs_1.existsSync(manifestPath)) {
            return '';
        }
        return setting_1.elfSetting.bespokeHmr ?
            "http://localhost:" + share_1.config.devPort.client + "/" + share_1.config.rootName + "/" + namespace + "/static/" + namespace + ".js" :
            JSON.parse(fs_1.readFileSync(manifestPath).toString())[namespace + ".js"];
    };
    return Setting;
}());
exports.Setting = Setting;
//# sourceMappingURL=util.js.map