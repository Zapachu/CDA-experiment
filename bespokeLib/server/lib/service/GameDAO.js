"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var setting_1 = require("@elf/setting");
var protocol_1 = require("@elf/protocol");
var util_1 = require("@elf/util");
var util_2 = require("../util");
var model_1 = require("../model");
var GameDAO = /** @class */ (function () {
    function GameDAO() {
    }
    GameDAO.newGame = function (owner, gameConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var newGame, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, model_1.GameModel.create(__assign(__assign({}, gameConfig), { owner: owner, namespace: util_2.Setting.namespace }))];
                    case 1:
                        newGame = _a.sent();
                        return [2 /*return*/, newGame.id];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameDAO.getGame = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, owner, namespace, title, params, elfGameId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, model_1.GameModel.findById(gameId)];
                    case 1:
                        _a = _b.sent(), id = _a.id, owner = _a.owner, namespace = _a.namespace, title = _a.title, params = _a.params, elfGameId = _a.elfGameId;
                        return [2 /*return*/, {
                                id: id,
                                owner: owner.toString(),
                                namespace: namespace,
                                title: title,
                                params: params,
                                elfGameId: elfGameId
                            }];
                }
            });
        });
    };
    //region persist state
    GameDAO.saveGameState = function (gameId, gameState) {
        setting_1.elfSetting.inProductEnv &&
            protocol_1.redisClient.set(util_2.RedisKey.gameState(gameId), JSON.stringify(gameState)).catch(function (reason) { return util_1.Log.e(reason); });
    };
    GameDAO.savePlayerState = function (gameId, token, playerState) {
        setting_1.elfSetting.inProductEnv &&
            protocol_1.redisClient.set(util_2.RedisKey.playerState(gameId, token), JSON.stringify(playerState)).catch(function (reason) { return util_1.Log.e(reason); });
    };
    GameDAO.queryGameState = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!setting_1.elfSetting.inProductEnv) return [3 /*break*/, 2];
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, protocol_1.redisClient.get(util_2.RedisKey.gameState(gameId))];
                    case 1:
                        _a = _c.apply(_b, [_d.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _d.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GameDAO.queryPlayerState = function (gameId, token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!setting_1.elfSetting.inProductEnv) return [3 /*break*/, 2];
                        _c = (_b = JSON).parse;
                        return [4 /*yield*/, protocol_1.redisClient.get(util_2.RedisKey.playerState(gameId, token))];
                    case 1:
                        _a = _c.apply(_b, [_d.sent()]);
                        return [3 /*break*/, 3];
                    case 2:
                        _a = null;
                        _d.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    GameDAO.getPlayerTokens = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var key, tokens;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        key = util_2.RedisKey.playerStates(gameId);
                        return [4 /*yield*/, protocol_1.redisClient.keys(key)];
                    case 1:
                        tokens = _a.sent();
                        return [2 /*return*/, tokens.map(function (token) { return token.slice(key.length - 1); })];
                }
            });
        });
    };
    __decorate([
        util_2.cacheResult
    ], GameDAO, "getGame", null);
    return GameDAO;
}());
exports.GameDAO = GameDAO;
