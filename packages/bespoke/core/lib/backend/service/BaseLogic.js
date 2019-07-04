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
var server_util_1 = require("@bespoke/server-util");
var protocol_1 = require("@elf/protocol");
var EventIO_1 = require("./EventIO");
var GameDAO_1 = require("./GameDAO");
var StateManager_1 = require("./StateManager");
var MoveQueue_1 = require("./MoveQueue");
var util_1 = require("../util");
var BaseLogic = /** @class */ (function () {
    function BaseLogic(game) {
        this.game = game;
        this.connections = new Map();
    }
    BaseLogic.init = function (Controller, sncStrategy) {
        if (sncStrategy === void 0) { sncStrategy = share_1.SyncStrategy.default; }
        this.Controller = Controller;
        this.sncStrategy = sncStrategy;
    };
    BaseLogic.getLogic = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var game, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (!!this.controllers.get(gameId)) return [3 /*break*/, 3];
                        return [4 /*yield*/, GameDAO_1.GameDAO.getGame(gameId)];
                    case 1:
                        game = _d.sent();
                        _b = (_a = this.controllers).set;
                        _c = [gameId];
                        return [4 /*yield*/, new this.Controller(game).init()];
                    case 2:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        _d.label = 3;
                    case 3: return [2 /*return*/, this.controllers.get(gameId)];
                }
            });
        });
    };
    BaseLogic.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stateManager = new StateManager_1.StateManager(BaseLogic.sncStrategy, this);
                this.moveQueue = new MoveQueue_1.MoveQueue(this.game, this.stateManager);
                return [2 /*return*/, this];
            });
        });
    };
    BaseLogic.prototype.getGame4Player = function () {
        return this.game;
    };
    BaseLogic.prototype.initGameState = function () {
        return {
            status: share_1.GameStatus.started
        };
    };
    BaseLogic.prototype.filterGameState = function (gameState) {
        return gameState;
    };
    BaseLogic.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, {
                        actor: actor
                    }];
            });
        });
    };
    BaseLogic.prototype.onGameOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    BaseLogic.prototype.moveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.moveQueue.push(actor, type, params, function () { return __awaiter(_this, void 0, void 0, function () {
                    var _a, gameState;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(actor.type === share_1.Actor.owner)) return [3 /*break*/, 8];
                                _a = type;
                                switch (_a) {
                                    case share_1.CoreMove.switchGameStatus: return [3 /*break*/, 1];
                                }
                                return [3 /*break*/, 5];
                            case 1: return [4 /*yield*/, this.stateManager.getGameState()];
                            case 2:
                                gameState = _b.sent();
                                if (!(params.status === share_1.GameStatus.over)) return [3 /*break*/, 4];
                                return [4 /*yield*/, this.onGameOver()];
                            case 3:
                                _b.sent();
                                _b.label = 4;
                            case 4:
                                gameState.status = params.status;
                                return [3 /*break*/, 7];
                            case 5: return [4 /*yield*/, this.teacherMoveReducer(actor, type, params, cb)];
                            case 6:
                                _b.sent();
                                _b.label = 7;
                            case 7: return [3 /*break*/, 10];
                            case 8: return [4 /*yield*/, this.playerMoveReducer(actor, type, params, cb)];
                            case 9:
                                _b.sent();
                                _b.label = 10;
                            case 10: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    BaseLogic.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                server_util_1.Log.i(actor.token, type, params, cb);
                return [2 /*return*/];
            });
        });
    };
    BaseLogic.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                server_util_1.Log.i(actor.token, type, params, cb);
                return [2 /*return*/];
            });
        });
    };
    BaseLogic.prototype.startRobot = function (key, meta) {
        return __awaiter(this, void 0, void 0, function () {
            var actor;
            return __generator(this, function (_a) {
                actor = { token: util_1.Token.geneToken("" + this.game.id + key), type: share_1.Actor.serverRobot };
                EventIO_1.EventIO.startRobot(actor, this.game, meta);
                return [2 /*return*/];
            });
        });
    };
    //region pushEvent
    BaseLogic.prototype.push = function (actors, type, params) {
        var _this = this;
        var _actors = Array.isArray(actors) ? actors : [actors];
        setTimeout(function () { return _actors.forEach(function (actor) {
            try {
                EventIO_1.EventIO.emitEvent(_this.connections.get(actor.token).id, share_1.SocketEvent.push, type, params);
            }
            catch (e) {
                server_util_1.Log.e(e);
            }
        }); }, 0);
    };
    BaseLogic.prototype.broadcast = function (type, params) {
        var _this = this;
        setTimeout(function () { return EventIO_1.EventIO.emitEvent(_this.game.id, share_1.SocketEvent.push, type, params); }, 0);
    };
    //endregion
    //region elf
    BaseLogic.prototype.setPhaseResult = function (playerToken, phaseResult) {
        if (!this.game.elfGameId) {
            return server_util_1.Log.w('Bespoke单独部署，game未关联至Elf group');
        }
        protocol_1.RedisCall.call(protocol_1.SetPhaseResult.name, {
            playUrl: util_1.gameId2PlayUrl(this.game.id),
            playerToken: playerToken,
            elfGameId: this.game.elfGameId,
            phaseResult: phaseResult
        }).catch(function (e) { return server_util_1.Log.e(e); });
    };
    BaseLogic.prototype.sendBackPlayer = function (playerToken, phaseResult, nextPhaseKey) {
        var _this = this;
        if (!this.game.elfGameId) {
            return server_util_1.Log.w('Bespoke单独部署，game未关联至Elf group');
        }
        protocol_1.RedisCall.call(protocol_1.SendBackPlayer.name, {
            playUrl: util_1.gameId2PlayUrl(this.game.id),
            playerToken: playerToken,
            elfGameId: this.game.elfGameId,
            phaseResult: phaseResult,
            nextPhaseKey: nextPhaseKey
        })
            .catch(function (e) { return server_util_1.Log.e(e); })
            .then(function (_a) {
            var sendBackUrl = _a.sendBackUrl;
            return EventIO_1.EventIO.emitEvent(_this.connections.get(playerToken).id, share_1.SocketEvent.sendBack, sendBackUrl);
        });
    };
    BaseLogic.controllers = new Map();
    return BaseLogic;
}());
exports.BaseLogic = BaseLogic;
//# sourceMappingURL=BaseLogic.js.map