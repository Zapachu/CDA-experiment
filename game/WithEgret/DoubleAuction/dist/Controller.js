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
var server_1 = require("@bespoke/server");
var protocol_1 = require("@elf/protocol");
var config_1 = require("./config");
var ROUND = config_1.Config.ROUND, PLAYER_NUM = config_1.Config.PLAYER_NUM, PREPARE_TIME = config_1.Config.PREPARE_TIME, RESULT_TIME = config_1.Config.RESULT_TIME, TRADE_TIME = config_1.Config.TRADE_TIME;
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.playerIndex = 0;
        gameState.scene = config_1.GameScene.prepare;
        gameState.rounds = Array(ROUND).fill(null).map(function () { return ({ time: 0, shouts: [], trades: [] }); });
        gameState.prepareTime = 0;
        return gameState;
    };
    Controller.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initPlayerState.call(this, actor)];
                    case 1:
                        playerState = _a.sent();
                        playerState.profits = [];
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.startPrepareCountDown = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, timer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        gameState.prepareTime++;
                        timer = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(++gameState.prepareTime === PREPARE_TIME)) return [3 /*break*/, 2];
                                        global.clearInterval(timer);
                                        gameState.scene = config_1.GameScene.trade;
                                        Array(PLAYER_NUM - gameState.playerIndex).fill(null).forEach(function (_, i) { return __awaiter(_this, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, this.startRobot(i)];
                                                    case 1:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        return [4 /*yield*/, this.startRoundCountDown(0)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [4 /*yield*/, this.stateManager.syncState()];
                                    case 3:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1E3);
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.startRoundCountDown = function (round) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, timer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        gameState.roundIndex = round;
                        timer = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var time;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        time = ++gameState.rounds[round].time;
                                        if (time === ~~(TRADE_TIME >> 2)) {
                                            this.broadcast(config_1.PushType.beginRound, { round: round });
                                        }
                                        if (!(time === TRADE_TIME + RESULT_TIME)) return [3 /*break*/, 3];
                                        global.clearInterval(timer);
                                        if (!(round < ROUND - 1)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.startRoundCountDown(round + 1)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        gameState.scene = config_1.GameScene.result;
                                        _a.label = 3;
                                    case 3: return [4 /*yield*/, this.stateManager.syncState()];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1E3);
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerState, _a, _b, shouts, trades, myShout_1, pairShoutIndex, res;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _c.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _c.sent();
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.getIndex: return [3 /*break*/, 3];
                            case config_1.MoveType.shout: return [3 /*break*/, 6];
                            case config_1.MoveType.onceMore: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 3:
                        if ((playerState.index !== undefined) || (gameState.playerIndex >= PLAYER_NUM)) {
                            return [3 /*break*/, 9];
                        }
                        playerState.index = gameState.playerIndex++;
                        playerState.role = playerState.index % 2 ? config_1.Role.buyer : config_1.Role.seller;
                        playerState.privatePrices = Array(ROUND).fill(null).map(function () { return ~~(Math.random() * 20 * (playerState.role === config_1.Role.seller ? -1 : 1) + 70); });
                        if (!(playerState.index === 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.startPrepareCountDown()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        {
                            _b = gameState.rounds[gameState.roundIndex], shouts = _b.shouts, trades = _b.trades;
                            myShout_1 = shouts[playerState.index];
                            if (myShout_1 && myShout_1.traded) {
                                return [3 /*break*/, 9];
                            }
                            myShout_1 = {
                                price: params.price,
                                role: playerState.role
                            };
                            shouts[playerState.index] = myShout_1;
                            pairShoutIndex = shouts.findIndex(function (shout) {
                                if (!shout || (shout.role === myShout_1.role) || shout.traded) {
                                    return false;
                                }
                                return myShout_1.role === config_1.Role.seller ? shout.price >= myShout_1.price : shout.price <= myShout_1.price;
                            });
                            if (pairShoutIndex === -1) {
                                return [3 /*break*/, 9];
                            }
                            myShout_1.traded = true;
                            shouts[pairShoutIndex].traded = true;
                            trades.push({
                                reqIndex: pairShoutIndex,
                                resIndex: playerState.index,
                                price: shouts[pairShoutIndex].price
                            });
                            return [3 /*break*/, 9];
                        }
                        _c.label = 7;
                    case 7: return [4 /*yield*/, protocol_1.RedisCall.call(protocol_1.GameOver.name, {
                            playUrl: server_1.gameId2PlayUrl(this.game.id, actor.token),
                            onceMore: true,
                            namespace: config_1.namespace
                        })];
                    case 8:
                        res = _c.sent();
                        res ? cb(res.lobbyUrl) : null;
                        _c.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
