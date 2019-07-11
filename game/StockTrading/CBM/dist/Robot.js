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
var robot_1 = require("@bespoke/robot");
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
                        setTimeout(function () { return _this.frameEmitter.emit(config_1.MoveType.getIndex); }, 1000);
                        this.frameEmitter.on(config_1.PushType.beginTrading, function () {
                            global.setInterval(function () {
                                if (_this.gameState.periodIndex === config_1.PERIOD - 1 && _this.gameState.periods[_this.gameState.periodIndex].stage === config_1.PeriodStage.result) {
                                    global.clearInterval(_this.sleepLoop);
                                }
                                if (_this.gameState.status !== server_1.GameStatus.started) {
                                    return;
                                }
                                _this.wakeUp();
                            }, 5e3 * Math.random() + 10e3);
                        });
                        return [2 /*return*/, this];
                }
            });
        });
    };
    default_1.prototype.wakeUp = function () {
        var _a;
        if (!this.playerState || !this.gameState) {
            return;
        }
        var _b = this.gameState.periods[this.gameState.periodIndex], stage = _b.stage, orders = _b.orders, sellOrderIds = _b.sellOrderIds, buyOrderIds = _b.buyOrderIds;
        if (stage !== config_1.PeriodStage.trading) {
            return;
        }
        var privatePrice = this.playerState.privatePrices[this.gameState.periodIndex];
        var role = (_a = {},
            _a[config_1.Identity.stockGuarantor] = config_1.ROLE.Buyer,
            _a[config_1.Identity.moneyGuarantor] = config_1.ROLE.Seller,
            _a[config_1.Identity.retailPlayer] = Math.random() > .5 ? config_1.ROLE.Seller : config_1.ROLE.Buyer,
            _a)[this.playerState.identity];
        var price = privatePrice + ~~(Math.random() * 10 * (role === config_1.ROLE.Seller ? 1 : -1));
        var maxCount = role === config_1.ROLE.Seller ? this.playerState.count : this.playerState.money / privatePrice;
        if (maxCount < 1) {
            return;
        }
        var marketRejected = role === config_1.ROLE.Seller ?
            sellOrderIds[0] && price > orders.find(function (_a) {
                var id = _a.id;
                return id === sellOrderIds[0];
            }).price :
            buyOrderIds[0] && price < orders.find(function (_a) {
                var id = _a.id;
                return id === buyOrderIds[0];
            }).price;
        if (marketRejected) {
            return;
        }
        this.frameEmitter.emit(config_1.MoveType.submitOrder, { price: price, count: ~~(maxCount * (.3 * Math.random() + .2)) + 1, role: role });
    };
    return default_1;
}(robot_1.BaseRobot));
exports.default = default_1;
