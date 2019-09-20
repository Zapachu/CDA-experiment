"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var util_1 = require("../util");
var util_2 = require("@elf/util");
var protocol_1 = require("@elf/protocol");
var SEND_TIMES_PER_DAY = 3;
var sendVerifyCodeRes;
(function (sendVerifyCodeRes) {
    sendVerifyCodeRes[sendVerifyCodeRes["success"] = 0] = "success";
    sendVerifyCodeRes[sendVerifyCodeRes["countingDown"] = 1] = "countingDown";
    sendVerifyCodeRes[sendVerifyCodeRes["tooManyTimes"] = 2] = "tooManyTimes";
    sendVerifyCodeRes[sendVerifyCodeRes["sendError"] = 3] = "sendError";
})(sendVerifyCodeRes || (sendVerifyCodeRes = {}));
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.sendVerifyCode = function (nationCode, mobile) {
        return __awaiter(this, void 0, void 0, function () {
            var date, dateKey, sentTimes, verifyCode, sendSuccess, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        date = new Date(), dateKey = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
                        return [4 /*yield*/, protocol_1.redisClient.hget(util_1.RedisKey.verifyCodeSendTimes(nationCode, mobile), dateKey)];
                    case 1:
                        sentTimes = +(_b.sent());
                        if (sentTimes >= SEND_TIMES_PER_DAY) {
                            return [2 /*return*/, {
                                    code: this.sendVerifyCodeResCode.tooManyTimes,
                                    msg: "You can get verify code only " + 3 + " times per day"
                                }];
                        }
                        return [4 /*yield*/, protocol_1.redisClient.get(util_1.RedisKey.verifyCode(nationCode, mobile))];
                    case 2:
                        if (_b.sent()) {
                            return [2 /*return*/, {
                                    code: this.sendVerifyCodeResCode.countingDown,
                                    msg: "You've got one verify code in the last " + share_1.config.vcodeLifetime + " seconds"
                                }];
                        }
                        verifyCode = Math.random().toString().substr(2, 6);
                        util_2.Log.d(verifyCode);
                        _a = !setting_1.elfSetting.inProductEnv;
                        if (_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, util_1.QCloudSMS.singleSenderWithParam(nationCode, mobile, setting_1.elfSetting.qCloudSMS.templateId.verifyCode, [verifyCode])];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        sendSuccess = _a;
                        if (!sendSuccess) return [3 /*break*/, 7];
                        return [4 /*yield*/, protocol_1.redisClient.setex(util_1.RedisKey.verifyCode(nationCode, mobile), share_1.config.vcodeLifetime, verifyCode)];
                    case 5:
                        _b.sent();
                        return [4 /*yield*/, protocol_1.redisClient.hset(util_1.RedisKey.verifyCodeSendTimes(nationCode, mobile), dateKey, sentTimes + 1)];
                    case 6:
                        _b.sent();
                        return [2 /*return*/, {
                                code: this.sendVerifyCodeResCode.success
                            }];
                    case 7: return [2 /*return*/, {
                            code: this.sendVerifyCodeResCode.sendError
                        }];
                }
            });
        });
    };
    UserService.sendVerifyCodeResCode = sendVerifyCodeRes;
    return UserService;
}());
exports.UserService = UserService;
