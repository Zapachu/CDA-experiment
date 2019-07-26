"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var server_1 = require("@bespoke/server");
var robot_1 = require("@bespoke/robot");
var Controller_1 = require("./Controller");
var Robot_1 = require("./Robot");
var config_1 = require("./config");
var stock_trading_config_1 = require("@bespoke-game/stock-trading-config");
var protocol_1 = require("@elf/protocol");
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, '../static'));
robot_1.RobotServer.start(config_1.namespace, Robot_1.default);
server_1.RedisCall.handle(protocol_1.Trial.Create.name(stock_trading_config_1.phaseToNamespace(stock_trading_config_1.Phase.TBM)), function () { return __awaiter(_this, void 0, void 0, function () {
    var gameId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, server_1.Server.newGame({
                    title: stock_trading_config_1.Phase.TBM + ":" + new Date().toUTCString(),
                    params: {
                        groupSize: 12,
                        buyerCapitalMin: 50000,
                        buyerCapitalMax: 100000,
                        buyerPrivateMin: 65,
                        buyerPrivateMax: 80,
                        sellerQuotaMin: 1000,
                        sellerQuotaMax: 2000,
                        sellerPrivateMin: 30,
                        sellerPrivateMax: 45
                    }
                })];
            case 1:
                gameId = _a.sent();
                return [2 /*return*/, { playUrl: server_1.gameId2PlayUrl(gameId) }];
        }
    });
}); });
