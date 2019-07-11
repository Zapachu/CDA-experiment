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
var robot_1 = require("@bespoke/robot");
var dateFormat = require("dateformat");
var config_1 = require("./config");
var default_1 = /** @class */ (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        this.frameEmitter.on(config_1.PushType.assignedPosition, function () {
                            setTimeout(function () { return _this.frameEmitter.emit(config_1.MoveType.enterMarket, { seatNumber: ~~(Math.random() * 10000) }); }, Math.random() * 3000);
                        });
                        this.frameEmitter.on(config_1.PushType.periodOpen, function () {
                            _this.zipActive = false;
                            setTimeout(function () {
                                var u = (_this.position.role === config_1.ROLE.Seller ? 1 : -1) * (.05 + .3 * Math.random()), calcPrice = _this.formatPrice(_this.unitPrice * (1 + u));
                                _this.zipActive = true;
                                _this.zipFreeField = {
                                    beta: 0.1 + 0.4 * Math.random(),
                                    r: 0.1 * Math.random(),
                                    Gamma: 0,
                                    u: u,
                                    calcPrice: calcPrice
                                };
                                setTimeout(function () { return _this.wakeUp(); }, _this.sleepTime);
                            }, _this.game.params.phases[_this.gameState.gamePhaseIndex].params.startTime[_this.playerState.positionIndex]);
                        });
                        this.frameEmitter.on(config_1.PushType.newOrder, function (_a) {
                            var newOrderId = _a.newOrderId;
                            if (!_this.zipActive) {
                                return;
                            }
                            if (_this.position.reactionType === config_1.ReactionType.TradeAndOrder || _this.playerState.positionIndex === _this.orderDict[newOrderId].positionIndex) {
                                _this.respondNewOrder(newOrderId);
                            }
                        });
                        this.frameEmitter.on(config_1.PushType.newTrade, function (_a) {
                            var resOrderId = _a.resOrderId;
                            if (!_this.zipActive) {
                                return;
                            }
                            _this.respondNewTrade(resOrderId);
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Object.defineProperty(default_1.prototype, "position", {
        //region market
        //region getter
        get: function () {
            var positions = this.game.params.phases[0].params.positions, positionIndex = this.playerState.positionIndex, position = __assign({}, positions[positionIndex]);
            position.interval = 1000 * position.interval;
            return position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "sleepTime", {
        get: function () {
            return this.position.interval * (0.75 + 0.5 * Math.random());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "gamePhaseState", {
        get: function () {
            return this.gameState.phases[this.gameState.gamePhaseIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "orderDict", {
        get: function () {
            var orderDict = {};
            this.gameState.orders.forEach(function (order) {
                orderDict[order.id] = order;
            });
            return orderDict;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "unitIndex", {
        get: function () {
            return this.gamePhaseState.positionUnitIndex[this.playerState.positionIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(default_1.prototype, "unitPrice", {
        get: function () {
            try {
                var _a = this, gamePhaseIndex = _a.gameState.gamePhaseIndex, unitLists = _a.playerState.unitLists;
                return +(unitLists[gamePhaseIndex].split(' ')[this.unitIndex]);
            }
            catch (e) {
                return 0;
            }
        },
        enumerable: true,
        configurable: true
    });
    //endregion
    //region util
    default_1.prototype.formatPrice = function (price) {
        return Math.round(price);
    };
    //endregion
    default_1.prototype.wakeUp = function () {
        var _this = this;
        if (this.game.params.phases[this.gameState.gamePhaseIndex].templateName === config_1.phaseNames.mainGame &&
            this.gamePhaseState.marketStage === config_1.MarketStage.trading && this.unitPrice) {
            server_1.redisClient.incr(config_1.RedisKey.robotActionSeq(this.game.id)).then(function (seq) { return _this.submitOrder(seq); });
            setTimeout(function () { return _this.wakeUp(); }, this.sleepTime);
        }
    };
    default_1.prototype.respondNewOrder = function (newOrderId) {
        var _a = this, orderDict = _a.orderDict, game = _a.game, role = _a.position.role, calcPrice = _a.zipFreeField.calcPrice, newOrder = orderDict[newOrderId], positions = game.params.phases[0].params.positions;
        var newOrderRole = positions[newOrder.positionIndex].role;
        if (newOrderRole === role &&
            ((role === config_1.ROLE.Buyer && calcPrice <= newOrder.price) ||
                (role === config_1.ROLE.Seller && calcPrice >= newOrder.price))) {
            this.adjustProfitRate(config_1.AdjustDirection.lower, newOrder.price);
        }
    };
    default_1.prototype.respondNewTrade = function (resOrderId) {
        var _a = this, orderDict = _a.orderDict, game = _a.game, role = _a.position.role, resOrder = orderDict[resOrderId], positions = game.params.phases[0].params.positions;
        var reqId = this.gamePhaseState.trades.find(function (_a) {
            var resId = _a.resId;
            return resId === resOrderId;
        }).reqId, tradePrice = orderDict[reqId].price;
        var resRole = positions[resOrder.positionIndex].role;
        if ((role === config_1.ROLE.Buyer && this.zipFreeField.calcPrice >= tradePrice) ||
            (role === config_1.ROLE.Seller && this.zipFreeField.calcPrice <= tradePrice)) {
            this.adjustProfitRate(config_1.AdjustDirection.raise, tradePrice);
        }
        else if (resRole !== role) {
            this.adjustProfitRate(config_1.AdjustDirection.lower, tradePrice);
        }
    };
    default_1.prototype.adjustProfitRate = function (adjustDirection, q) {
        var _a;
        var _this = this;
        var _b = this, role = _b.position.role, unitPrice = _b.unitPrice, unitIndex = _b.unitIndex;
        var prePrice = this.zipFreeField.calcPrice || unitPrice * (1 + this.zipFreeField.u);
        var _c = this.zipFreeField, beta = _c.beta, r = _c.r, Gamma = _c.Gamma;
        var tmp = (adjustDirection === config_1.AdjustDirection.raise ? 0.05 : -0.05) * (role === config_1.ROLE.Seller ? 1 : -1), R = (1 + Math.random() * tmp), A = Math.random() * tmp;
        var tau = R * q + A, delta = beta * (tau - prePrice);
        this.zipFreeField.Gamma = Gamma * r + (1 - r) * delta;
        var newPrice = this.formatPrice(prePrice + this.zipFreeField.Gamma);
        var priceOverflow = (_a = {},
            _a[config_1.ROLE.Seller] = newPrice < unitPrice,
            _a[config_1.ROLE.Buyer] = newPrice > unitPrice,
            _a)[role];
        if (priceOverflow) {
            newPrice = unitPrice;
        }
        if (newPrice !== prePrice) {
            this.zipFreeField.calcPrice = newPrice;
            server_1.redisClient.incr(config_1.RedisKey.robotActionSeq(this.game.id)).then(function (seq) { return __awaiter(_this, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            data = {
                                seq: seq,
                                playerSeq: this.playerState.positionIndex + 1,
                                unitIndex: unitIndex,
                                role: config_1.ROLE[this.position.role],
                                R: R,
                                A: A,
                                q: q,
                                tau: tau,
                                beta: beta,
                                p: prePrice,
                                delta: delta,
                                r: r,
                                LagGamma: Gamma,
                                Gamma: this.zipFreeField.Gamma,
                                ValueCost: unitPrice,
                                u: newPrice / unitPrice - 1,
                                CalculatedPrice: newPrice,
                                timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
                            };
                            return [4 /*yield*/, new server_1.Model.FreeStyleModel({
                                    game: this.game.id,
                                    key: config_1.DBKey.robotCalcLog,
                                    data: data
                                }).save()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        }
    };
    default_1.prototype.submitOrder = function (seq) {
        var _a;
        var _this = this;
        var _b = this, calcPrice = _b.zipFreeField.calcPrice, gamePhaseIndex = _b.gameState.gamePhaseIndex, _c = _b.gamePhaseState, buyOrderIds = _c.buyOrderIds, sellOrderIds = _c.sellOrderIds, orderDict = _b.orderDict, unitIndex = _b.unitIndex, unitPrice = _b.unitPrice;
        var _d = __read((_a = {},
            _a[config_1.ROLE.Seller] = sellOrderIds[0] ? [calcPrice >= orderDict[sellOrderIds[0]].price, orderDict[sellOrderIds[0]].price] : [],
            _a[config_1.ROLE.Buyer] = buyOrderIds[0] ? [calcPrice <= orderDict[buyOrderIds[0]].price, orderDict[buyOrderIds[0]].price] : [],
            _a)[this.position.role], 2), _e = _d[0], wouldBeRejected = _e === void 0 ? false : _e, rejectPrice = _d[1];
        if (wouldBeRejected) {
            this.zipFreeField.calcPrice = calcPrice;
            this.adjustProfitRate(config_1.AdjustDirection.lower, rejectPrice);
            return;
        }
        this.zipFreeField.u = calcPrice / this.unitPrice - 1;
        var data = {
            seq: seq,
            playerSeq: this.playerState.positionIndex + 1,
            unitIndex: unitIndex,
            role: config_1.ROLE[this.position.role],
            ValueCost: unitPrice,
            price: calcPrice,
            buyOrders: buyOrderIds.map(function (id) { return orderDict[id].price; }).join(','),
            sellOrders: sellOrderIds.map(function (id) { return orderDict[id].price; }).join(','),
            timestamp: dateFormat(Date.now(), 'HH:MM:ss:l')
        };
        this.frameEmitter.emit(config_1.MoveType.submitOrder, {
            price: calcPrice,
            unitIndex: unitIndex,
            gamePhaseIndex: gamePhaseIndex
        }, function (shoutResult, marketBuyOrders, marketSellOrders) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new server_1.Model.FreeStyleModel({
                            game: this.game.id,
                            key: config_1.DBKey.robotSubmitLog,
                            data: __assign({}, data, { shoutResult: shoutResult, marketBuyOrders: marketBuyOrders, marketSellOrders: marketSellOrders })
                        }).save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return default_1;
}(robot_1.BaseRobot));
exports.default = default_1;
