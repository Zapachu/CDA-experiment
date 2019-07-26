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
var stock_trading_config_1 = require("@bespoke-game/stock-trading-config");
var protocol_1 = require("@elf/protocol");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.matchIntervals = {};
        _this.shoutIntervals = {};
        return _this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.groups = [];
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
                        playerState.playerStatus = config_1.PlayerStatus.intro;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerState, gameState, playerStates, _a, groupIndex, group, groupIndex_1, group_1, groupPlayerStates, playerStatus, group_2, groupIndex_2, playerRounds, roundIndex, gameRounds, min, _b, privateValue, startingPrice, _c, privateValue, startingPrice, roundIndex, gameRounds, min, errMsg, groupPlayerStates_1, investorStates_1, marketState_1, playerStatus, onceMore, res;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        groupSize = this.game.params.groupSize;
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _d.sent();
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.startMulti: return [3 /*break*/, 4];
                            case config_1.MoveType.joinRobot: return [3 /*break*/, 5];
                            case config_1.MoveType.shout: return [3 /*break*/, 6];
                            case config_1.MoveType.nextGame: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 4:
                        {
                            if (playerState.playerStatus !== config_1.PlayerStatus.intro) {
                                return [3 /*break*/, 9];
                            }
                            groupIndex = gameState.groups.findIndex(function (_a) {
                                var playerNum = _a.playerNum, isMulti = _a.isMulti;
                                return playerNum < groupSize && isMulti;
                            });
                            if (groupIndex === -1) {
                                group = {
                                    playerNum: 0,
                                    roundIndex: 0,
                                    isMulti: true,
                                    rounds: [{}]
                                };
                                groupIndex = gameState.groups.push(group) - 1;
                                this.startMatchTicking(group, groupIndex);
                            }
                            this._joinPlayer(playerState, gameState.groups[groupIndex], groupIndex);
                            return [3 /*break*/, 9];
                        }
                        _d.label = 5;
                    case 5:
                        {
                            groupIndex_1 = gameState.groups.findIndex(function (_a) {
                                var playerNum = _a.playerNum;
                                return playerNum < groupSize;
                            });
                            if (groupIndex_1 === -1) {
                                return [3 /*break*/, 9];
                            }
                            group_1 = gameState.groups[groupIndex_1];
                            this._joinPlayer(playerState, group_1, groupIndex_1);
                            if (group_1.playerNum === groupSize) {
                                groupPlayerStates = Object.values(playerStates).filter(function (s) {
                                    return group_1.isMulti
                                        ? s.multi && s.multi.groupIndex === groupIndex_1
                                        : s.single && s.single.groupIndex === groupIndex_1;
                                });
                                this._initState(group_1, groupPlayerStates);
                            }
                            return [3 /*break*/, 9];
                        }
                        _d.label = 6;
                    case 6:
                        {
                            playerStatus = playerState.playerStatus;
                            if (playerStatus !== config_1.PlayerStatus.prepared) {
                                return [2 /*return*/];
                            }
                            // 单人
                            if (playerState.single) {
                                playerRounds = playerState.single.rounds;
                                groupIndex_2 = playerState.single.groupIndex;
                                group_2 = gameState.groups[groupIndex_2];
                                roundIndex = group_2.roundIndex, gameRounds = group_2.rounds;
                                min = gameRounds[roundIndex].min;
                                _b = playerRounds[roundIndex], privateValue = _b.privateValue, startingPrice = _b.startingPrice;
                                if (this.invalidParams(params, privateValue, min, startingPrice)) {
                                    return [2 /*return*/, cb("\u4EF7\u683C\u5E94\u5728" + min + "\u4E0E" + privateValue + "\u4E4B\u95F4")];
                                }
                                playerState.playerStatus = config_1.PlayerStatus.shouted;
                                playerRounds[roundIndex].price = params.price;
                                playerRounds[roundIndex].bidNum = params.num;
                            }
                            else {
                                _c = playerState.multi, privateValue = _c.privateValue, startingPrice = _c.startingPrice;
                                groupIndex_2 = playerState.multi.groupIndex;
                                group_2 = gameState.groups[groupIndex_2];
                                roundIndex = group_2.roundIndex, gameRounds = group_2.rounds;
                                min = gameRounds[roundIndex].min;
                                errMsg = void 0;
                                if ((errMsg = this.invalidParams(params, privateValue, min, startingPrice))) {
                                    return [2 /*return*/, cb(errMsg)];
                                }
                                playerState.playerStatus = config_1.PlayerStatus.shouted;
                                playerState.multi.price = params.price;
                                playerState.multi.bidNum = params.num;
                            }
                            groupPlayerStates_1 = Object.values(playerStates).filter(function (s) {
                                return group_2.isMulti
                                    ? s.multi && s.multi.groupIndex === groupIndex_2
                                    : s.single && s.single.groupIndex === groupIndex_2;
                            });
                            if (!groupPlayerStates_1.every(function (s) { return s.playerStatus === config_1.PlayerStatus.shouted; })) {
                                return [2 /*return*/];
                            }
                            investorStates_1 = groupPlayerStates_1.map(function (s) {
                                return group_2.isMulti ? s.multi : s.single.rounds[group_2.roundIndex];
                            });
                            marketState_1 = group_2.rounds[group_2.roundIndex];
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            this.processProfits(investorStates_1, marketState_1);
                                            groupPlayerStates_1.forEach(function (s) { return (s.playerStatus = config_1.PlayerStatus.result); });
                                            return [4 /*yield*/, this.stateManager.syncState()];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 2000);
                            return [3 /*break*/, 9];
                        }
                        _d.label = 7;
                    case 7:
                        playerStatus = playerState.playerStatus;
                        if (playerStatus !== config_1.PlayerStatus.result) {
                            return [2 /*return*/];
                        }
                        onceMore = params.onceMore;
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.Trial.Done.name, {
                                userId: playerState.user.id,
                                onceMore: onceMore,
                                namespace: stock_trading_config_1.phaseToNamespace(this.game.params.type == config_1.IPOType.Median ? stock_trading_config_1.Phase.IPO_Median : stock_trading_config_1.Phase.IPO_TopK)
                            })];
                    case 8:
                        res = _d.sent();
                        res ? cb(res.lobbyUrl) : null;
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.createGroupAndInitRobots = function (gameState, playerState) {
        var groupSize = this.game.params.groupSize;
        var group = {
            playerNum: 0,
            roundIndex: 0,
            isMulti: false,
            rounds: [{}]
        };
        var groupIndex = gameState.groups.push(group) - 1;
        this._joinPlayer(playerState, group, groupIndex);
        this._initRobots(groupIndex, groupSize - 1);
    };
    Controller.prototype._joinPlayer = function (playerState, group, groupIndex) {
        var groupSize = this.game.params.groupSize;
        if (group.playerNum === groupSize) {
            return;
        }
        group.playerNum++;
        if (group.isMulti) {
            playerState.multi = {
                groupIndex: groupIndex
            };
        }
        else {
            playerState.single = {
                groupIndex: groupIndex,
                rounds: [{}]
            };
        }
        // playerState.playerStatus = PlayerStatus.matching;
    };
    // simulateNPCs(amount: number, min: number, max: number): Array<InvestorState> {
    //   return Array(amount)
    //     .fill("")
    //     .map(_ => {
    //       const price = formatDigits(genRandomInt(min * 100, max * 100) / 100);
    //       const num = genRandomInt(minNPCNum / 100, maxNPCNum / 100) * 100;
    //       return { price, bidNum: num };
    //     });
    // }
    Controller.prototype.invalidParams = function (params, privateValue, min, startingPrice) {
        if (params.num <= 0 || params.price * params.num > startingPrice) {
            return "您购买的股票数量超过您的可购买数量";
        }
        if (params.price < min || params.price > privateValue) {
            return "\u4EF7\u683C\u5E94\u5728" + min + "\u4E0E" + privateValue + "\u4E4B\u95F4";
        }
        return "";
    };
    Controller.prototype._initRobots = function (groupIndex, amount) {
        for (var i = 0; i < amount; i++) {
            this.startRobot("Robot_G" + groupIndex + "_" + i);
        }
    };
    Controller.prototype._initState = function (group, groupPlayerStates) {
        var _this = this;
        var max = this._genPrivateMax();
        var min = this._genPrivateMin(max);
        var stockIndex = genRandomInt(0, stock_trading_config_1.STOCKS.length - 1);
        var roundIndex = group.roundIndex, isMulti = group.isMulti, rounds = group.rounds;
        var gameRound = rounds[roundIndex];
        if (!gameRound) {
            gameRound = rounds[roundIndex] = {};
        }
        gameRound.min = min;
        gameRound.max = max;
        gameRound.stockIndex = stockIndex;
        if (isMulti) {
            this.startShoutTicking(group, groupPlayerStates[0].multi.groupIndex);
        }
        groupPlayerStates.forEach(function (s, i) {
            var privateValue = _this._genPrivateValue(min, max);
            var startingPrice = _this._genStartingPrice(min);
            if (isMulti) {
                s.multi.privateValue = privateValue;
                s.multi.startingPrice = startingPrice;
            }
            else {
                var playerRound = s.single.rounds[roundIndex];
                if (!playerRound) {
                    playerRound = s.single.rounds[roundIndex] = {};
                }
                playerRound.privateValue = privateValue;
                playerRound.startingPrice = startingPrice;
            }
            s.playerStatus = config_1.PlayerStatus.prepared;
            setTimeout(function () {
                _this.push(s.actor, config_1.PushType.robotShout, {
                    min: gameRound.min,
                    max: privateValue,
                    startingPrice: startingPrice
                });
            }, 600 * (i + 1));
        });
    };
    Controller.prototype._genPrivateValue = function (min, max) {
        return formatDigits(genRandomInt(min * 100, max * 100) / 100);
    };
    Controller.prototype._genPrivateMax = function () {
        return formatDigits(genRandomInt(config_1.minA * 100, config_1.maxA * 100) / 100);
    };
    Controller.prototype._genPrivateMin = function (max) {
        return formatDigits((max * genRandomInt(config_1.minB * 100, config_1.maxB * 100)) / 100);
    };
    Controller.prototype._genStartingPrice = function (min) {
        var original = min * config_1.startingMultiplier;
        var int = Math.floor(original / 10000);
        var remainder = original % 10000;
        if (remainder > 0) {
            return formatDigits((int + 1) * 10000);
        }
        return formatDigits(original);
    };
    Controller.prototype.startShoutTicking = function (group, groupIndex) {
        var _this = this;
        global.setTimeout(function () {
            var shoutIntervals = _this.shoutIntervals;
            var shoutTimer = 1;
            shoutIntervals[groupIndex] = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var playerStates, groupPlayerStates;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                        case 1:
                            playerStates = _a.sent();
                            groupPlayerStates = Object.values(playerStates).filter(function (s) { return s.multi && s.multi.groupIndex === groupIndex; });
                            groupPlayerStates.forEach(function (s) {
                                _this.push(s.actor, config_1.PushType.shoutTimer, {
                                    shoutTimer: shoutTimer
                                });
                            });
                            if (groupPlayerStates.every(function (s) { return s.playerStatus !== config_1.PlayerStatus.prepared; })) {
                                global.clearInterval(shoutIntervals[groupIndex]);
                                delete shoutIntervals[groupIndex];
                                return [2 /*return*/];
                            }
                            if (shoutTimer++ < config_1.SHOUT_TIMER) {
                                return [2 /*return*/];
                            }
                            global.clearInterval(shoutIntervals[groupIndex]);
                            delete shoutIntervals[groupIndex];
                            this._autoProcessProfits(group, groupPlayerStates);
                            return [4 /*yield*/, this.stateManager.syncState()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, 1000);
        }, 0);
    };
    Controller.prototype.startMatchTicking = function (group, groupIndex) {
        var _this = this;
        var groupSize = this.game.params.groupSize;
        global.setTimeout(function () {
            var matchIntervals = _this.matchIntervals;
            var matchTimer = 1;
            matchIntervals[groupIndex] = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var playerStates, groupPlayerStates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                        case 1:
                            playerStates = _a.sent();
                            groupPlayerStates = Object.values(playerStates).filter(function (s) { return s.multi && s.multi.groupIndex === groupIndex; });
                            if (!(group.playerNum === groupSize)) return [3 /*break*/, 3];
                            global.clearInterval(matchIntervals[groupIndex]);
                            delete matchIntervals[groupIndex];
                            this._initState(group, groupPlayerStates);
                            return [4 /*yield*/, this.stateManager.syncState()];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                        case 3:
                            if (matchTimer++ < config_1.MATCH_TIMER) {
                                return [2 /*return*/];
                            }
                            global.clearInterval(matchIntervals[groupIndex]);
                            delete matchIntervals[groupIndex];
                            this._initRobots(groupIndex, groupSize - group.playerNum);
                            return [4 /*yield*/, this.stateManager.syncState()];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); }, 1000);
        }, 0);
    };
    Controller.prototype._processMedianProfits = function (marketState, sortedPlayerStates) {
        var total = this.game.params.total;
        var numberOfShares = sortedPlayerStates.reduce(function (acc, item) { return acc + item.bidNum; }, 0);
        // 市场总数小于发行股数
        if (numberOfShares <= total) {
            marketState.strikePrice = marketState.min;
            sortedPlayerStates
                // .filter(s => s.privateValue !== undefined)
                .forEach(function (s) {
                s.actualNum = s.bidNum;
                s.profit = formatDigits((s.privateValue - marketState.strikePrice) * s.actualNum);
            });
            return;
        }
        var buyers = [];
        var buyerLimits = [];
        var median = Math.floor(numberOfShares / 2);
        var leftNum = median;
        var buyerTotal = 0;
        for (var i = 0; i < sortedPlayerStates.length; i++) {
            var curPlayer = sortedPlayerStates[i];
            buyerTotal += curPlayer.bidNum;
            buyers.push(curPlayer);
            buyerLimits.push(curPlayer.bidNum + median - leftNum);
            if (curPlayer.bidNum >= leftNum) {
                marketState.strikePrice = curPlayer.price;
                break;
            }
            leftNum -= curPlayer.bidNum;
        }
        // 买家总数小于发行股数
        if (buyerTotal <= total) {
            buyers
                // .filter(s => s.privateValue !== undefined)
                .forEach(function (s) {
                s.actualNum = s.bidNum;
                s.profit = formatDigits((s.privateValue - marketState.strikePrice) * s.actualNum);
            });
        }
        else {
            // 抽签分配
            buyers.forEach(function (s) { return (s.actualNum = 0); });
            var count = 0;
            while (count++ < total) {
                var random = genRandomInt(1, buyerTotal);
                var buyerIndex = this.findBuyerIndex(random, buyerLimits);
                buyers[buyerIndex].actualNum++;
            }
            buyers
                // .filter(s => s.privateValue !== undefined)
                .forEach(function (s) {
                s.profit = formatDigits((s.privateValue - marketState.strikePrice) * s.actualNum);
            });
        }
    };
    Controller.prototype._processTopKProfits = function (marketState, sortedPlayerStates) {
        var total = this.game.params.total;
        var buyers = [];
        var strikePrice;
        var leftNum = total;
        for (var i = 0; i < sortedPlayerStates.length; i++) {
            var curPlayer = sortedPlayerStates[i];
            curPlayer.actualNum =
                curPlayer.bidNum > leftNum ? leftNum : curPlayer.bidNum;
            buyers.push(curPlayer);
            if (curPlayer.bidNum >= leftNum) {
                strikePrice = curPlayer.price;
                break;
            }
            leftNum -= curPlayer.bidNum;
        }
        marketState.strikePrice =
            strikePrice === undefined ? marketState.min : strikePrice;
        buyers
            // .filter(s => s.privateValue !== undefined)
            .forEach(function (s) {
            s.profit = formatDigits((s.privateValue - marketState.strikePrice) * s.actualNum);
        });
    };
    Controller.prototype.processProfits = function (playerStates, marketState) {
        var type = this.game.params.type;
        var sortedPlayerStates = playerStates.sort(function (a, b) { return b.price - a.price; });
        // 中位数
        if (type === config_1.IPOType.Median) {
            this._processMedianProfits(marketState, sortedPlayerStates);
        }
        // 前K位
        if (type === config_1.IPOType.TopK) {
            this._processTopKProfits(marketState, sortedPlayerStates);
        }
    };
    Controller.prototype._autoProcessProfits = function (group, groupPlayerStates) {
        var investorStates = groupPlayerStates
            .filter(function (s) {
            if (s.playerStatus === config_1.PlayerStatus.prepared) {
                s.multi.price = 0;
                s.multi.bidNum = 0;
                s.multi.actualNum = 0;
                s.multi.profit = 0;
                return false;
            }
            return true;
        })
            .map(function (s) { return s.multi; });
        var marketState = group.rounds[group.roundIndex];
        this.processProfits(investorStates, marketState);
        groupPlayerStates.forEach(function (s) { return (s.playerStatus = config_1.PlayerStatus.result); });
    };
    Controller.prototype.findBuyerIndex = function (num, array) {
        var lo = 0;
        var hi = array.length - 1;
        while (lo < hi) {
            var mid = Math.floor((hi - lo) / 2 + lo);
            if (array[mid] === num) {
                return mid;
            }
            else if (num > array[mid]) {
                lo = mid + 1;
            }
            else {
                if (mid === 0 || num > array[mid - 1]) {
                    return mid;
                }
                hi = mid - 1;
            }
        }
        return lo;
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.genRandomInt = genRandomInt;
function formatDigits(num) {
    return +num.toFixed(2);
}
exports.formatDigits = formatDigits;
