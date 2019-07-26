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
exports.QUESTION_ANSWERS = ['0.05', '5', '47', '4', '29', '20', 'C'];
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.calcResult = function (playerState) { return __awaiter(_this, void 0, void 0, function () {
            var correctNumber, point, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        correctNumber = 0;
                        playerState.answers.forEach(function (ans, i) {
                            if (ans === exports.QUESTION_ANSWERS[i])
                                correctNumber++;
                        });
                        point = Number((correctNumber * this.game.params.exchangeRate).toFixed(2));
                        playerState.correctNumber = correctNumber;
                        playerState.point = point;
                        playerState.playerStage = config_1.PlayerStage.over;
                        data = {
                            seatNumber: playerState.seatNumber,
                            answers: playerState.answers
                        };
                        return [4 /*yield*/, new server_1.Model.FreeStyleModel({
                                game: this.game.id,
                                key: config_1.SheetType.result,
                                data: data
                            }).save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        return _this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.gameStage = config_1.GameStage.seatNumber;
        gameState.time = 0;
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
                        playerState.answers = [];
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, playerState, hasBeenOccupied;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _a.sent();
                        switch (type) {
                            case config_1.MoveType.submitSeatNumber: {
                                hasBeenOccupied = Object.values(playerStates).some(function (_a) {
                                    var seatNumber = _a.seatNumber;
                                    return seatNumber === params.seatNumber;
                                });
                                if (hasBeenOccupied) {
                                    cb(false);
                                    break;
                                }
                                playerState.seatNumber = params.seatNumber;
                                playerState.index = 0;
                                break;
                            }
                            case config_1.MoveType.answer: {
                                playerState.answers[playerState.index] = params.answer;
                                if (playerState.index >= config_1.QUESTIONS.length - 1) {
                                    this.calcResult(playerState);
                                }
                                else {
                                    playerState.index += 1;
                                }
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handleGameOver()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.handleGameOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, tasks;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        global.clearInterval(this.timer);
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        tasks = Object.values(playerStates).map(function (playerState) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(playerState.playerStage !== config_1.PlayerStage.over)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.calcResult(playerState)];
                                    case 1:
                                        _a.sent();
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(tasks)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var timeLimit, gameState;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeLimit = this.game.params.timeLimit;
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        switch (type) {
                            case config_1.MoveType.startMainTest: {
                                gameState.gameStage = config_1.GameStage.mainTest;
                                this.timer = global.setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (gameState.status !== server_1.GameStatus.started) {
                                                    return [2 /*return*/];
                                                }
                                                if (!(gameState.time++ >= timeLimit * 60)) return [3 /*break*/, 2];
                                                return [4 /*yield*/, this.handleGameOver()];
                                            case 1:
                                                _a.sent();
                                                _a.label = 2;
                                            case 2: return [4 /*yield*/, this.stateManager.syncState()];
                                            case 3:
                                                _a.sent();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); }, 1000);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.Controller = Controller;
