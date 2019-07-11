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
var Controller_1 = require("./Controller");
var Robot_1 = require("./Robot");
var config_1 = require("./config");
var express_1 = require("express");
var util_1 = require("./util");
var node_xlsx_1 = require("node-xlsx");
var robot_1 = require("@bespoke/robot");
var router = express_1.Router()
    .get(config_1.FetchRoute.exportXls, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var gameId, sheetType, _a, game, stateManager, name, data, option, _b, robotCalcLogs, robotSubmitLogs, seatNumberRows, gameState, sheet, buffer;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                gameId = req.params.gameId, sheetType = req.query.sheetType;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                _a = _c.sent(), game = _a.game, stateManager = _a.stateManager;
                if (req.user.id !== game.owner) {
                    return [2 /*return*/, res.end('Invalid Request')];
                }
                name = config_1.SheetType[sheetType];
                data = [], option = {};
                _b = sheetType;
                switch (_b) {
                    case config_1.SheetType.robotCalcLog: return [3 /*break*/, 2];
                    case config_1.SheetType.robotSubmitLog: return [3 /*break*/, 4];
                    case config_1.SheetType.seatNumber: return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 2:
                data.push(['seq', 'Subject', 'role', 'box', 'R', 'A', 'q', 'tau', 'beta', 'p', 'delta', 'r', 'LagGamma', 'Gamma', 'ValueCost', 'u', 'CalculatedPrice', 'Timestamp']);
                return [4 /*yield*/, server_1.Model.FreeStyleModel.find({
                        game: game.id,
                        key: config_1.DBKey.robotCalcLog
                    })];
            case 3:
                robotCalcLogs = _c.sent();
                robotCalcLogs.sort(function (_a, _b) {
                    var m = _a.data.seq;
                    var n = _b.data.seq;
                    return m - n;
                })
                    .forEach(function (_a) {
                    var _b = _a.data, seq = _b.seq, playerSeq = _b.playerSeq, role = _b.role, unitIndex = _b.unitIndex, R = _b.R, A = _b.A, q = _b.q, tau = _b.tau, beta = _b.beta, p = _b.p, delta = _b.delta, r = _b.r, LagGamma = _b.LagGamma, Gamma = _b.Gamma, ValueCost = _b.ValueCost, u = _b.u, CalculatedPrice = _b.CalculatedPrice, timestamp = _b.timestamp;
                    return data.push([seq, playerSeq, role, unitIndex + 1, R, A, q, tau, beta, p, delta, r, LagGamma, Gamma, ValueCost, u, CalculatedPrice, timestamp]
                        .map(function (v) { return typeof v === 'number' && v % 1 ? v.toFixed(2) : v; }));
                });
                return [3 /*break*/, 10];
            case 4:
                data.push(['seq', 'Subject', 'role', 'box', 'ValueCost', 'Price', 'BuyOrders', 'SellOrders', "ShoutResult:" + util_1.getEnumKeys(config_1.ShoutResult).join('/'), 'MarketBuyOrders', 'MarketSellOrders', 'Timestamp']);
                return [4 /*yield*/, server_1.Model.FreeStyleModel.find({
                        game: game.id,
                        key: config_1.DBKey.robotSubmitLog
                    })];
            case 5:
                robotSubmitLogs = _c.sent();
                robotSubmitLogs.sort(function (_a, _b) {
                    var m = _a.data.seq;
                    var n = _b.data.seq;
                    return m - n;
                })
                    .forEach(function (_a) {
                    var _b = _a.data, seq = _b.seq, playerSeq = _b.playerSeq, role = _b.role, unitIndex = _b.unitIndex, ValueCost = _b.ValueCost, price = _b.price, buyOrders = _b.buyOrders, sellOrders = _b.sellOrders, shoutResult = _b.shoutResult, marketBuyOrders = _b.marketBuyOrders, marketSellOrders = _b.marketSellOrders, timestamp = _b.timestamp;
                    return data.push([seq, playerSeq, role, unitIndex + 1, ValueCost, price, buyOrders, sellOrders, shoutResult + 1 + ":" + config_1.ShoutResult[shoutResult], marketBuyOrders, marketSellOrders, timestamp]
                        .map(function (v) { return typeof v === 'number' && v % 1 ? v.toFixed(2) : v; }));
                });
                return [3 /*break*/, 10];
            case 6:
                data.push(['Subject', 'seatNumber']);
                return [4 /*yield*/, server_1.Model.FreeStyleModel.find({
                        game: game.id,
                        key: config_1.DBKey.seatNumber
                    })];
            case 7:
                seatNumberRows = _c.sent();
                seatNumberRows.forEach(function (_a) {
                    var _b = _a.data, seatNumber = _b.seatNumber, playerSeq = _b.playerSeq;
                    return data.push([playerSeq, seatNumber]);
                });
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, stateManager.getGameState()];
            case 9:
                gameState = _c.sent();
                sheet = gameState['sheets'][sheetType];
                data = sheet.data;
                option = sheet.data;
                _c.label = 10;
            case 10:
                buffer = node_xlsx_1.default.build([{ name: name, data: data }], option);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader('Content-Disposition', 'attachment; filename=' + (encodeURI(name) + ".xlsx"));
                return [2 /*return*/, res.end(buffer, 'binary')];
        }
    });
}); });
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, '../static'), router);
robot_1.RobotServer.start(config_1.namespace, Robot_1.default);
