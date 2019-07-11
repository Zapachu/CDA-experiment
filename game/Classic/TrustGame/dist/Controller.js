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
var config_1 = require("./config");
var config_2 = require("./config");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.groups = [];
        return gameState;
    };
    Controller.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var round, playerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        round = this.game.params.round;
                        return [4 /*yield*/, _super.prototype.initPlayerState.call(this, actor)];
                    case 1:
                        playerState = _a.sent();
                        playerState.prices = Array(round).fill(null);
                        playerState.profits = Array(round).fill(0);
                        playerState.balances = Array(round).fill(0);
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, groupNum, groupParams, groupSize, round, playerState, gameState, playerStates, _b, groupIndex, group, _c, rounds, roundIndex, groupIndex_1, positionIndex, groupState_1, rounds_1, roundIndex_1, playerStatus, groupPlayerStates_1, i, newRoundTimer_1, newRoundInterval_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.game.params, groupNum = _a.group, groupParams = _a.groupParams, groupSize = _a.groupSize, round = _a.round;
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _d.sent();
                        _b = type;
                        switch (_b) {
                            case config_1.MoveType.getPosition: return [3 /*break*/, 4];
                            case config_1.MoveType.shout: return [3 /*break*/, 5];
                        }
                        return [3 /*break*/, 9];
                    case 4:
                        if (playerState.groupIndex !== undefined) {
                            return [3 /*break*/, 9];
                        }
                        groupIndex = gameState.groups.findIndex(function (_a) {
                            var playerNum = _a.playerNum;
                            return playerNum < groupSize;
                        });
                        if (groupIndex === -1) {
                            group = {
                                roundIndex: 0,
                                playerNum: 0,
                                rounds: Array(round).fill(null).map(function () { return ({
                                    playerStatus: Array(groupSize).fill(config_2.PlayerStatus.prepared)
                                }); })
                            };
                            groupIndex = gameState.groups.push(group) - 1;
                        }
                        playerState.groupIndex = groupIndex;
                        playerState.positionIndex = gameState.groups[groupIndex].playerNum++;
                        _c = gameState.groups[groupIndex], rounds = _c.rounds, roundIndex = _c.roundIndex;
                        if (gameState.groups.length > groupNum) {
                            rounds[roundIndex].playerStatus = Array(gameState.groups[groupIndex].playerNum).fill(config_2.PlayerStatus.memberFull);
                            return [3 /*break*/, 9];
                        }
                        if (playerState.positionIndex === 0) {
                            playerState.balances[roundIndex] = groupParams[groupIndex].initialFunding;
                        }
                        if (rounds[roundIndex].playerStatus.every(function (s) { return s === config_2.PlayerStatus.prepared; })) {
                            if (!rounds[roundIndex].currentPlayer) {
                                rounds[roundIndex].currentPlayer = 0;
                                rounds[roundIndex].playerStatus[rounds[roundIndex].currentPlayer] = config_2.PlayerStatus.timeToShout;
                            }
                        }
                        return [3 /*break*/, 9];
                    case 5:
                        groupIndex_1 = playerState.groupIndex, positionIndex = playerState.positionIndex, groupState_1 = gameState.groups[groupIndex_1], rounds_1 = groupState_1.rounds, roundIndex_1 = groupState_1.roundIndex, playerStatus = rounds_1[roundIndex_1].playerStatus, groupPlayerStates_1 = Object.values(playerStates).filter(function (s) { return s.groupIndex === groupIndex_1; });
                        playerState.prices[roundIndex_1] = params.price;
                        playerStatus[positionIndex] = config_2.PlayerStatus.shouted;
                        if (positionIndex === 0) {
                            playerState.balances[roundIndex_1] -= params.price;
                            groupPlayerStates_1[1].balances[roundIndex_1] += params.price * groupParams[groupIndex_1].magnification;
                        }
                        if (positionIndex === 1) {
                            playerState.balances[roundIndex_1] -= params.price;
                            groupPlayerStates_1[0].balances[roundIndex_1] += params.price;
                        }
                        rounds_1[roundIndex_1].currentPlayer += 1;
                        if (rounds_1[roundIndex_1].currentPlayer < groupSize) {
                            rounds_1[roundIndex_1].playerStatus[rounds_1[roundIndex_1].currentPlayer] = config_2.PlayerStatus.timeToShout;
                        }
                        if (!playerStatus.every(function (status) { return status === config_2.PlayerStatus.shouted; })) return [3 /*break*/, 9];
                        groupPlayerStates_1.map(function (p) { return p.profits[roundIndex_1] = p.balances[roundIndex_1]; });
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 6:
                        _d.sent();
                        if (!(roundIndex_1 == rounds_1.length - 1)) return [3 /*break*/, 8];
                        for (i in playerStatus)
                            playerStatus[i] = config_2.PlayerStatus.gameOver;
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 7:
                        _d.sent();
                        return [2 /*return*/];
                    case 8:
                        newRoundTimer_1 = 1;
                        newRoundInterval_1 = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        groupPlayerStates_1.forEach(function (_a) {
                                            var actor = _a.actor;
                                            return _this.push(actor, config_1.PushType.newRoundTimer, {
                                                roundIndex: roundIndex_1,
                                                newRoundTimer: newRoundTimer_1
                                            });
                                        });
                                        if (newRoundTimer_1++ < config_2.NEW_ROUND_TIMER) {
                                            return [2 /*return*/];
                                        }
                                        global.clearInterval(newRoundInterval_1);
                                        groupState_1.roundIndex++;
                                        rounds_1[groupState_1.roundIndex].currentPlayer = 0;
                                        rounds_1[groupState_1.roundIndex].playerStatus[0] = config_2.PlayerStatus.timeToShout;
                                        groupPlayerStates_1[0].balances[groupState_1.roundIndex] = groupParams[groupIndex_1].initialFunding;
                                        return [4 /*yield*/, this.stateManager.syncState()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                        _d.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
