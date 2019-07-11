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
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@bespoke/server");
var config_1 = require("./config");
var dateFormat = require("dateformat");
var cloneDeep = require("lodash/cloneDeep");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //region meta
    Controller.prototype.getGame4Player = function () {
        var game = cloneDeep(this.game);
        game.params.phases.forEach(function (_a) {
            var templateName = _a.templateName, params = _a.params;
            return templateName === config_1.phaseNames.mainGame ? params.unitLists = [] : null;
        });
        return game;
    };
    //endregion
    //region init
    Controller.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var positions, player, robot;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        positions = this.game.params.phases[0].params.positions;
                        player = [], robot = [];
                        positions.forEach(function (_a, i) {
                            var identity = _a.identity;
                            return (identity === config_1.IDENTITY.Player ? player : robot).push(i);
                        });
                        this.positionStack = { player: player, robot: robot };
                        robot.forEach(function (_, i) { return setTimeout(function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.startRobot("Robot_" + i)];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); }, Math.random() * 3000); });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Controller.prototype.initGameState = function () {
        var _this = this;
        var gameState = _super.prototype.initGameState.call(this);
        gameState.gamePhaseIndex = 0;
        gameState.orders = [];
        gameState.phases = this.game.params.phases.map(function (phase, i) { return ({
            marketStage: config_1.MarketStage.notOpen,
            orderId: i * config_1.orderNumberLimit,
            buyOrderIds: [],
            sellOrderIds: [],
            trades: [],
            positionUnitIndex: _this.game.params.phases[0].params.positions.map(function () { return 0; })
        }); });
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
                        playerState.point = 0;
                        playerState.phases = this.game.params.phases.map(function (_a) {
                            var templateName = _a.templateName;
                            return templateName === config_1.phaseNames.mainGame ?
                                { periodProfit: 0 } : {};
                        });
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    //endregion
    //region play
    Controller.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerStates, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _b.sent();
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.assignPosition: return [3 /*break*/, 3];
                            case config_1.MoveType.openMarket: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        {
                            Object.values(playerStates).forEach(function (playerState) { return __awaiter(_this, void 0, void 0, function () {
                                var positionIndex;
                                return __generator(this, function (_a) {
                                    positionIndex = (playerState.actor.type === server_1.Actor.serverRobot ?
                                        this.positionStack.robot : this.positionStack.player).pop();
                                    if (positionIndex === undefined) {
                                        return [2 /*return*/, server_1.Log.d('角色已分配完')];
                                    }
                                    playerState.positionIndex = positionIndex;
                                    playerState.unitLists = this.game.params.phases.map(function (_a) {
                                        var templateName = _a.templateName, params = _a.params;
                                        return templateName === config_1.phaseNames.mainGame ? params.unitLists[positionIndex] : '';
                                    });
                                    this.push(playerState.actor, config_1.PushType.assignedPosition);
                                    return [2 /*return*/];
                                });
                            }); });
                            gameState.positionAssigned = true;
                            return [3 /*break*/, 6];
                        }
                        _b.label = 4;
                    case 4:
                        gameState.gamePhaseIndex = 1;
                        return [4 /*yield*/, this.startPeriod()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.startPeriod = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, periodCountDown, timer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        gameState.phases[gameState.gamePhaseIndex].marketStage = config_1.MarketStage.readDescription;
                        periodCountDown = 0;
                        this.broadcast(config_1.PushType.periodCountDown, { periodCountDown: periodCountDown });
                        timer = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a, durationOfEachPeriod, time2ReadInfo;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (gameState.status !== server_1.GameStatus.started) {
                                            return [2 /*return*/];
                                        }
                                        _a = this.game.params.phases[gameState.gamePhaseIndex].params, durationOfEachPeriod = _a.durationOfEachPeriod, time2ReadInfo = _a.time2ReadInfo;
                                        if (periodCountDown === Number(time2ReadInfo)) {
                                            gameState.phases[gameState.gamePhaseIndex].marketStage = config_1.MarketStage.trading;
                                            this.broadcast(config_1.PushType.periodOpen);
                                        }
                                        if (!(periodCountDown === Number(durationOfEachPeriod) + Number(time2ReadInfo))) return [3 /*break*/, 2];
                                        gameState.phases[gameState.gamePhaseIndex].marketStage = config_1.MarketStage.result;
                                        return [4 /*yield*/, this.calcPeriodProfit()];
                                    case 1:
                                        _b.sent();
                                        _b.label = 2;
                                    case 2:
                                        if (!(periodCountDown === Number(durationOfEachPeriod) + 2 * Number(time2ReadInfo))) return [3 /*break*/, 4];
                                        global.clearInterval(timer);
                                        if (!(++gameState.gamePhaseIndex < this.game.params.phases.length - 1)) return [3 /*break*/, 4];
                                        return [4 /*yield*/, this.startPeriod()];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4: return [4 /*yield*/, this.stateManager.syncState()];
                                    case 5:
                                        _b.sent();
                                        this.broadcast(config_1.PushType.periodCountDown, {
                                            periodCountDown: periodCountDown++
                                        });
                                        return [2 /*return*/];
                                }
                            });
                        }); }, 1000);
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerState, playerStates, gamePhaseIndex, positionIndex, _a, hasBeenOccupied, data, price, unitIndex, orderDict_1, _b, buyOrderIds, sellOrderIds, buyOrders, sellOrders, shoutResult, newOrder, price, positions, _c, role, identity, unitIndex, units, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _f.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _f.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _f.sent(), gamePhaseIndex = gameState.gamePhaseIndex, positionIndex = playerState.positionIndex;
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.enterMarket: return [3 /*break*/, 4];
                            case config_1.MoveType.submitOrder: return [3 /*break*/, 6];
                            case config_1.MoveType.rejectOrder: return [3 /*break*/, 10];
                            case config_1.MoveType.cancelOrder: return [3 /*break*/, 13];
                            case config_1.MoveType.sendBackPlayer: return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 16];
                    case 4:
                        hasBeenOccupied = Object.values(playerStates).some(function (_a) {
                            var seatNumber = _a.seatNumber;
                            return seatNumber === params.seatNumber;
                        });
                        if (hasBeenOccupied) {
                            cb(false);
                            return [3 /*break*/, 16];
                        }
                        playerState.seatNumber = params.seatNumber;
                        playerState.status = config_1.PlayerStatus.wait4MarketOpen;
                        data = {
                            playerSeq: positionIndex + 1,
                            seatNumber: params.seatNumber
                        };
                        return [4 /*yield*/, new server_1.Model.FreeStyleModel({
                                game: this.game.id,
                                key: config_1.DBKey.seatNumber,
                                data: data
                            }).save()];
                    case 5:
                        _f.sent();
                        return [3 /*break*/, 16];
                    case 6:
                        price = params.price, unitIndex = params.unitIndex;
                        orderDict_1 = this.getOrderDict(gameState), _b = gameState.phases[gamePhaseIndex], buyOrderIds = _b.buyOrderIds, sellOrderIds = _b.sellOrderIds, buyOrders = buyOrderIds.map(function (id) { return orderDict_1[id].price; }).join(','), sellOrders = sellOrderIds.map(function (id) { return orderDict_1[id].price; }).join(',');
                        shoutResult = void 0;
                        if (this.game.params.phases[gamePhaseIndex].templateName !== config_1.phaseNames.mainGame) {
                            server_1.Log.w('玩家已进入下一环节');
                            return [3 /*break*/, 16];
                        }
                        if (!(unitIndex !== gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex])) return [3 /*break*/, 7];
                        server_1.Log.d('物品已成交，无法继续报价');
                        shoutResult = config_1.ShoutResult.shoutOnTradedUnit;
                        return [3 /*break*/, 9];
                    case 7:
                        newOrder = {
                            id: ++gameState.phases[gamePhaseIndex].orderId,
                            positionIndex: positionIndex,
                            unitIndex: gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex],
                            price: price
                        };
                        return [4 /*yield*/, this.shoutNewOrder(gamePhaseIndex, newOrder)];
                    case 8:
                        shoutResult = _f.sent();
                        _f.label = 9;
                    case 9:
                        cb(shoutResult, buyOrders, sellOrders);
                        return [3 /*break*/, 16];
                    case 10:
                        price = params.price;
                        positions = this.game.params.phases.filter(function (ph) { return ph.templateName === config_1.phaseNames.assignPosition; })[0].params.positions, _c = positions[positionIndex], role = _c.role, identity = _c.identity;
                        unitIndex = gameState.phases[gamePhaseIndex].positionUnitIndex[positionIndex];
                        units = this.game.params.phases[gamePhaseIndex].params.unitLists[positionIndex].split(' ');
                        _d = this.insertMoveEvent;
                        _e = {
                            period: gamePhaseIndex,
                            subject: positionIndex,
                            box: unitIndex,
                            role: role,
                            traderType: identity,
                            valueCost: units[unitIndex],
                            eventType: config_1.EVENT_TYPE.rejected,
                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                        };
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, true)];
                    case 11:
                        _e.maxBid = _f.sent();
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, false)];
                    case 12:
                        _d.apply(this, [(_e.minAsk = _f.sent(),
                                _e.bidAsk = price,
                                _e)]);
                        return [3 /*break*/, 16];
                    case 13: return [4 /*yield*/, this.cancelOrder(gamePhaseIndex, positionIndex, true)];
                    case 14:
                        _f.sent();
                        return [3 /*break*/, 16];
                    case 15:
                        {
                            this.setPhaseResult(actor.token, {
                                point: playerState.point
                            });
                            return [3 /*break*/, 16];
                        }
                        _f.label = 16;
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    //region market
    Controller.prototype.getOrderDict = function (gameState) {
        var orderDict = {};
        gameState.orders.forEach(function (order) {
            orderDict[order.id] = order;
        });
        return orderDict;
    };
    Controller.prototype.calcPeriodProfit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var game, gameState, playerStates, orders, gamePhaseIndex, trades, practicePhase, _loop_1, userId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = this.game;
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _a.sent(), orders = gameState.orders, gamePhaseIndex = gameState.gamePhaseIndex, trades = gameState.phases[gamePhaseIndex].trades, practicePhase = game.params.phases[gamePhaseIndex].params.practicePhase;
                        _loop_1 = function (userId) {
                            var _a = playerStates[userId], phases = _a.phases, unitLists = _a.unitLists, positionIndex = _a.positionIndex, playerPhaseState = phases[gamePhaseIndex], positions = game.params.phases[0].params.positions;
                            if (!unitLists) {
                                return "continue";
                            }
                            var periodProfit = 0, tradedCount = 0;
                            var orderDict = {};
                            orders.forEach(function (order) {
                                orderDict[order.id] = order;
                            });
                            trades.forEach(function (_a) {
                                var reqId = _a.reqId, resId = _a.resId;
                                var reqOrder = orderDict[reqId], resOrder = orderDict[resId];
                                var myOrder;
                                switch (positionIndex) {
                                    case reqOrder.positionIndex:
                                        myOrder = reqOrder;
                                        break;
                                    case resOrder.positionIndex:
                                        myOrder = resOrder;
                                        break;
                                    default:
                                        return;
                                }
                                var privateCost = +unitLists[gamePhaseIndex].split(' ')[myOrder.unitIndex];
                                var unitProfit = positions[positionIndex].role === config_1.ROLE.Buyer ?
                                    privateCost - reqOrder.price : reqOrder.price - privateCost;
                                periodProfit += unitProfit;
                                tradedCount++;
                            });
                            if (practicePhase) {
                                periodProfit = 0;
                            }
                            playerPhaseState.tradedCount = tradedCount;
                            playerPhaseState.periodProfit = Number(periodProfit.toFixed(2));
                            playerStates[userId].point = Number((playerStates[userId].point + periodProfit / Number(positions[positionIndex].exchangeRate || 1)).toFixed(2));
                        };
                        for (userId in playerStates) {
                            _loop_1(userId);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.shoutNewOrder = function (gamePhaseIndex, order) {
        return __awaiter(this, void 0, void 0, function () {
            var positions, _a, role, identity, units, _b, phases, orders, _c, buyOrderIds, sellOrderIds, trades, positionUnitIndex, marketRejected, _d, _e, tradeSuccess, pairOrderId_1, pairOrder, pairUnits, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0:
                        positions = this.game.params.phases.filter(function (ph) { return ph.templateName === config_1.phaseNames.assignPosition; })[0].params.positions, _a = positions[order.positionIndex], role = _a.role, identity = _a.identity;
                        units = this.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ');
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        _b = _k.sent(), phases = _b.phases, orders = _b.orders, _c = phases[gamePhaseIndex], buyOrderIds = _c.buyOrderIds, sellOrderIds = _c.sellOrderIds, trades = _c.trades, positionUnitIndex = _c.positionUnitIndex;
                        marketRejected = role === config_1.ROLE.Seller ?
                            sellOrderIds[0] && order.price >= orders.find(function (_a) {
                                var id = _a.id;
                                return id === sellOrderIds[0];
                            }).price :
                            buyOrderIds[0] && order.price <= orders.find(function (_a) {
                                var id = _a.id;
                                return id === buyOrderIds[0];
                            }).price;
                        if (!marketRejected) return [3 /*break*/, 4];
                        _d = this.insertMoveEvent;
                        _e = {
                            orderId: order.id,
                            period: gamePhaseIndex,
                            subject: order.positionIndex,
                            box: order.unitIndex,
                            role: role,
                            traderType: identity,
                            valueCost: units[order.unitIndex],
                            eventType: config_1.EVENT_TYPE.rejected,
                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                        };
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, true)];
                    case 2:
                        _e.maxBid = _k.sent();
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, false)];
                    case 3:
                        _d.apply(this, [(_e.minAsk = _k.sent(),
                                _e.bidAsk = order.price,
                                _e)]);
                        return [2 /*return*/, config_1.ShoutResult.marketReject];
                    case 4: return [4 /*yield*/, this.cancelOrder(gamePhaseIndex, order.positionIndex)];
                    case 5:
                        _k.sent();
                        orders.push(order);
                        _k.label = 6;
                    case 6:
                        tradeSuccess = role === config_1.ROLE.Seller ?
                            buyOrderIds[0] && order.price <= orders.find(function (_a) {
                                var id = _a.id;
                                return id === buyOrderIds[0];
                            }).price :
                            sellOrderIds[0] && order.price >= orders.find(function (_a) {
                                var id = _a.id;
                                return id === sellOrderIds[0];
                            }).price;
                        if (!tradeSuccess) return [3 /*break*/, 9];
                        pairOrderId_1 = role === config_1.ROLE.Seller ? buyOrderIds.shift() : sellOrderIds.shift();
                        trades.push({
                            reqId: pairOrderId_1,
                            resId: order.id
                        });
                        positionUnitIndex[orders.find(function (_a) {
                            var id = _a.id;
                            return id === pairOrderId_1;
                        }).positionIndex] += 1;
                        positionUnitIndex[order.positionIndex] += 1;
                        pairOrder = orders.find(function (o) { return o.id === pairOrderId_1; });
                        pairUnits = this.game.params.phases[gamePhaseIndex].params.unitLists[pairOrder.positionIndex].split(' ');
                        _f = this.insertMoveEvent;
                        _g = {
                            orderId: order.id,
                            period: gamePhaseIndex,
                            subject: order.positionIndex,
                            box: order.unitIndex,
                            role: role,
                            traderType: identity,
                            valueCost: units[order.unitIndex],
                            eventType: config_1.EVENT_TYPE.traded,
                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                        };
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, true)];
                    case 7:
                        _g.maxBid = _k.sent();
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, false)];
                    case 8:
                        _f.apply(this, [(_g.minAsk = _k.sent(),
                                _g.bidAsk = order.price,
                                _g.trade = config_1.TRADE.success,
                                _g.tradeOrder = trades.length,
                                _g.tradeTime = dateFormat(Date.now(), 'HH:MM:ss:l'),
                                _g.tradeType = role === config_1.ROLE.Seller ? config_1.TRADE_TYPE.buyerFirst : config_1.TRADE_TYPE.sellerFirst,
                                _g.price = pairOrder.price,
                                _g.profit = Math.abs(pairOrder.price - Number(units[order.unitIndex])),
                                _g.partnerSubject = pairOrder.positionIndex,
                                _g.partnerBox = pairOrder.unitIndex,
                                _g.partnerShout = pairOrder.price,
                                _g.partnerProfit = Math.abs(pairOrder.price - Number(pairUnits[pairOrder.unitIndex])),
                                _g.partnerId = pairOrderId_1,
                                _g)]);
                        this.broadcast(config_1.PushType.newTrade, { resOrderId: order.id });
                        return [2 /*return*/, config_1.ShoutResult.tradeSuccess];
                    case 9:
                        (role === config_1.ROLE.Seller ? sellOrderIds : buyOrderIds).unshift(order.id);
                        _h = this.insertMoveEvent;
                        _j = {
                            orderId: order.id,
                            period: gamePhaseIndex,
                            subject: order.positionIndex,
                            box: order.unitIndex,
                            role: role,
                            traderType: identity,
                            valueCost: units[order.unitIndex],
                            eventType: config_1.EVENT_TYPE.entered,
                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                        };
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, true)];
                    case 10:
                        _j.maxBid = _k.sent();
                        return [4 /*yield*/, this.getMaxOrMinShout(gamePhaseIndex, false)];
                    case 11:
                        _h.apply(this, [(_j.minAsk = _k.sent(),
                                _j.bidAsk = order.price,
                                _j)]);
                        this.broadcast(config_1.PushType.newOrder, { newOrderId: order.id });
                        return [2 /*return*/, config_1.ShoutResult.shoutSuccess];
                }
            });
        });
    };
    Controller.prototype.cancelOrder = function (gamePhaseIndex, positionIndex, active) {
        if (active === void 0) { active = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, phases, orders, _b, buyOrderIds, sellOrderIds, positions, _loop_2, this_1, i, state_1, _loop_3, this_2, i, state_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        _a = _c.sent(), phases = _a.phases, orders = _a.orders, _b = phases[gamePhaseIndex], buyOrderIds = _b.buyOrderIds, sellOrderIds = _b.sellOrderIds;
                        positions = this.game.params.phases.filter(function (ph) { return ph.templateName === config_1.phaseNames.assignPosition; })[0].params.positions;
                        _loop_2 = function (i) {
                            var order, units, _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(orders.find(function (_a) {
                                            var id = _a.id;
                                            return id === buyOrderIds[i];
                                        }).positionIndex === positionIndex)) return [3 /*break*/, 4];
                                        if (!active) return [3 /*break*/, 3];
                                        order = orders.find(function (_a) {
                                            var id = _a.id;
                                            return id === buyOrderIds[i];
                                        });
                                        units = this_1.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ');
                                        _b = (_a = this_1).insertMoveEvent;
                                        _c = {
                                            orderId: order.id,
                                            period: gamePhaseIndex,
                                            subject: order.positionIndex,
                                            box: order.unitIndex,
                                            role: positions[order.positionIndex].role,
                                            traderType: positions[order.positionIndex].identity,
                                            valueCost: units[order.unitIndex],
                                            eventType: config_1.EVENT_TYPE.cancelled,
                                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                                        };
                                        return [4 /*yield*/, this_1.getMaxOrMinShout(gamePhaseIndex, true)];
                                    case 1:
                                        _c.maxBid = _d.sent();
                                        return [4 /*yield*/, this_1.getMaxOrMinShout(gamePhaseIndex, false)];
                                    case 2:
                                        _b.apply(_a, [(_c.minAsk = _d.sent(),
                                                _c.bidAsk = order.price,
                                                _c)]);
                                        _d.label = 3;
                                    case 3: return [2 /*return*/, { value: buyOrderIds.splice(i, 1) }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < buyOrderIds.length)) return [3 /*break*/, 5];
                        return [5 /*yield**/, _loop_2(i)];
                    case 3:
                        state_1 = _c.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        _loop_3 = function (i) {
                            var order, units, _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!(orders.find(function (_a) {
                                            var id = _a.id;
                                            return id === sellOrderIds[i];
                                        }).positionIndex === positionIndex)) return [3 /*break*/, 4];
                                        if (!active) return [3 /*break*/, 3];
                                        order = orders.find(function (_a) {
                                            var id = _a.id;
                                            return id === sellOrderIds[i];
                                        });
                                        units = this_2.game.params.phases[gamePhaseIndex].params.unitLists[order.positionIndex].split(' ');
                                        _b = (_a = this_2).insertMoveEvent;
                                        _c = {
                                            orderId: order.id,
                                            period: gamePhaseIndex,
                                            subject: order.positionIndex,
                                            box: order.unitIndex,
                                            role: positions[order.positionIndex].role,
                                            traderType: positions[order.positionIndex].identity,
                                            valueCost: units[order.unitIndex],
                                            eventType: config_1.EVENT_TYPE.cancelled,
                                            eventTime: dateFormat(Date.now(), 'HH:MM:ss:l')
                                        };
                                        return [4 /*yield*/, this_2.getMaxOrMinShout(gamePhaseIndex, true)];
                                    case 1:
                                        _c.maxBid = _d.sent();
                                        return [4 /*yield*/, this_2.getMaxOrMinShout(gamePhaseIndex, false)];
                                    case 2:
                                        _b.apply(_a, [(_c.minAsk = _d.sent(),
                                                _c.bidAsk = order.price,
                                                _c)]);
                                        _d.label = 3;
                                    case 3: return [2 /*return*/, { value: sellOrderIds.splice(i, 1) }];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        i = 0;
                        _c.label = 6;
                    case 6:
                        if (!(i < sellOrderIds.length)) return [3 /*break*/, 9];
                        return [5 /*yield**/, _loop_3(i)];
                    case 7:
                        state_2 = _c.sent();
                        if (typeof state_2 === "object")
                            return [2 /*return*/, state_2.value];
                        _c.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.getMaxOrMinShout = function (gamePhaseIndex, max) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, phases, orders, _b, buyOrderIds, sellOrderIds, buyOrderShouts, sellOrderShouts;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        _a = _c.sent(), phases = _a.phases, orders = _a.orders;
                        _b = phases[gamePhaseIndex], buyOrderIds = _b.buyOrderIds, sellOrderIds = _b.sellOrderIds;
                        if (max) {
                            buyOrderShouts = buyOrderIds.map(function (id) { return orders.find(function (order) { return order.id === id; }).price; });
                            buyOrderShouts.sort(function (a, b) { return b - a; });
                            return [2 /*return*/, buyOrderShouts[0] || ''];
                        }
                        else {
                            sellOrderShouts = sellOrderIds.map(function (id) { return orders.find(function (order) { return order.id === id; }).price; });
                            sellOrderShouts.sort(function (a, b) { return a - b; });
                            return [2 /*return*/, sellOrderShouts[0] || ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    //endregion
    //endregion
    //region result
    Controller.prototype.onGameOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerStates, playerStatesArray, positions, players, logs, playerProfits, events, resultData, logData, profitData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _b.sent(), playerStatesArray = Object.values(playerStates);
                        positions = this.game.params.phases.filter(function (ph) { return ph.templateName === config_1.phaseNames.assignPosition; })[0].params.positions;
                        players = {};
                        playerStatesArray.forEach(function (state) {
                            var positionIndex = state.positionIndex;
                            if (positionIndex === undefined) {
                                return;
                            }
                            var periods = {};
                            state.unitLists.forEach(function (unitStr, p) {
                                if (p === 0)
                                    return;
                                var units = {};
                                unitStr.split(' ').forEach(function (unit, u) {
                                    units[u] = {
                                        period: p,
                                        subject: positionIndex,
                                        box: u,
                                        role: positions[positionIndex].role,
                                        traderType: positions[positionIndex].identity,
                                        valueCost: unit
                                    };
                                });
                                periods[p] = units;
                            });
                            players[positionIndex] = periods;
                        });
                        logs = [];
                        playerProfits = new Array(playerStatesArray.length).fill(0);
                        return [4 /*yield*/, this.getMoveEvent({}, { sort: { createAt: 1 } })];
                    case 3:
                        events = _b.sent();
                        events.map(function (e) { return e.data; }).forEach(function (data, i) {
                            var period = data.period, subject = data.subject, box = data.box, role = data.role, valueCost = data.valueCost, traderType = data.traderType, trade = data.trade, partnerSubject = data.partnerSubject, partnerBox = data.partnerBox, partnerShout = data.partnerShout, partnerProfit = data.partnerProfit, tradeOrder = data.tradeOrder, tradeTime = data.tradeTime, tradeType = data.tradeType, price = data.price, bidAsk = data.bidAsk, profit = data.profit, eventType = data.eventType, orderId = data.orderId, eventTime = data.eventTime, maxBid = data.maxBid, minAsk = data.minAsk, partnerId = data.partnerId;
                            //result
                            if (trade) {
                                players[subject][period][box] = __assign({}, data);
                                var pair = players[partnerSubject][period][partnerBox];
                                pair = Object.assign(pair, {
                                    trade: config_1.TRADE.success,
                                    tradeOrder: tradeOrder,
                                    tradeTime: tradeTime,
                                    tradeType: tradeType,
                                    price: price,
                                    profit: Math.abs(price - pair.valueCost),
                                    partnerSubject: subject,
                                    partnerBox: box,
                                    partnerShout: bidAsk,
                                    partnerProfit: profit
                                });
                            }
                            else {
                                players[subject][period][box] = __assign({}, data);
                            }
                            //log
                            switch (eventType) {
                                case config_1.EVENT_TYPE.rejected:
                                case config_1.EVENT_TYPE.entered:
                                    logs.push({
                                        orderId: orderId,
                                        period: period,
                                        subject: subject,
                                        box: box,
                                        role: role,
                                        traderType: traderType,
                                        valueCost: valueCost,
                                        eventType: eventType,
                                        eventNum: i,
                                        eventTime: eventTime,
                                        maxBid: maxBid,
                                        minAsk: minAsk,
                                        bidAsk: bidAsk
                                    });
                                    break;
                                case config_1.EVENT_TYPE.traded:
                                    logs.push({
                                        orderId: orderId,
                                        period: period,
                                        subject: subject,
                                        box: box,
                                        role: role,
                                        traderType: traderType,
                                        valueCost: valueCost,
                                        eventType: eventType,
                                        eventNum: i,
                                        eventTime: eventTime,
                                        maxBid: maxBid,
                                        minAsk: minAsk,
                                        bidAsk: bidAsk,
                                        trade: trade,
                                        tradeOrder: tradeOrder,
                                        tradeTime: tradeTime,
                                        tradeType: tradeType,
                                        price: price,
                                        profit: profit,
                                        partnerSubject: partnerSubject,
                                        partnerBox: partnerBox,
                                        partnerShout: partnerShout,
                                        partnerProfit: partnerProfit
                                    });
                                    var pair = logs.find(function (l) { return l.orderId === partnerId; });
                                    Object.assign(pair, __assign({}, pair, { eventEndTime: eventTime, matchEventNum: i, trade: config_1.TRADE.success, tradeOrder: tradeOrder,
                                        tradeTime: tradeTime,
                                        tradeType: tradeType,
                                        price: price, profit: Math.abs(price - pair.valueCost), partnerSubject: subject, partnerBox: box, partnerShout: bidAsk, partnerProfit: profit }));
                                    break;
                                case config_1.EVENT_TYPE.cancelled:
                                    logs.push({
                                        orderId: orderId,
                                        period: period,
                                        subject: subject,
                                        box: box,
                                        role: role,
                                        traderType: traderType,
                                        valueCost: valueCost,
                                        eventType: eventType,
                                        eventNum: i,
                                        eventTime: eventTime,
                                        maxBid: maxBid,
                                        minAsk: minAsk,
                                        bidAsk: bidAsk
                                    });
                                    var origin_1 = logs.find(function (l) { return l.orderId === orderId; });
                                    Object.assign(origin_1, __assign({}, origin_1, { eventEndTime: eventTime, matchEventNum: i }));
                                    break;
                            }
                            //profit
                            if (profit) {
                                playerProfits[subject] = playerProfits[subject] + profit;
                            }
                            if (partnerProfit) {
                                playerProfits[partnerSubject] = playerProfits[partnerSubject] + partnerProfit;
                            }
                        });
                        resultData = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']];
                        Object.values(players).forEach(function (period) {
                            Object.values(period).forEach(function (box) {
                                Object.values(box).forEach(function (params) {
                                    var _a = params, period = _a.period, subject = _a.subject, box = _a.box, role = _a.role, traderType = _a.traderType, valueCost = _a.valueCost, trade = _a.trade, partnerSubject = _a.partnerSubject, partnerBox = _a.partnerBox, partnerShout = _a.partnerShout, partnerProfit = _a.partnerProfit, tradeOrder = _a.tradeOrder, tradeTime = _a.tradeTime, tradeType = _a.tradeType, price = _a.price, bidAsk = _a.bidAsk, profit = _a.profit;
                                    resultData.push([
                                        period,
                                        Number(subject) + 1,
                                        Number(box) + 1,
                                        role,
                                        traderType,
                                        valueCost,
                                        bidAsk || '',
                                        trade || '',
                                        tradeOrder || '',
                                        tradeTime || '',
                                        tradeType || '',
                                        price || '',
                                        profit || 0,
                                        partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
                                        partnerBox === undefined ? '' : Number(partnerBox) + 1,
                                        partnerShout === undefined ? '' : partnerShout,
                                        partnerProfit === undefined ? '' : partnerProfit
                                    ]);
                                });
                            });
                        });
                        logData = [['Period', 'Subject', 'Box', 'Role: 0-seller,1-buyer', 'TraderType: 0-human,1-zip,2-gd', 'ValueCost', 'EventType: 1-rejected,2-entered,3-traded,4-cancelled', 'EventNum', 'EventTime', 'EventEndTime', 'MaxBid', 'MinAsk', 'MatchEventNum', 'BidAsk', 'Trade', 'TradeOrder', 'TradeTime', 'TradeType: 1-buyer_first,2-seller_first', 'Price', 'Profit', 'PartnerSubject', 'PartnerBox', 'PartnerShout', 'PartnerProfit']];
                        logs.forEach(function (log) {
                            var period = log.period, subject = log.subject, box = log.box, role = log.role, traderType = log.traderType, valueCost = log.valueCost, eventType = log.eventType, eventNum = log.eventNum, eventTime = log.eventTime, eventEndTime = log.eventEndTime, maxBid = log.maxBid, minAsk = log.minAsk, matchEventNum = log.matchEventNum, trade = log.trade, partnerSubject = log.partnerSubject, partnerBox = log.partnerBox, partnerShout = log.partnerShout, partnerProfit = log.partnerProfit, tradeOrder = log.tradeOrder, tradeTime = log.tradeTime, tradeType = log.tradeType, price = log.price, bidAsk = log.bidAsk, profit = log.profit;
                            logData.push([
                                period,
                                Number(subject) + 1,
                                Number(box) + 1,
                                role,
                                traderType,
                                valueCost,
                                eventType,
                                Number(eventNum) + 1,
                                eventTime,
                                eventEndTime || '',
                                maxBid,
                                minAsk,
                                matchEventNum === undefined ? '' : Number(matchEventNum) + 1,
                                bidAsk || '',
                                trade || '',
                                tradeOrder || '',
                                tradeTime || '',
                                tradeType || '',
                                price || '',
                                profit || 0,
                                partnerSubject === undefined ? '' : Number(partnerSubject) + 1,
                                partnerBox === undefined ? '' : Number(partnerBox) + 1,
                                partnerShout === undefined ? '' : partnerShout,
                                partnerProfit === undefined ? '' : partnerProfit
                            ]);
                        });
                        profitData = [['Period', 'Subject', 'PeriodProfit', 'MarketProfit', 'ShowUpFee', 'ExchangeRate', 'Money']];
                        Object.values(players).forEach(function (period) {
                            Object.values(period).forEach(function (box) {
                                Object.values(box).forEach(function (params) {
                                    var _a = params, period = _a.period, subject = _a.subject, profit = _a.profit;
                                    profitData.push([
                                        period,
                                        Number(subject) + 1,
                                        profit || 0,
                                        playerProfits[subject],
                                        '',
                                        positions[subject].exchangeRate,
                                        (playerProfits[subject] / Number(positions[subject].exchangeRate)).toFixed(2)
                                    ]);
                                });
                            });
                        });
                        Object.assign(gameState, {
                            sheets: (_a = {},
                                _a[config_1.SheetType.result] = {
                                    data: resultData
                                },
                                _a[config_1.SheetType.log] = {
                                    data: logData
                                },
                                _a[config_1.SheetType.profit] = {
                                    data: profitData
                                },
                                _a)
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    //endregion
    //region util
    Controller.prototype.insertMoveEvent = function (data) {
        new server_1.Model.FreeStyleModel({ data: data, game: this.game.id, key: config_1.DBKey.moveEvent }).save(function (err) {
            if (err)
                console.log(err);
        });
    };
    Controller.prototype.getMoveEvent = function (query, options) {
        if (query === void 0) { query = {}; }
        if (options === void 0) { options = { sort: null }; }
        return __awaiter(this, void 0, void 0, function () {
            var queryObj;
            return __generator(this, function (_a) {
                queryObj = __assign({}, query, { game: this.game.id, key: config_1.DBKey.moveEvent });
                if (options.sort) {
                    return [2 /*return*/, server_1.Model.FreeStyleModel.find(queryObj).lean().sort(options.sort).exec()];
                }
                return [2 /*return*/, server_1.Model.FreeStyleModel.find(queryObj).lean().exec()];
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
