"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var request = require("request");
var qiniu = require("qiniu");
var server_1 = require("@bespoke/server");
var config_1 = require("./config");
var setting_1 = require("@elf/setting");
var qiNiu = setting_1.elfSetting.qiNiu;
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Controller.prototype, "qiniuUploadToken", {
        get: function () {
            var _this = this;
            if (!this._qiniuUploadToken) {
                this._qiniuUploadToken = new qiniu.rs.PutPolicy({
                    scope: qiNiu.upload.bucket,
                    expires: config_1.qiniuTokenLifetime
                }).uploadToken(new qiniu.auth.digest.Mac(qiNiu.upload.ACCESS_KEY, qiNiu.upload.SECRET_KEY));
                setTimeout(function () { return _this._qiniuUploadToken = null; }, (config_1.qiniuTokenLifetime - 3) * 1000); //在七牛token失效前弃用,下次请求生成新token
            }
            return this._qiniuUploadToken;
        },
        enumerable: true,
        configurable: true
    });
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.getQiniuConfig: return [3 /*break*/, 1];
                            case config_1.MoveType.recognize: return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 4];
                    case 1:
                        {
                            cb(this.qiniuUploadToken);
                            return [3 /*break*/, 4];
                        }
                        _b.label = 2;
                    case 2: return [4 /*yield*/, request.post({
                            uri: setting_1.elfSetting.ocpApim.gateWay,
                            qs: {
                                returnFaceId: true,
                                returnFaceLandmarks: true,
                                returnFaceAttributes: 'age,gender,emotion'
                            },
                            body: JSON.stringify({
                                url: qiNiu.download.jsDomain + "/" + params.imageName
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                'Ocp-Apim-Subscription-Key': setting_1.elfSetting.ocpApim.subscriptionKey
                            }
                        }, function (error, response, body) { return __awaiter(_this, void 0, void 0, function () {
                            var resultItems, result, playerState;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        resultItems = [];
                                        result = JSON.parse(body);
                                        if (error || result.error) {
                                            server_1.Log.e(error || result.error);
                                        }
                                        else {
                                            resultItems = result;
                                        }
                                        cb(resultItems);
                                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                                    case 1:
                                        playerState = _a.sent();
                                        playerState.result = resultItems[0];
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
