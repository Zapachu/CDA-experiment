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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _common_1 = require("@common");
var _server_util_1 = require("@server-util");
var util_1 = require("@elf/util");
var share_1 = require("@elf/share");
var _server_service_1 = require("@server-service");
var WebpackHmr_1 = require("../util/WebpackHmr");
var PlayerService_1 = require("../service/PlayerService");
var SECONDS_PER_DAY = 86400;
var DEFAULT_PAGE_SIZE = 11;
var UserCtrl = /** @class */ (function () {
    function UserCtrl() {
    }
    UserCtrl.renderApp = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                WebpackHmr_1.WebpackHmr.sendIndexHtml(res, next);
                return [2 /*return*/];
            });
        });
    };
    UserCtrl.loggedIn = function (req, res, next) {
        var _a = _common_1.config.academus.route, prefix = _a.prefix, login = _a.login;
        req.isAuthenticated() ? next() : res.redirect("" + prefix + login);
    };
    UserCtrl.mobileValid = function (req, res, next) {
        var _a = _common_1.config.academus.route, prefix = _a.prefix, profileMobile = _a.profileMobile;
        var mobile = req.user.mobile;
        mobile && !mobile.startsWith('null') ? next() : res.redirect("" + prefix + profileMobile);
    };
    UserCtrl.isTeacher = function (req, res, next) {
        req.user.role === share_1.AcademusRole.teacher ? next() : res.redirect("/" + _common_1.config.rootName + "/join");
    };
    UserCtrl.isTemplateAccessible = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var templates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _server_service_1.PhaseService.getPhaseTemplates(req.user._id.toString())];
                    case 1:
                        templates = _a.sent();
                        templates.some(function (_a) {
                            var namespace = _a.namespace;
                            return namespace === req.params.namespace;
                        }) ? next() : res.redirect("/" + _common_1.config.rootName);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserCtrl.isGameAccessible = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, gameId, userId, owner, player;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = req.user._id, gameId = req.params.gameId, userId = _id.toString();
                        return [4 /*yield*/, _server_service_1.GameService.getGame(gameId)];
                    case 1:
                        owner = (_a.sent()).owner;
                        if (owner === userId) {
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, PlayerService_1.PlayerService.findPlayerId(gameId, userId)];
                    case 2:
                        player = _a.sent();
                        console.log(player);
                        if (player) {
                            return [2 /*return*/, next()];
                        }
                        res.redirect("/" + _common_1.config.rootName + "/info/" + gameId);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserCtrl.getUser = function (req, res) {
        if (!req.isAuthenticated()) {
            res.json({
                code: share_1.ResponseCode.notFound
            });
        }
        var _a = req.user, _id = _a._id, name = _a.name, role = _a.role, mobile = _a.mobile, orgCode = _a.orgCode;
        res.json({
            code: share_1.ResponseCode.success,
            user: { id: _id.toString(), name: name, role: role, mobile: mobile, orgCode: orgCode }
        });
    };
    return UserCtrl;
}());
exports.UserCtrl = UserCtrl;
var GameCtrl = /** @class */ (function () {
    function GameCtrl() {
    }
    GameCtrl.getPhaseTemplates = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var templates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _server_service_1.PhaseService.getPhaseTemplates(req.user._id.toString())];
                    case 1:
                        templates = _a.sent();
                        res.json({
                            code: share_1.ResponseCode.success,
                            templates: templates
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.saveNewGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, title, desc, namespace, params, _b, owner, orgCode, session, gameId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, title = _a.title, desc = _a.desc, namespace = _a.namespace, params = _a.params, _b = req.user, owner = _b.id, orgCode = _b.orgCode, session = req.session;
                        return [4 /*yield*/, _server_service_1.GameService.saveGame({
                                owner: owner,
                                orgCode: session.orgCode || orgCode,
                                title: title,
                                desc: desc,
                                namespace: namespace,
                                params: params
                            })];
                    case 1:
                        gameId = _c.sent();
                        res.json({
                            code: share_1.ResponseCode.success,
                            gameId: gameId
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getGameList = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, _a, _b, page, _c, pageSize, _d, count, gameList;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _id = req.user._id, _a = req.query, _b = _a.page, page = _b === void 0 ? 0 : _b, _c = _a.pageSize, pageSize = _c === void 0 ? DEFAULT_PAGE_SIZE : _c;
                        return [4 /*yield*/, _server_service_1.GameService.getGameList(_id, +page, +pageSize)];
                    case 1:
                        _d = _e.sent(), count = _d.count, gameList = _d.gameList;
                        res.json({
                            code: share_1.ResponseCode.success,
                            count: count,
                            gameList: gameList
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getBaseGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, _a, params, game;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        gameId = req.params.gameId;
                        return [4 /*yield*/, _server_service_1.GameService.getGame(gameId)];
                    case 1:
                        _a = _b.sent(), params = _a.params, game = __rest(_a, ["params"]);
                        res.json({
                            code: share_1.ResponseCode.success,
                            game: game
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.getGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, game;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId;
                        return [4 /*yield*/, _server_service_1.GameService.getGame(gameId)];
                    case 1:
                        game = _a.sent();
                        res.json({
                            code: share_1.ResponseCode.success,
                            game: game
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.shareGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var gameId, shareCode, title, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gameId = req.params.gameId;
                        return [4 /*yield*/, _server_util_1.redisClient.get(_server_util_1.RedisKey.share_GameCode(gameId))];
                    case 1:
                        shareCode = _a.sent();
                        return [4 /*yield*/, _server_service_1.GameService.getGame(gameId)];
                    case 2:
                        title = (_a.sent()).title;
                        if (shareCode) {
                            return [2 /*return*/, res.json({
                                    code: share_1.ResponseCode.success,
                                    title: title,
                                    shareCode: shareCode
                                })];
                        }
                        shareCode = Math.random().toString().substr(2, 6);
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 6, , 7]);
                        return [4 /*yield*/, _server_util_1.redisClient.setex(_server_util_1.RedisKey.share_GameCode(gameId), SECONDS_PER_DAY, shareCode)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, _server_util_1.redisClient.setex(_server_util_1.RedisKey.share_CodeGame(shareCode), SECONDS_PER_DAY, gameId)];
                    case 5:
                        _a.sent();
                        res.json({
                            code: share_1.ResponseCode.success,
                            title: title,
                            shareCode: shareCode
                        });
                        return [3 /*break*/, 7];
                    case 6:
                        e_1 = _a.sent();
                        res.js({
                            code: share_1.ResponseCode.serverError
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
                        return [4 /*yield*/, _server_util_1.redisClient.get(_server_util_1.RedisKey.share_CodeGame(code))];
                    case 1:
                        gameId = _a.sent();
                        res.json(gameId ? {
                            code: share_1.ResponseCode.success,
                            gameId: gameId
                        } : {
                            code: share_1.ResponseCode.notFound
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameCtrl.joinGame = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _id, gameId, userId, playerId, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _id = req.user._id, gameId = req.params.gameId, userId = _id.toString();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, PlayerService_1.PlayerService.findPlayerId(gameId, userId)];
                    case 2:
                        playerId = _a.sent();
                        if (!!playerId) return [3 /*break*/, 4];
                        return [4 /*yield*/, PlayerService_1.PlayerService.savePlayer(gameId, userId)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        e_2 = _a.sent();
                        return [2 /*return*/, res.json({
                                code: share_1.ResponseCode.serverError
                            })];
                    case 6: return [2 /*return*/, res.json({
                            code: share_1.ResponseCode.success
                        })];
                }
            });
        });
    };
    GameCtrl.getActor = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var user, gameId, userId, game, playerId, token, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = req.user, gameId = req.params.gameId, userId = user._id.toString();
                        return [4 /*yield*/, _server_service_1.GameService.getGame(gameId)];
                    case 1:
                        game = _a.sent();
                        return [4 /*yield*/, PlayerService_1.PlayerService.findPlayerId(gameId, userId)];
                    case 2:
                        playerId = _a.sent();
                        token = util_1.Token.geneToken(userId === game.owner ? userId : playerId), type = userId === game.owner ? share_1.Actor.owner : share_1.Actor.player;
                        req.session.actor = {
                            token: token,
                            type: type
                        };
                        res.json({
                            code: share_1.ResponseCode.success,
                            game: game,
                            actor: { token: token, type: type, playerId: playerId }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameCtrl;
}());
exports.GameCtrl = GameCtrl;
//# sourceMappingURL=requestHandler.js.map