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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@bespoke/server");
var config_1 = require("./config");
var stock_trading_config_1 = require("@bespoke-game/stock-trading-config");
var protocol_1 = require("@elf/protocol");
var util_1 = require("./util");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.type = ~~(Math.random() * util_1.getEnumKeys(config_1.GameType).length);
        gameState.playerIndex = 0;
        gameState.periods = (Array(config_1.PERIOD).fill(null).map(function () { return ({
            stage: config_1.PeriodStage.reading,
            orders: [],
            buyOrderIds: [],
            sellOrderIds: [],
            trades: [],
            closingPrice: 50
        }); }));
        gameState.periodIndex = 0;
        gameState.initialAsset = {
            count: 100 + ~~(Math.random() * 50),
            money: 3e4 + ~~(Math.random() * 1e4)
        };
        return gameState;
    };
    Controller.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState, type, _a, _b, min, max;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initPlayerState.call(this, actor)];
                    case 1:
                        playerState = _c.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        type = (_c.sent()).type;
                        _a = __read(config_1.PrivatePriceRegion[type], 1), _b = __read(_a[0], 2), min = _b[0], max = _b[1];
                        playerState.privatePrices = [util_1.random(min, max)];
                        playerState.guaranteeMoney = 0;
                        playerState.guaranteeCount = 0;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.guaranteeWithCountRobot = function (playerIndex, count) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, playerState, countRobot, _a, periodIndex, periods, balancePrice, money;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getActivePlayerStates()];
                    case 1:
                        playerStates = _b.sent(), playerState = playerStates.find(function (s) { return s.playerIndex === playerIndex; });
                        playerState.count += count;
                        playerState.guaranteeCount += count;
                        countRobot = playerStates.find(function (_a) {
                            var identity = _a.identity;
                            return identity === config_1.Identity.stockGuarantor;
                        });
                        countRobot.count -= count;
                        if (!(playerState.count < 0)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        _a = _b.sent(), periodIndex = _a.periodIndex, periods = _a.periods, balancePrice = periods[periodIndex].balancePrice;
                        money = -playerState.count * balancePrice;
                        playerState.money -= money;
                        playerState.count = 0;
                        countRobot.money += money;
                        _b.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.guaranteeWithMoneyRobot = function (playerIndex, money) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, playerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActivePlayerStates()];
                    case 1:
                        playerStates = _a.sent(), playerState = playerStates.find(function (s) { return s.playerIndex === playerIndex; });
                        playerState.money += money;
                        playerState.guaranteeMoney += money;
                        playerStates.find(function (_a) {
                            var identity = _a.identity;
                            return identity === config_1.Identity.moneyGuarantor;
                        }).money -= money;
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.shoutNewOrder = function (periodIndex, order) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, gamePeriodState, buyOrderIds, sellOrderIds, trades, orders, marketRejected, tradeSuccess, pairOrderId, pairOrder, trade, subOrder, subOrder;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getActivePlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gamePeriodState = (_a.sent()).periods[periodIndex], buyOrderIds = gamePeriodState.buyOrderIds, sellOrderIds = gamePeriodState.sellOrderIds, trades = gamePeriodState.trades, orders = gamePeriodState.orders;
                        marketRejected = order.role === config_1.ROLE.Seller ?
                            sellOrderIds.length && order.price > orders.find(function (_a) {
                                var id = _a.id;
                                return id === sellOrderIds[0];
                            }).price :
                            buyOrderIds.length && order.price < orders.find(function (_a) {
                                var id = _a.id;
                                return id === buyOrderIds[0];
                            }).price;
                        if (!marketRejected) return [3 /*break*/, 3];
                        server_1.Log.d('Market rejected : ', { price: order.price, count: order.count, role: order.role });
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, this.cancelOrder(periodIndex, order.playerIndex)];
                    case 4:
                        _a.sent();
                        orders.push(order);
                        _a.label = 5;
                    case 5:
                        tradeSuccess = order.role === config_1.ROLE.Seller ?
                            buyOrderIds.length && order.price <= orders.find(function (_a) {
                                var id = _a.id;
                                return id === buyOrderIds[0];
                            }).price :
                            sellOrderIds.length && order.price >= orders.find(function (_a) {
                                var id = _a.id;
                                return id === sellOrderIds[0];
                            }).price;
                        if (!tradeSuccess) {
                            (order.role === config_1.ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id);
                            return [2 /*return*/];
                        }
                        pairOrderId = order.role === config_1.ROLE.Seller ? buyOrderIds.shift() : sellOrderIds.shift(), pairOrder = orders.find(function (_a) {
                            var id = _a.id;
                            return id === pairOrderId;
                        }), trade = {
                            reqOrderId: pairOrderId,
                            resOrderId: order.id,
                            count: order.count
                        };
                        if (!(pairOrder.count > order.count)) return [3 /*break*/, 6];
                        subOrder = __assign({}, pairOrder, { id: orders.length, count: pairOrder.count - order.count });
                        orders.push(subOrder);
                        (order.role === config_1.ROLE.Buyer ? sellOrderIds : buyOrderIds).unshift(subOrder.id);
                        trade.subOrderId = subOrder.id;
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(pairOrder.count < order.count)) return [3 /*break*/, 8];
                        trade.count = pairOrder.count;
                        subOrder = __assign({}, order, { id: orders.length, count: order.count - pairOrder.count });
                        trade.subOrderId = subOrder.id;
                        return [4 /*yield*/, this.shoutNewOrder(periodIndex, subOrder)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        trades.push(trade);
                        gamePeriodState.closingPrice = pairOrder.price;
                        playerStates.forEach(function (playerState) {
                            var o = playerState.playerIndex === order.playerIndex ? order :
                                playerState.playerIndex === pairOrder.playerIndex ? pairOrder : null;
                            if (!o) {
                                return null;
                            }
                            _this.push(playerState.actor, config_1.PushType.tradeSuccess, { tradeCount: trade.count });
                            switch (o.role) {
                                case config_1.ROLE.Buyer:
                                    var money = trade.count * pairOrder.price;
                                    playerState.count += trade.count;
                                    o.guarantee ? playerState.guaranteeMoney += money : playerState.money -= money;
                                    break;
                                case config_1.ROLE.Seller:
                                    o.guarantee ? playerState.guaranteeCount += trade.count : playerState.count -= trade.count;
                                    playerState.money += trade.count * pairOrder.price;
                                    break;
                            }
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.cancelOrder = function (periodIndex, playerIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, buyOrderIds, sellOrderIds, orders, _loop_1, i, state_1, _loop_2, i, state_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        _a = (_b.sent()).periods[periodIndex], buyOrderIds = _a.buyOrderIds, sellOrderIds = _a.sellOrderIds, orders = _a.orders;
                        _loop_1 = function (i) {
                            var targetOrder = orders.find(function (_a) {
                                var id = _a.id;
                                return id === buyOrderIds[i];
                            });
                            if (targetOrder.playerIndex === playerIndex) {
                                buyOrderIds.splice(i, 1);
                                return { value: void 0 };
                            }
                        };
                        for (i = 0; i < buyOrderIds.length; i++) {
                            state_1 = _loop_1(i);
                            if (typeof state_1 === "object")
                                return [2 /*return*/, state_1.value];
                        }
                        _loop_2 = function (i) {
                            var targetOrder = orders.find(function (_a) {
                                var id = _a.id;
                                return id === sellOrderIds[i];
                            });
                            if (targetOrder.playerIndex === playerIndex) {
                                sellOrderIds.splice(i, 1);
                                return { value: void 0 };
                            }
                        };
                        for (i = 0; i < sellOrderIds.length; i++) {
                            state_2 = _loop_2(i);
                            if (typeof state_2 === "object")
                                return [2 /*return*/, state_2.value];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.getActivePlayerStates = function (playerIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        return [2 /*return*/, Object.values(playerStates).filter(function (s) { return playerIndex ? s.playerIndex === playerIndex : s.playerIndex !== undefined; })];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerState, playerStates, _a, countDown_1, timer_1, periodIndex, gamePeriodState, playerIndex, price, count, newOrder, periodIndex, onceMore, res;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _b.sent();
                        return [4 /*yield*/, this.getActivePlayerStates()];
                    case 3:
                        playerStates = _b.sent();
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.getIndex: return [3 /*break*/, 4];
                            case config_1.MoveType.submitOrder: return [3 /*break*/, 5];
                            case config_1.MoveType.cancelOrder: return [3 /*break*/, 9];
                            case config_1.MoveType.repayMoney: return [3 /*break*/, 11];
                            case config_1.MoveType.repayCount: return [3 /*break*/, 12];
                            case config_1.MoveType.exitGame: return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 15];
                    case 4:
                        {
                            if (playerState.playerIndex !== undefined) {
                                return [3 /*break*/, 15];
                            }
                            playerState.playerIndex = gameState.playerIndex++;
                            switch (true) {
                                case actor.type === server_1.Actor.serverRobot && playerStates.every(function (_a) {
                                    var identity = _a.identity;
                                    return identity != config_1.Identity.moneyGuarantor;
                                }):
                                    playerState.identity = config_1.Identity.moneyGuarantor;
                                    playerState.count = 0;
                                    playerState.money = gameState.initialAsset.money * config_1.playerLimit;
                                    break;
                                case actor.type === server_1.Actor.serverRobot && playerStates.every(function (_a) {
                                    var identity = _a.identity;
                                    return identity != config_1.Identity.stockGuarantor;
                                }):
                                    playerState.identity = config_1.Identity.stockGuarantor;
                                    playerState.count = gameState.initialAsset.count * config_1.playerLimit;
                                    playerState.money = 0;
                                    break;
                                default:
                                    playerState.identity = config_1.Identity.retailPlayer;
                                    playerState.count = gameState.initialAsset.count;
                                    playerState.money = gameState.initialAsset.money;
                            }
                            if (playerState.playerIndex > 0) {
                                return [3 /*break*/, 15];
                            }
                            countDown_1 = 1;
                            timer_1 = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var periodIndex, gamePeriodState, prepareTime, tradeTime, resultTime, periodCountDown, playerStates, periodIndex_1, countArr_1, priceArr_1, periodIndex_2, _a, min_1, max_1, periodTrend_1, privatePrices_1;
                                var _this = this;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (gameState.status !== server_1.GameStatus.started) {
                                                return [2 /*return*/];
                                            }
                                            periodIndex = gameState.periodIndex;
                                            gamePeriodState = gameState.periods[periodIndex];
                                            prepareTime = config_1.CONFIG.prepareTime, tradeTime = config_1.CONFIG.tradeTime, resultTime = config_1.CONFIG.resultTime, periodCountDown = countDown_1 % (prepareTime + tradeTime + resultTime);
                                            return [4 /*yield*/, this.getActivePlayerStates()];
                                        case 1:
                                            playerStates = _b.sent();
                                            switch (periodCountDown) {
                                                case ~~(prepareTime / 2): {
                                                    if (periodIndex === 0) {
                                                        Array(2 + config_1.playerLimit - gameState.playerIndex).fill(null).forEach(function (_, i) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0: return [4 /*yield*/, this.startRobot("$Robot_" + i)];
                                                                case 1: return [2 /*return*/, _a.sent()];
                                                            }
                                                        }); }); });
                                                    }
                                                    break;
                                                }
                                                case prepareTime: {
                                                    gamePeriodState.stage = config_1.PeriodStage.trading;
                                                    this.broadcast(config_1.PushType.beginTrading);
                                                    break;
                                                }
                                                case prepareTime + tradeTime: {
                                                    gamePeriodState.stage = config_1.PeriodStage.result;
                                                    periodIndex_1 = gameState.periodIndex;
                                                    if (periodIndex_1 % 2 === 0) {
                                                        break;
                                                    }
                                                    countArr_1 = [], priceArr_1 = [];
                                                    playerStates.sort(function (p1, p2) { return p1.count - p2.count; })
                                                        .forEach(function (_a) {
                                                        var count = _a.count, privatePrices = _a.privatePrices;
                                                        countArr_1.push(count);
                                                        priceArr_1.push(privatePrices[periodIndex_1]);
                                                    });
                                                    gamePeriodState.balancePrice = priceArr_1[util_1.getBalanceIndex(countArr_1)];
                                                    playerStates.forEach(function (playerState) { return __awaiter(_this, void 0, void 0, function () {
                                                        var asset, guaranteeAsset;
                                                        return __generator(this, function (_a) {
                                                            switch (_a.label) {
                                                                case 0:
                                                                    asset = gamePeriodState.balancePrice * playerState.count + playerState.money, guaranteeAsset = gamePeriodState.balancePrice * playerState.guaranteeCount + playerState.guaranteeMoney;
                                                                    if (!(asset < guaranteeAsset * 1.3)) return [3 /*break*/, 3];
                                                                    return [4 /*yield*/, this.guaranteeWithMoneyRobot(playerState.playerIndex, -playerState.guaranteeMoney)];
                                                                case 1:
                                                                    _a.sent();
                                                                    return [4 /*yield*/, this.guaranteeWithCountRobot(playerState.playerIndex, -playerState.guaranteeCount)];
                                                                case 2:
                                                                    _a.sent();
                                                                    this.push(playerState.actor, config_1.PushType.closeOut);
                                                                    return [2 /*return*/];
                                                                case 3:
                                                                    if (asset < guaranteeAsset * 1.5) {
                                                                        this.push(playerState.actor, config_1.PushType.closeOutWarning);
                                                                    }
                                                                    return [2 /*return*/];
                                                            }
                                                        });
                                                    }); });
                                                    break;
                                                }
                                                case 0: {
                                                    if (gameState.periodIndex === config_1.PERIOD - 1) {
                                                        global.clearInterval(timer_1);
                                                        break;
                                                    }
                                                    periodIndex_2 = ++gameState.periodIndex;
                                                    _a = __read(config_1.PrivatePriceRegion[gameState.type][periodIndex_2], 2), min_1 = _a[0], max_1 = _a[1], periodTrend_1 = min_1 - config_1.PrivatePriceRegion[gameState.type][periodIndex_2 - 1][0], privatePrices_1 = playerStates.map(function () { return util_1.random(min_1, max_1); })
                                                        .sort(function (m, n) { return (m - n) * periodTrend_1; });
                                                    playerStates.sort(function (p1, p2) { return p1.count - p2.count; })
                                                        .forEach(function (playerState, i) {
                                                        playerState.privatePrices[gameState.periodIndex] = privatePrices_1[i];
                                                    });
                                                }
                                            }
                                            return [4 /*yield*/, this.stateManager.syncState()];
                                        case 2:
                                            _b.sent();
                                            this.broadcast(config_1.PushType.countDown, { countDown: periodCountDown });
                                            countDown_1++;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 1000);
                            return [3 /*break*/, 15];
                        }
                        _b.label = 5;
                    case 5:
                        periodIndex = gameState.periodIndex, gamePeriodState = gameState.periods[periodIndex];
                        playerIndex = playerState.playerIndex;
                        price = params.price, count = params.count;
                        if (!(count <= 0)) return [3 /*break*/, 6];
                        server_1.Log.d('ShoutFailed : ', {
                            role: config_1.ROLE[params.role],
                            count: playerState.count,
                            money: playerState.money
                        });
                        return [3 /*break*/, 8];
                    case 6:
                        newOrder = {
                            id: gamePeriodState.orders.length,
                            playerIndex: playerIndex,
                            role: params.role,
                            price: price,
                            count: count,
                            guarantee: params.guarantee
                        };
                        return [4 /*yield*/, this.shoutNewOrder(periodIndex, newOrder)];
                    case 7:
                        _b.sent();
                        _b.label = 8;
                    case 8: return [3 /*break*/, 15];
                    case 9:
                        periodIndex = gameState.periodIndex;
                        return [4 /*yield*/, this.cancelOrder(periodIndex, playerState.playerIndex)];
                    case 10:
                        _b.sent();
                        return [3 /*break*/, 15];
                    case 11:
                        {
                            playerState.money -= params.moneyRepay;
                            playerState.guaranteeMoney -= params.moneyRepay;
                            playerStates.find(function (_a) {
                                var identity = _a.identity;
                                return identity === config_1.Identity.moneyGuarantor;
                            }).money += params.moneyRepay;
                            return [3 /*break*/, 15];
                        }
                        _b.label = 12;
                    case 12:
                        {
                            playerState.count -= params.countRepay;
                            playerState.guaranteeCount -= params.countRepay;
                            playerStates.find(function (_a) {
                                var identity = _a.identity;
                                return identity === config_1.Identity.stockGuarantor;
                            }).count += params.countRepay;
                            return [3 /*break*/, 15];
                        }
                        _b.label = 13;
                    case 13:
                        onceMore = params.onceMore;
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.Trial.Done.name, {
                                userId: playerState.user.id,
                                onceMore: onceMore,
                                namespace: stock_trading_config_1.phaseToNamespace(this.game.params.allowLeverage ? stock_trading_config_1.Phase.CBM_Leverage : stock_trading_config_1.Phase.CBM)
                            })];
                    case 14:
                        res = _b.sent();
                        res ? cb(res.lobbyUrl) : null;
                        return [3 /*break*/, 15];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
