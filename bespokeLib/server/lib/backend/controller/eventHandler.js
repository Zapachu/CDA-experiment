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
var _a;
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var service_1 = require("../service");
exports.EventHandler = (_a = {},
    _a[share_1.SocketEvent.online] = function (connection, cb) {
        if (cb === void 0) { cb = function () { return null; }; }
        return __awaiter(_this, void 0, void 0, function () {
            var game, actor, controller, gameState, playerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        game = connection.game, actor = connection.actor;
                        return [4 /*yield*/, service_1.BaseLogic.getLogic(game.id)];
                    case 1:
                        controller = _a.sent();
                        connection.join(game.id);
                        controller.connections.set(actor.token, connection);
                        cb();
                        if (!(actor.type === share_1.Actor.owner)) return [3 /*break*/, 4];
                        return [4 /*yield*/, controller.stateManager.getGameState()];
                    case 2:
                        gameState = _a.sent();
                        gameState.connectionId = connection.id;
                        return [4 /*yield*/, controller.stateManager.syncState(true)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 4: return [4 /*yield*/, controller.stateManager.getPlayerState(actor)];
                    case 5:
                        playerState = _a.sent();
                        playerState.connectionId = connection.id;
                        return [4 /*yield*/, controller.stateManager.syncWholeState2Player(actor)];
                    case 6:
                        _a.sent();
                        _a.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
    _a[share_1.SocketEvent.disconnect] = function (_a) {
        var game = _a.game, actor = _a.actor;
        return __awaiter(_this, void 0, void 0, function () {
            var stateManager, gameState, playerState;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, service_1.BaseLogic.getLogic(game.id)];
                    case 1:
                        stateManager = (_b.sent()).stateManager;
                        if (!(actor.type === share_1.Actor.owner)) return [3 /*break*/, 3];
                        return [4 /*yield*/, stateManager.getGameState()];
                    case 2:
                        gameState = _b.sent();
                        gameState.connectionId = '';
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, stateManager.getPlayerState(actor)];
                    case 4:
                        playerState = _b.sent();
                        playerState.connectionId = '';
                        _b.label = 5;
                    case 5: return [4 /*yield*/, stateManager.syncState()];
                    case 6:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    _a[share_1.SocketEvent.move] = function (_a, type, params, cb) {
        var actor = _a.actor, game = _a.game;
        return __awaiter(_this, void 0, void 0, function () {
            var controller;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, service_1.BaseLogic.getLogic(game.id)];
                    case 1:
                        controller = _b.sent();
                        return [4 /*yield*/, controller.moveReducer(actor, type, params, cb || (function () { return null; }))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    _a);
//# sourceMappingURL=eventHandler.js.map