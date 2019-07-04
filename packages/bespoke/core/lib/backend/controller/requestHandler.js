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
var protocol_1 = require("@elf/protocol");
var passport = require("passport");
var setting_1 = require("@elf/setting");
var server_util_1 = require("@bespoke/server-util");
var util_1 = require("../util");
var interface_1 = require("../interface");
var model_1 = require("../model");
var service_1 = require("../service");
var fs = require("fs");
var path = require("path");
var UserCtrl = /** @class */ (function () {
    function UserCtrl() {
    }
    UserCtrl.renderApp = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var chunk;
            return __generator(this, function (_a) {
                chunk = fs.readFileSync(path.resolve(__dirname, "../../../static/index.html")).toString();
                res.set('content-type', 'text/html');
                res.end("<script type=\"text/javascript\">\nObject.assign(window, {\n    NAMESPACE:'" + util_1.Setting.namespace + "',\n    WITH_LINKER:" + setting_1.elfSetting.bespokeWithLinker + ",\n    PRODUCT_ENV:" + setting_1.elfSetting.inProductEnv + "\n})\n</script>" +
                    chunk.replace(/static/g, util_1.Setting.namespace + "/static") +
                    ("<script type=\"text/javascript\" src=\"" + util_1.Setting.getClientPath() + "\"></script>"));
                return [2 /*return*/];
            });
        });
    };
    UserCtrl.getVerifyCode = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nationCode, mobile, sendResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.query, nationCode = _a.nationCode, mobile = _a.mobile;
                        return [4 /*yield*/, service_1.UserService.sendVerifyCode(+nationCode, mobile)];
                    case 1:
                        sendResult = _b.sent();
                        switch (sendResult.code) {
                            case service_1.UserService.sendVerifyCodeResCode.tooManyTimes:
                            case service_1.UserService.sendVerifyCodeResCode.countingDown: {
                                res.json({
                                    code: share_1.baseEnum.ResponseCode.invalidInput,
                                    msg: sendResult.msg
                                });
                                break;
                            }
                            case service_1.UserService.sendVerifyCodeResCode.sendError: {
                                res.json({
                                    code: share_1.baseEnum.ResponseCode.serverError
                                });
                                break;
                            }
                            case service_1.UserService.sendVerifyCodeResCode.success: {
                                res.json({
                                    code: share_1.baseEnum.ResponseCode.success
                                });
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    UserCtrl.handleLogin = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, nationCode, mobile, verifyCode, returnToUrl, _verifyCode, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, nationCode = _a.nationCode, mobile = _a.mobile, verifyCode = _a.verifyCode, returnToUrl = req.session.returnToUrl;
                        return [4 /*yield*/, protocol_1.redisClient.get(util_1.RedisKey.verifyCode(nationCode, mobile))];
                    case 1:
                        _verifyCode = _b.sent();
                        if (setting_1.elfSetting.inProductEnv && verifyCode !== _verifyCode) {
                            return [2 /*return*/, res.json({
                                    code: share_1.baseEnum.ResponseCode.notFound
                                })];
                        }
                        return [4 /*yield*/, model_1.UserModel.findOne({ mobile: mobile })];
                    case 2:
                        user = _b.sent();
                        if (!!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, new model_1.UserModel({
                                mobile: mobile,
                                role: share_1.baseEnum.AcademusRole.teacher
                            }).save()];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        passport.authenticate(interface_1.PassportStrategy.local, function (err, user) {
                            if (err || !user) {
                                res.json({
                                    code: share_1.baseEnum.ResponseCode.notFound
                                });
                            }
                            req.logIn(user, function (err) {
                                res.json(err ? {
                                    code: share_1.baseEnum.ResponseCode.notFound
                                } : {
                                    code: share_1.baseEnum.ResponseCode.success,
                                    returnToUrl: returnToUrl
                                });
                            });
                        })(req, res, next);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserCtrl.handleLogout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                req.logOut();
                res.json({
                    code: share_1.baseEnum.ResponseCode.success
                });
                return [2 /*return*/];
            });
        });
    };
    UserCtrl.getUser = function (req, res) {
        if (!req.user) {
            return res.json({
                code: share_1.baseEnum.ResponseCode.notFound
            });
        }
        var _a = req.user, id = _a.id, mobile = _a.mobile, role = _a.role;
        res.json({
            code: share_1.baseEnum.ResponseCode.success,
            user: { id: id, mobile: mobile, role: role }
        });
    };
    return UserCtrl;
}());
exports.UserCtrl = UserCtrl;
var GameCtrl = /** @class */ (function () {
    function GameCtrl() {
    }
    GameCtrl.getGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, gameId, game, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user, gameId = req.params.gameId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, service_1.GameDAO.getGame(gameId)];
                    case 2:
                        game = _a.sent();
                        if (!(!user || user._id.toString() !== game.owner)) return [3 /*break*/, 4];
                        return [4 /*yield*/, service_1.BaseLogic.getLogic(gameId)];
                    case 3:
                        game = (_a.sent()).getGame4Player();
                        _a.label = 4;
                    case 4:
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            game: game
                        });
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _a.sent();
                        server_util_1.Log.e(e_1);
                        res.json({
                            code: share_1.baseEnum.ResponseCode.notFound
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.newGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var game, owner, gameId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = req.body.game, owner = req.user;
                        return [4 /*yield*/, service_1.GameDAO.newGame(owner, game)];
                    case 1:
                        gameId = _a.sent();
                        res.json(gameId ? {
                            code: share_1.baseEnum.ResponseCode.success,
                            gameId: gameId
                        } : {
                            code: share_1.baseEnum.ResponseCode.serverError
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.shareGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, shareCode, title, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId;
                        return [4 /*yield*/, protocol_1.redisClient.get(util_1.RedisKey.share_GameCode(gameId))];
                    case 1:
                        shareCode = _a.sent();
                        return [4 /*yield*/, service_1.GameDAO.getGame(gameId)];
                    case 2:
                        title = (_a.sent()).title;
                        if (shareCode) {
                            return [2 /*return*/, res.json({
                                    code: share_1.baseEnum.ResponseCode.success,
                                    title: title,
                                    shareCode: shareCode
                                })];
                        }
                        shareCode = Math.random().toString().substr(2, 6);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, protocol_1.redisClient.setex(util_1.RedisKey.share_GameCode(gameId), util_1.CONFIG.shareCodeLifeTime, shareCode)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, protocol_1.redisClient.setex(util_1.RedisKey.share_CodeGame(shareCode), util_1.CONFIG.shareCodeLifeTime, gameId)];
                    case 5:
                        _a.sent();
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            title: title,
                            shareCode: shareCode
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        e_2 = _a.sent();
                        res.js({
                            code: share_1.baseEnum.ResponseCode.serverError
                        });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.joinWithShareCode = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var code, gameId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        code = req.body.code;
                        return [4 /*yield*/, protocol_1.redisClient.get(util_1.RedisKey.share_CodeGame(code))];
                    case 1:
                        gameId = _a.sent();
                        res.json(gameId ? {
                            code: share_1.baseEnum.ResponseCode.success,
                            gameId: gameId
                        } : {
                            code: share_1.baseEnum.ResponseCode.notFound
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getSimulatePlayers = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, simulatePlayers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId;
                        return [4 /*yield*/, model_1.SimulatePlayerModel.find({ gameId: gameId })];
                    case 1:
                        simulatePlayers = (_a.sent())
                            .map(function (_a) {
                            var gameId = _a.gameId, token = _a.token, name = _a.name;
                            return ({ gameId: gameId, token: token, name: name });
                        });
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            simulatePlayers: simulatePlayers
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.newSimulatePlayer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, name, token, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId, name = req.body.name;
                        token = util_1.Token.geneToken(Math.random());
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, new model_1.SimulatePlayerModel({ gameId: gameId, token: token, name: name }).save()];
                    case 2:
                        _a.sent();
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            token: token
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _a.sent();
                        res.json({
                            code: share_1.baseEnum.ResponseCode.serverError
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getMoveLogs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, moveLogs, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, model_1.MoveLogModel.find({ gameId: gameId }).lean()];
                    case 2:
                        moveLogs = _a.sent();
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            moveLogs: moveLogs
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        server_util_1.Log.e(err_1);
                        res.json({
                            code: share_1.baseEnum.ResponseCode.serverError
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getHistoryGameThumbs = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, historyGameThumbs, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, model_1.GameModel.find({
                                owner: user.id,
                                namespace: util_1.Setting.namespace
                            })
                                .limit(util_1.CONFIG.historyGamesListSize)
                                .sort({ createAt: -1 })];
                    case 2:
                        historyGameThumbs = (_a.sent()).map(function (_a) {
                            var id = _a.id, namespace = _a.namespace, title = _a.title, createAt = _a.createAt;
                            return ({ id: id, namespace: namespace, title: title, createAt: createAt });
                        });
                        res.json({
                            code: share_1.baseEnum.ResponseCode.success,
                            historyGameThumbs: historyGameThumbs
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        res.json({
                            code: share_1.baseEnum.ResponseCode.serverError
                        });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return GameCtrl;
}());
exports.GameCtrl = GameCtrl;
//# sourceMappingURL=requestHandler.js.map