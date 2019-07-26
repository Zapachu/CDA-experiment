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
var cloneDeep = require("lodash/cloneDeep");
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
    Controller.prototype.getGame4Player = function () {
        var game = cloneDeep(this.game);
        game.params.groupPPs = [];
        return game;
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, group, groupSize, round, groupPPs, playerState, gameState, playerStates, groupIndex, newGroup, groupIndex, positionIndex, _b, rounds, roundIndex, groups, groupIndex_1, positionIndex, playerRounds, groupState_1, _c, roundIndex_1, groupRounds_1, playerStatus_1, groupPlayerStates_1;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.game.params, group = _a.group, groupSize = _a.groupSize, round = _a.round, groupPPs = _a.groupPPs;
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _d.sent();
                        switch (type) {
                            case config_1.MoveType.getPosition: {
                                if (playerState.groupIndex !== undefined) {
                                    break;
                                }
                                groupIndex = gameState.groups.findIndex(function (_a) {
                                    var playerNum = _a.playerNum;
                                    return playerNum < groupSize;
                                });
                                if (groupIndex === -1) {
                                    newGroup = {
                                        roundIndex: 0,
                                        playerNum: 0,
                                        rounds: Array(round).fill(null).map(function (_, i) { return ({
                                            playerStatus: Array(groupSize).fill(i === 0 ? config_1.PlayerStatus.outside : config_1.PlayerStatus.prepared),
                                            matchResults: []
                                        }); })
                                    };
                                    if (gameState.groups.length >= group) {
                                        break;
                                    }
                                    groupIndex = gameState.groups.push(newGroup) - 1;
                                }
                                playerState.groupIndex = groupIndex;
                                playerState.positionIndex = gameState.groups[groupIndex].playerNum++;
                                playerState.rounds = groupPPs[groupIndex].roundPPs.map(function (_a) {
                                    var playerPPs = _a.playerPPs;
                                    var privatePrices = playerPPs[playerState.positionIndex].privatePrices;
                                    return { privatePrices: privatePrices };
                                });
                                break;
                            }
                            case config_1.MoveType.enterMarket: {
                                groupIndex = playerState.groupIndex, positionIndex = playerState.positionIndex, _b = gameState.groups[groupIndex], rounds = _b.rounds, roundIndex = _b.roundIndex;
                                rounds[roundIndex].playerStatus[positionIndex] = config_1.PlayerStatus.prepared;
                                break;
                            }
                            case config_1.MoveType.submit: {
                                groups = gameState.groups;
                                groupIndex_1 = playerState.groupIndex, positionIndex = playerState.positionIndex, playerRounds = playerState.rounds, groupState_1 = gameState.groups[groupIndex_1], _c = groups[groupIndex_1], roundIndex_1 = _c.roundIndex, groupRounds_1 = _c.rounds, playerStatus_1 = groupRounds_1[roundIndex_1].playerStatus, groupPlayerStates_1 = Object.values(playerStates).filter(function (s) { return s.groupIndex === groupIndex_1; });
                                playerStatus_1[positionIndex] = config_1.PlayerStatus.submitted;
                                playerRounds[roundIndex_1].preferences = params.preferences;
                                playerRounds[roundIndex_1].submitTime = new Date().getTime();
                                if (playerStatus_1.every(function (status) { return status === config_1.PlayerStatus.submitted; })) {
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        var matchResults;
                                        var _this = this;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    groupRounds_1[roundIndex_1].playerStatus = playerStatus_1.map(function () { return config_1.PlayerStatus.matched; });
                                                    matchResults = groupRounds_1[roundIndex_1].matchResults;
                                                    groupPlayerStates_1.map(function (_a) {
                                                        var rounds = _a.rounds;
                                                        return rounds[roundIndex_1];
                                                    })
                                                        .sort(function (_a, _b) {
                                                        var t1 = _a.submitTime;
                                                        var t2 = _b.submitTime;
                                                        return t2 - t1;
                                                    })
                                                        .forEach(function (_a) {
                                                        var preferences = _a.preferences, privatePrices = _a.privatePrices;
                                                        var preferIndex = preferences.findIndex(function (i) { return matchResults.every(function (_a) {
                                                            var index = _a.index;
                                                            return i !== index;
                                                        }); }), index = preferences[preferIndex];
                                                        matchResults.push({
                                                            index: index,
                                                            price: privatePrices[preferIndex]
                                                        });
                                                    });
                                                    return [4 /*yield*/, this.stateManager.syncState()];
                                                case 1:
                                                    _a.sent();
                                                    if (roundIndex_1 == this.game.params.round - 1) {
                                                        return [2 /*return*/];
                                                    }
                                                    global.setTimeout(function () {
                                                        var newRoundTimer = 1;
                                                        var newRoundInterval = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                                            var _this = this;
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0:
                                                                        groupPlayerStates_1.forEach(function (_a) {
                                                                            var actor = _a.actor;
                                                                            return _this.push(actor, config_1.PushType.newRoundTimer, {
                                                                                roundIndex: roundIndex_1,
                                                                                newRoundTimer: newRoundTimer
                                                                            });
                                                                        });
                                                                        if (newRoundTimer++ < config_1.NEW_ROUND_TIMER) {
                                                                            return [2 /*return*/];
                                                                        }
                                                                        global.clearInterval(newRoundInterval);
                                                                        groupState_1.roundIndex++;
                                                                        return [4 /*yield*/, this.stateManager.syncState()];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); }, 1000);
                                                    }, config_1.DEAL_TIMER * 1000);
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 2000);
                                }
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
