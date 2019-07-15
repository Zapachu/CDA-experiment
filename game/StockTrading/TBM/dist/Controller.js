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
        _this.role = config_1.Role.Buyer;
        _this.robotJoined = false;
        return _this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.status = server_1.GameStatus.started;
        gameState.stockIndex = genRandomInt(0, stock_trading_config_1.STOCKS.length - 1);
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
                        playerState.actualNum = 0;
                        playerState.profit = 0;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerState, gameState, playerStates, _a, playerStateArray, onceMore, res;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        groupSize = this.game.params.groupSize;
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _b.sent();
                        _a = type;
                        switch (_a) {
                            case config_1.MoveType.join: return [3 /*break*/, 4];
                            case config_1.MoveType.shout: return [3 /*break*/, 5];
                            case config_1.MoveType.nextStage: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 4:
                        {
                            if (playerState.role !== undefined) {
                                return [2 /*return*/];
                            }
                            this.initPlayer(playerState);
                            if ((playerState.actor.type = server_1.Actor.serverRobot)) {
                                this.push(playerState.actor, config_1.PushType.robotShout);
                            }
                            return [3 /*break*/, 8];
                        }
                        _b.label = 5;
                    case 5:
                        {
                            if (playerState.price !== undefined) {
                                return [2 /*return*/];
                            }
                            if (this.invalidParams(playerState, params)) {
                                return [2 /*return*/, cb(playerState.role === config_1.Role.Buyer
                                        ? '价格应不大于估值'
                                        : '价格应不小于估值')];
                            }
                            playerState.price = params.price;
                            playerState.bidNum = params.num;
                            playerStateArray = Object.values(playerStates);
                            if (!this.robotJoined && playerStateArray.length < groupSize) {
                                // 第一次有人报价时补满机器人
                                this.initRobots(groupSize - playerStateArray.length);
                                this.robotJoined = true;
                            }
                            if (playerStateArray.length === groupSize &&
                                playerStateArray.every(function (ps) { return ps.price !== undefined; })) {
                                this.processProfits(gameState, playerStateArray);
                            }
                            return [3 /*break*/, 8];
                        }
                        _b.label = 6;
                    case 6:
                        onceMore = params.onceMore;
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.GameOver.name, {
                                playUrl: server_1.gameId2PlayUrl(this.game.id, actor.token),
                                onceMore: onceMore,
                                namespace: stock_trading_config_1.phaseToNamespace(stock_trading_config_1.Phase.TBM)
                            })];
                    case 7:
                        res = _b.sent();
                        res ? cb(res.lobbyUrl) : null;
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.invalidParams = function (playerState, params) {
        var price = params.price, num = params.num;
        var role = playerState.role, startingPrice = playerState.startingPrice, startingQuota = playerState.startingQuota, privateValue = playerState.privateValue;
        return (!price ||
            !num ||
            (role === config_1.Role.Buyer &&
                (price * num > startingPrice || price > privateValue)) ||
            (role == config_1.Role.Seller && (num > startingQuota || price < privateValue)));
    };
    Controller.prototype.processProfits = function (gameState, playerStates) {
        var buyerList = playerStates
            .filter(function (ps) { return ps.role === config_1.Role.Buyer; })
            .sort(function (a, b) { return b.price - a.price; });
        var sellerList = playerStates
            .filter(function (ps) { return ps.role === config_1.Role.Seller; })
            .sort(function (a, b) { return a.price - b.price; });
        var _a = this._strikeDeal(buyerList, sellerList), strikePrice = _a.strikePrice, strikeNum = _a.strikeNum;
        this._updateGameState(gameState, strikePrice, strikeNum);
        this._updatePlayerStates(playerStates, strikePrice);
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
    Controller.prototype._updatePlayerStates = function (playerStates, strikePrice) {
        playerStates.forEach(function (ps) {
            if (!ps.actualNum) {
                return;
            }
            if (ps.role === config_1.Role.Buyer) {
                ps.profit = (ps.privateValue - strikePrice) * ps.actualNum;
            }
            else {
                ps.profit = (strikePrice - ps.privateValue) * ps.actualNum;
            }
        });
    };
    Controller.prototype._updateGameState = function (gameState, strikePrice, strikeNum) {
        gameState.strikePrice = strikePrice;
        gameState.strikeNum = strikeNum;
    };
    Controller.prototype.initRobots = function (amount) {
        for (var i = 0; i < amount; i++) {
            this.startRobot("Robot_" + i);
        }
    };
    Controller.prototype.initPlayer = function (playerState) {
        var role = this._getRole();
        playerState.role = role;
        playerState.privateValue = this._getPrivatePrice(role);
        if (role === config_1.Role.Buyer) {
            playerState.startingPrice = this._getStartingPrice();
        }
        else {
            playerState.startingQuota = this._getStartingQuota();
        }
        this._shoutTicking();
    };
    Controller.prototype._shoutTicking = function () {
        var _this = this;
        if (this.shoutTimer) {
            return;
        }
        var groupSize = this.game.params.groupSize;
        var shoutTime = 1;
        this.shoutTimer = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            var playerStates, playerStateArray;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        playerStateArray = Object.values(playerStates);
                        playerStateArray.forEach(function (s) {
                            _this.push(s.actor, config_1.PushType.shoutTimer, { shoutTime: shoutTime });
                        });
                        if (playerStateArray.length === groupSize &&
                            playerStateArray.every(function (ps) { return ps.price !== undefined; })) {
                            clearInterval(this.shoutTimer);
                            return [2 /*return*/];
                        }
                        if (!this.robotJoined &&
                            playerStateArray.length < groupSize &&
                            config_1.SHOUT_TIMER - shoutTime < 30) {
                            // 倒计时30秒时补满机器人
                            this.initRobots(groupSize - playerStateArray.length);
                            this.robotJoined = true;
                        }
                        if (shoutTime++ < config_1.SHOUT_TIMER) {
                            return [2 /*return*/];
                        }
                        clearInterval(this.shoutTimer);
                        return [4 /*yield*/, this._shoutTickEnds(playerStateArray)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
    };
    Controller.prototype._shoutTickEnds = function (playerStates) {
        return __awaiter(this, void 0, void 0, function () {
            var shoutedPlayerStates, gameState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shoutedPlayerStates = playerStates.filter(function (ps) {
                            if (ps.price === undefined) {
                                ps.price = 0;
                                ps.bidNum = 0;
                                return false;
                            }
                            return true;
                        });
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        this.processProfits(gameState, shoutedPlayerStates);
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype._getRole = function () {
        var curRole = this.role;
        this.role = curRole === config_1.Role.Buyer ? config_1.Role.Seller : config_1.Role.Buyer;
        return curRole;
    };
    Controller.prototype._getPrivatePrice = function (role) {
        var _a = this.game.params, buyerPrivateMin = _a.buyerPrivateMin, buyerPrivateMax = _a.buyerPrivateMax, sellerPrivateMin = _a.sellerPrivateMin, sellerPrivateMax = _a.sellerPrivateMax;
        var min, max;
        if (role === config_1.Role.Buyer) {
            min = buyerPrivateMin;
            max = buyerPrivateMax;
        }
        else {
            min = sellerPrivateMin;
            max = sellerPrivateMax;
        }
        return genRandomInt(min * 100, max * 100) / 100;
    };
    Controller.prototype._getStartingPrice = function () {
        var _a = this.game.params, buyerCapitalMin = _a.buyerCapitalMin, buyerCapitalMax = _a.buyerCapitalMax;
        return genRandomInt(buyerCapitalMin / 100, buyerCapitalMax / 100) * 100;
    };
    Controller.prototype._getStartingQuota = function () {
        var _a = this.game.params, sellerQuotaMin = _a.sellerQuotaMin, sellerQuotaMax = _a.sellerQuotaMax;
        return genRandomInt(sellerQuotaMin / 100, sellerQuotaMax / 100) * 100;
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.genRandomInt = genRandomInt;
