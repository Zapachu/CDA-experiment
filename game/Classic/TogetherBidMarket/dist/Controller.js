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
    // async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    //   const {
    //     game: {
    //       params: { roundParams }
    //     }
    //   } = this;
    //   const playerState = await super.initPlayerState(actor);
    //   return playerState;
    // }
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, groupSize, positions, rounds, playerState, gameState, playerStates, groupIndex, group, positionParams_1, roundIndex_1, price, num, playerRound, playerStateArray, groupState, nextRoundIndex;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.game.params, groupSize = _a.groupSize, positions = _a.positions, rounds = _a.rounds;
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _b.sent();
                        switch (type) {
                            case config_1.MoveType.getPosition:
                                if (playerState.groupIndex !== undefined) {
                                    break;
                                }
                                groupIndex = gameState.groups.findIndex(function (_a) {
                                    var playerNum = _a.playerNum;
                                    return playerNum < groupSize;
                                });
                                if (groupIndex === -1) {
                                    group = {
                                        roundIndex: 0,
                                        playerNum: 0,
                                        rounds: Array(rounds)
                                            .fill(null)
                                            .map(function () { return ({
                                            strikePrice: undefined,
                                            strikeNum: undefined
                                        }); })
                                    };
                                    groupIndex = gameState.groups.push(group) - 1;
                                }
                                playerState.groupIndex = groupIndex;
                                playerState.positionIndex = gameState.groups[groupIndex].playerNum++;
                                positionParams_1 = positions[playerState.positionIndex];
                                playerState.role = positionParams_1.role;
                                playerState.rounds = Array(rounds)
                                    .fill(null)
                                    .map(function (_, i) { return ({
                                    status: config_1.PlayerStatus.prepared,
                                    startingPrice: positionParams_1.startingPrices[i],
                                    startingQuota: positionParams_1.startingQuotas[i],
                                    privateValue: positionParams_1.privateValues[i],
                                    price: undefined,
                                    bidNum: undefined,
                                    actualNum: 0,
                                    profit: 0
                                }); });
                                break;
                            case config_1.MoveType.shout: {
                                roundIndex_1 = params.roundIndex, price = params.price, num = params.num;
                                playerRound = playerState.rounds[roundIndex_1];
                                if (playerRound.price !== undefined) {
                                    return [2 /*return*/];
                                }
                                if (this.invalidParams(playerState, params)) {
                                    return [2 /*return*/, cb(playerState.role === 0 ? "价格应不大于估值" : "价格应不小于估值")];
                                }
                                playerRound.price = price;
                                playerRound.bidNum = num;
                                playerRound.status = config_1.PlayerStatus.shouted;
                                playerStateArray = Object.values(playerStates).filter(function (ps) { return ps.groupIndex === playerState.groupIndex; });
                                if (playerStateArray.length < groupSize ||
                                    playerStateArray.some(function (ps) { return ps.rounds[roundIndex_1].price === undefined; })) {
                                    return [2 /*return*/];
                                }
                                groupState = gameState.groups[playerState.groupIndex];
                                this.processProfits(groupState, playerStateArray);
                                this.tickNextRound(roundIndex_1, groupState, playerStateArray);
                                break;
                            }
                            case config_1.MoveType.nextRound: {
                                nextRoundIndex = params.nextRoundIndex;
                                if (nextRoundIndex < rounds) {
                                    gameState.groups[playerState.groupIndex].roundIndex = nextRoundIndex;
                                }
                                break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.tickNextRound = function (roundIndex, groupState, playerStates) {
        var _this = this;
        var rounds = this.game.params.rounds;
        if (roundIndex === rounds - 1) {
            return;
        }
        var newRoundTimer = 1;
        var newRoundInterval = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        playerStates.forEach(function (_a) {
                            var actor = _a.actor;
                            return _this.push(actor, config_1.PushType.newRoundTimer, {
                                roundIndex: roundIndex,
                                newRoundTimer: newRoundTimer
                            });
                        });
                        if (newRoundTimer++ < config_1.NEW_ROUND_TIMER) {
                            return [2 /*return*/];
                        }
                        global.clearInterval(newRoundInterval);
                        groupState.roundIndex = Math.min(groupState.roundIndex + 1, rounds - 1);
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
    };
    Controller.prototype.invalidParams = function (playerState, params) {
        var roundIndex = params.roundIndex, price = params.price, num = params.num;
        var role = playerState.role;
        var _a = playerState.rounds[roundIndex], startingPrice = _a.startingPrice, startingQuota = _a.startingQuota, privateValue = _a.privateValue;
        return (!price ||
            !num ||
            (role === 0 && (price * num > startingPrice || price > privateValue)) ||
            (role == 1 && (num > startingQuota || price < privateValue)));
    };
    Controller.prototype.processProfits = function (groupState, playerStates) {
        var roundIndex = groupState.roundIndex, rounds = groupState.rounds;
        var buyerList = playerStates
            .filter(function (ps) { return ps.role === 0; })
            .map(function (ps) { return ps.rounds[roundIndex]; })
            .sort(function (a, b) { return b.price - a.price; });
        var sellerList = playerStates
            .filter(function (ps) { return ps.role === 1; })
            .map(function (ps) { return ps.rounds[roundIndex]; })
            .sort(function (a, b) { return a.price - b.price; });
        var _a = this._strikeDeal(buyerList, sellerList), strikePrice = _a.strikePrice, strikeNum = _a.strikeNum;
        this._updateGameState(rounds[roundIndex], strikePrice, strikeNum);
        this._updatePlayerStates(playerStates, roundIndex, strikePrice);
    };
    Controller.prototype._strikeDeal = function (buyerList, sellerList) {
        var buyerIndex = 0;
        var sellerIndex = 0;
        var strikeNum = 0;
        var strikePrice = 0;
        while (buyerIndex < buyerList.length && sellerIndex < sellerList.length) {
            var buyer = buyerList[buyerIndex];
            var seller = sellerList[sellerIndex];
            if (buyer.price >= seller.price) {
                var num = Math.min(buyer.bidNum - buyer.actualNum, seller.bidNum - seller.actualNum);
                buyer.actualNum += num;
                seller.actualNum += num;
                strikeNum += num;
                strikePrice = (buyer.price + seller.price) / 2;
                if (buyer.actualNum === buyer.bidNum) {
                    buyerIndex++;
                }
                else {
                    sellerIndex++;
                }
            }
            else {
                break;
            }
        }
        return { strikePrice: strikePrice, strikeNum: strikeNum };
    };
    Controller.prototype._updatePlayerStates = function (playerStates, roundIndex, strikePrice) {
        playerStates.forEach(function (ps) {
            var playerRound = ps.rounds[roundIndex];
            playerRound.status = config_1.PlayerStatus.result;
            if (!playerRound.actualNum) {
                return;
            }
            if (ps.role === 0) {
                playerRound.profit =
                    (playerRound.privateValue - strikePrice) * playerRound.actualNum;
            }
            else {
                playerRound.profit =
                    (strikePrice - playerRound.privateValue) * playerRound.actualNum;
            }
        });
    };
    Controller.prototype._updateGameState = function (roundState, strikePrice, strikeNum) {
        roundState.strikePrice = strikePrice;
        roundState.strikeNum = strikeNum;
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
