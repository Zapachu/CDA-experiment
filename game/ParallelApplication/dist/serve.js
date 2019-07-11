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
var Express = require("express");
var express_1 = require("express");
var path_1 = require("path");
var fs = require("fs");
var server_1 = require("@bespoke/server");
var Controller_1 = require("./Controller");
var Robot_1 = require("./Robot");
var config_1 = require("./config");
var settings_1 = require("./settings");
var protocol_1 = require("@elf/protocol");
var robot_1 = require("@bespoke/robot");
var protocol_2 = require("@elf/protocol");
var FreeStyleModel = server_1.Model.FreeStyleModel;
var resultHtmlStr = fs
    .readFileSync(path_1.resolve(__dirname, "../asset/result.html"))
    .toString();
var router = express_1.Router()
    .use("/result/static", Express.static(path_1.resolve(__dirname, "../asset"), { maxAge: "10d" }))
    .get("/result/:gameId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var user, gameId, userId, key, result, admission, scriptStr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user, gameId = req.params.gameId, userId = req.query.userId;
                if (!(userId || user)) return [3 /*break*/, 2];
                key = userId ? userId : user._id.toString();
                return [4 /*yield*/, FreeStyleModel.findOne({
                        game: gameId,
                        key: key
                    })
                        .lean()
                        .exec()];
            case 1:
                result = _a.sent();
                if (result) {
                    admission = result.data.admission;
                    scriptStr = "<script type=\"text/javascript\">window._admission=" + admission + ";window._userId=\"" + key + "\"</script>";
                    res.set("content-type", "text/html");
                    return [2 /*return*/, res.end(scriptStr + resultHtmlStr)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.redirect(settings_1.default.entryUrl)];
        }
    });
}); })
    .get("/getUserId/:gameId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var userId, gameId, _a, token, actorType, _b, game, stateManager, playerState;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                userId = req.user._id, gameId = req.params.gameId, _a = req.query, token = _a.token, actorType = _a.actorType;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                _b = _c.sent(), game = _b.game, stateManager = _b.stateManager;
                if (!(game.owner.toString() !== userId.toString())) return [3 /*break*/, 3];
                return [4 /*yield*/, stateManager.getPlayerState({
                        type: actorType,
                        token: token
                    })];
            case 2:
                playerState = _c.sent();
                playerState.userId = userId;
                _c.label = 3;
            case 3: return [2 /*return*/, res.end()];
        }
    });
}); })
    .get("/onceMore/:gameId", function (req, res) { return __awaiter(_this, void 0, void 0, function () {
    var gameId, game, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                gameId = req.params.gameId;
                return [4 /*yield*/, server_1.BaseLogic.getLogic(gameId)];
            case 1:
                game = (_a.sent()).game;
                return [4 /*yield*/, server_1.RedisCall.call(protocol_2.GameOver.name, {
                        playUrl: server_1.gameId2PlayUrl(game.id),
                        onceMore: true,
                        namespace: config_1.namespace
                    })];
            case 2:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, res.json({ code: 0, url: result.lobbyUrl })];
                }
                return [2 /*return*/, res.json({ code: 1, msg: "server error" })];
        }
    });
}); });
server_1.Server.start(config_1.namespace, Controller_1.default, path_1.resolve(__dirname, "../static"), router);
robot_1.RobotServer.start(config_1.namespace, Robot_1.default);
server_1.RedisCall.handle(protocol_1.CreateGame.name(config_1.namespace), function (_a) {
    var keys = _a.keys;
    return __awaiter(_this, void 0, void 0, function () {
        var gameId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, server_1.Server.newGame({
                        title: "ParallelApplication:" + new Date().toUTCString(),
                        params: {
                            groupSize: 20
                        }
                    })];
                case 1:
                    gameId = _b.sent();
                    return [2 /*return*/, { playUrls: keys.map(function (key) { return server_1.gameId2PlayUrl(gameId); }) }];
            }
        });
    });
});
