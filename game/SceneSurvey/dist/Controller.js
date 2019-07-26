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
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // initGameState(): TGameState<IGameState> {
    //   const gameState = super.initGameState();
    //   return gameState;
    // }
    Controller.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initPlayerState.call(this, actor)];
                    case 1:
                        playerState = _a.sent();
                        playerState.answers = [];
                        playerState.status = config_1.STATUS.instruction;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState, playerStates, answer, index, key, name_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _a.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _a.sent();
                        switch (type) {
                            case config_1.MoveType.prepare: {
                                playerState.status = config_1.STATUS.playing;
                                break;
                            }
                            case config_1.MoveType.shout: {
                                answer = params.answer, index = params.index;
                                if (playerState.answers[index] !== undefined) {
                                    return [2 /*return*/];
                                }
                                if (!answer) {
                                    return [2 /*return*/, cb("请选择一项再提交")];
                                }
                                playerState.answers[index] = answer;
                                if (index === config_1.PAGES.length - 1) {
                                    playerState.status = config_1.STATUS.info;
                                }
                                break;
                            }
                            case config_1.MoveType.info: {
                                if (playerState.key) {
                                    return [2 /*return*/];
                                }
                                key = params.key, name_1 = params.name;
                                if (Object.values(playerStates)
                                    .map(function (ps) { return ps.key; })
                                    .includes(key)) {
                                    return [2 /*return*/, cb("编号已使用")];
                                }
                                playerState.key = key;
                                playerState.name = name_1;
                                playerState.status = config_1.STATUS.end;
                                break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.onGameOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, resultData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.genExportData()];
                    case 2:
                        resultData = _b.sent();
                        Object.assign(gameState, {
                            sheets: (_a = {},
                                _a[config_1.SheetType.result] = {
                                    data: resultData
                                },
                                _a)
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.genExportData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, resultData, playerStateArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        resultData = [
                            ["编号", "姓名", "情景1", "情景2", "情景3", "情景4", "情景5"]
                        ];
                        playerStateArray = Object.values(playerStates);
                        playerStateArray.forEach(function (ps) {
                            var row = [
                                ps.key || "-",
                                ps.name || "-",
                                ps.answers[0] || "-",
                                ps.answers[1] || "-",
                                ps.answers[2] || "-",
                                ps.answers[3] || "-",
                                ps.answers[4] || "-"
                            ];
                            resultData.push(row);
                        });
                        return [2 /*return*/, resultData];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
