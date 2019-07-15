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
var express_1 = require("express");
var node_xlsx_1 = require("node-xlsx");
var path_1 = require("path");
var server_1 = require("@bespoke/server");
var Controller_1 = require("./Controller");
var config_1 = require("./config");
var router = express_1.Router()
    .get(config_1.FetchRoute.exportXls, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var gameId, sheetType, _a, game, stateManager, gameState, name, data, option, sheet, buffer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                gameId = req.params.gameId, sheetType = req.query.sheetType;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                _a = _b.sent(), game = _a.game, stateManager = _a.stateManager;
                if (req.user.id !== game.owner) {
                    return [2 /*return*/, res.end("Invalid Request")];
                }
                return [4 /*yield*/, stateManager.getGameState()];
            case 2:
                gameState = _b.sent();
                name = config_1.SheetType[sheetType];
                data = [], option = {};
                switch (sheetType) {
                    case config_1.SheetType.result:
                    default: {
                        sheet = gameState["sheets"][sheetType];
                        data = sheet.data;
                        option = sheet.data;
                    }
                }
                buffer = node_xlsx_1.default.build([{ name: name, data: data }], option);
                res.setHeader("Content-Type", "application/vnd.openxmlformats");
                res.setHeader("Content-Disposition", "attachment; filename=" + (encodeURI(name) + ".xlsx"));
                return [2 /*return*/, res.end(buffer, "binary")];
        }
    });
}); })
    .get(config_1.FetchRoute.exportXlsPlaying, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var gameId, sheetType, controller, name, data, option, _a, buffer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                gameId = req.params.gameId, sheetType = req.query.sheetType;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                controller = (_b.sent());
                if (req.user.id !== controller.game.owner) {
                    return [2 /*return*/, res.end("Invalid Request")];
                }
                name = config_1.SheetType[sheetType];
                data = [], option = {};
                _a = sheetType;
                switch (_a) {
                    case config_1.SheetType.result: return [3 /*break*/, 2];
                }
                return [3 /*break*/, 2];
            case 2: return [4 /*yield*/, controller.genExportData()];
            case 3:
                data = _b.sent();
                _b.label = 4;
            case 4:
                buffer = node_xlsx_1.default.build([{ name: name, data: data }], option);
                res.setHeader("Content-Type", "application/vnd.openxmlformats");
                res.setHeader("Content-Disposition", "attachment; filename=" + (encodeURI(name) + ".xlsx"));
                return [2 /*return*/, res.end(buffer, "binary")];
        }
    });
}); });
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, "../static"), router);
