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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var server_1 = require("@bespoke/server");
var Controller_1 = require("./Controller");
var config_1 = require("./config");
var express_1 = require("express");
var node_xlsx_1 = require("node-xlsx");
var router = express_1.Router()
    .get(config_1.FetchRoute.exportXls, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var gameId, sheetType, game, name, data, option, _a, header, logs, buffer;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                gameId = req.params.gameId, sheetType = req.query.sheetType;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                game = (_b.sent()).game;
                if (req.user.id !== game.owner) {
                    return [2 /*return*/, res.end('Invalid Request')];
                }
                name = config_1.SheetType[sheetType];
                data = [], option = {};
                _a = sheetType;
                switch (_a) {
                    case config_1.SheetType.result: return [3 /*break*/, 2];
                }
                return [3 /*break*/, 4];
            case 2:
                header = ['被试编号'].concat(config_1.SURVEY_BASIC.map(function (a) { return a.title; }))
                    .concat(config_1.SURVEY_FEEDBACK.map(function (a) {
                    if (a.blanks) {
                        return __spread([a.title], a.blanks).toString();
                    }
                    return a.title;
                }))
                    .concat(config_1.SURVEY_TEST.map(function (a) { return a.title; }));
                data.push(header);
                return [4 /*yield*/, server_1.Model.FreeStyleModel.find({
                        game: game.id,
                        key: config_1.SheetType.result
                    })];
            case 3:
                logs = _b.sent();
                logs.forEach(function (_a) {
                    var _b = _a.data, seatNumber = _b.seatNumber, surveyBasic = _b.surveyBasic, surveyFeedback = _b.surveyFeedback, surveyTest = _b.surveyTest;
                    var row = [seatNumber.toString()];
                    row.push.apply(row, __spread(surveyBasic));
                    row.push.apply(row, __spread(surveyFeedback.length === 6
                        ? [surveyFeedback[0], surveyFeedback[1] + "," + surveyFeedback[2] + "," + surveyFeedback[3] + "," + surveyFeedback[4] + ",", '', surveyFeedback[5], '']
                        : [surveyFeedback[0], '', surveyFeedback[1] + "," + surveyFeedback[2], '', surveyFeedback[3]]));
                    row.push.apply(row, __spread(surveyTest));
                    data.push(row);
                });
                return [3 /*break*/, 4];
            case 4:
                buffer = node_xlsx_1.default.build([{ name: name, data: data }], option);
                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader('Content-Disposition', 'attachment; filename=' + (encodeURI(name) + ".xlsx"));
                return [2 /*return*/, res.end(buffer, 'binary')];
        }
    });
}); });
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, '../static'), router);
