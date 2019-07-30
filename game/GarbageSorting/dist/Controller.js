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
var protocol_1 = require("@elf/protocol");
var config_1 = require("./config");
var FreeStyleModel = server_1.Model.FreeStyleModel;
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.robotJoined = false;
        _this.ShoutTimeout = {};
        return _this;
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
                        playerState.score = 100;
                        playerState.contribution = 0;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerState, gameState, playerStates, _a, answer, index, score, answer, index, playerStateArray, score, onceMore, res;
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
                            case config_1.MoveType.prepare: return [3 /*break*/, 4];
                            case config_1.MoveType.check: return [3 /*break*/, 5];
                            case config_1.MoveType.shout: return [3 /*break*/, 6];
                            case config_1.MoveType.back: return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 4:
                        {
                            if (playerState.answers !== undefined) {
                                return [2 /*return*/];
                            }
                            this.initPlayer(playerState);
                            if (playerState.actor.type === server_1.Actor.serverRobot) {
                                this.push(playerState.actor, config_1.PushType.robotShout);
                            }
                            return [3 /*break*/, 9];
                        }
                        _b.label = 5;
                    case 5:
                        {
                            answer = params.answer, index = params.index;
                            if (index >= exports.ITEMS.length || playerState.answers[index] !== undefined) {
                                return [2 /*return*/];
                            }
                            if (!answer) {
                                return [2 /*return*/, cb("请选择一种垃圾类别")];
                            }
                            clearInterval(this.ShoutTimeout[playerState.actor.token]);
                            if (answer !== config_1.GARBAGE.pass) {
                                playerState.score -= config_1.ITEM_COST;
                            }
                            playerState.flyTo = undefined;
                            score = this.checkScore(answer, index);
                            playerState.contribution += score;
                            cb(null, score > 0);
                            return [3 /*break*/, 9];
                        }
                        _b.label = 6;
                    case 6:
                        {
                            answer = params.answer, index = params.index;
                            if (index >= exports.ITEMS.length || playerState.answers[index] !== undefined) {
                                return [2 /*return*/];
                            }
                            if (!answer) {
                                return [2 /*return*/, cb("请选择一种垃圾类别")];
                            }
                            playerStateArray = Object.values(playerStates);
                            if (!this.robotJoined && playerStateArray.length < groupSize) {
                                // 第一次有人报价时补满机器人
                                this.initRobots(groupSize - playerStateArray.length);
                                this.robotJoined = true;
                            }
                            playerState.answers[index] = answer;
                            if (playerState.actor.type === server_1.Actor.serverRobot) {
                                if (answer !== config_1.GARBAGE.pass) {
                                    playerState.score -= config_1.ITEM_COST;
                                }
                                score = this.checkScore(answer, index);
                                playerState.contribution += score;
                            }
                            this.shoutTicking(playerState);
                            if (playerStateArray.length === groupSize &&
                                playerStateArray.every(function (ps) { return ps.answers && ps.answers.length === exports.ITEMS.length; })) {
                                this.processGameState(gameState, playerStateArray);
                            }
                            return [3 /*break*/, 9];
                        }
                        _b.label = 7;
                    case 7:
                        onceMore = params.onceMore;
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.Trial.Done.name, {
                                userId: playerState.user.id,
                                onceMore: onceMore,
                                namespace: config_1.namespace
                            })];
                    case 8:
                        res = _b.sent();
                        res ? cb(res.lobbyUrl) : null;
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.checkScore = function (answer, index) {
        var _a = exports.ITEMS[index], value = _a.value, garbage = _a.garbage;
        if (answer === garbage) {
            return value;
        }
        else {
            return 0;
        }
    };
    Controller.prototype.processGameState = function (gameState, playerStates) {
        var groupSize = this.game.params.groupSize;
        var totalScore = playerStates.reduce(function (acc, current) { return acc + current.contribution; }, 0);
        var averageScore = totalScore / groupSize;
        var sortedPlayers = playerStates
            .map(function (ps) {
            var finalScore = ps.score + averageScore;
            ps.score = finalScore;
            //@ts-ignore
            return { score: finalScore, img: ps.user.headimg };
        })
            .sort(function (a, b) { return b.score - a.score; });
        gameState.sortedPlayers = sortedPlayers;
        gameState.totalScore = totalScore;
        this.recordResult(playerStates);
    };
    Controller.prototype.recordResult = function (playerStates) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                playerStates.forEach(function (ps) {
                    if (ps.actor.type !== server_1.Actor.player) {
                        return;
                    }
                    new FreeStyleModel({
                        game: _this.game.id,
                        key: ps.user.id,
                        data: {
                            score: ps.score
                        }
                    })
                        .save()
                        .catch(function (e) { return console.error(e); });
                });
                return [2 /*return*/];
            });
        });
    };
    Controller.prototype.initRobots = function (amount) {
        for (var i = 0; i < amount; i++) {
            this.startRobot("Robot_" + i);
        }
    };
    Controller.prototype.initPlayer = function (playerState) {
        playerState.answers = [];
        this.shoutTicking(playerState);
    };
    Controller.prototype.shoutTicking = function (playerState) {
        var _this = this;
        if (playerState.actor.type === server_1.Actor.serverRobot) {
            return;
        }
        var token = playerState.actor.token;
        var index = playerState.answers.length;
        if (this.ShoutTimeout[token]) {
            clearInterval(this.ShoutTimeout[token]);
        }
        if (index === exports.ITEMS.length) {
            return;
        }
        var shoutTimer = 0;
        this.ShoutTimeout[token] = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.push(playerState.actor, config_1.PushType.shoutTimer, { shoutTimer: shoutTimer });
                        if (shoutTimer++ < config_1.SHOUT_TIMER) {
                            return [2 /*return*/];
                        }
                        clearInterval(this.ShoutTimeout[token]);
                        playerState.flyTo = config_1.GARBAGE.pass;
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 1:
                        _a.sent();
                        this.nextItem(playerState, config_1.GARBAGE.pass, index);
                        return [2 /*return*/];
                }
            });
        }); }, 1000);
    };
    Controller.prototype.nextItem = function (playerState, answer, index) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                playerState.answers[index] = answer;
                                playerState.flyTo = undefined;
                                if (index === exports.ITEMS.length - 1) {
                                    this.checkAndProcessGameState();
                                }
                                return [4 /*yield*/, this.stateManager.syncState()];
                            case 1:
                                _a.sent();
                                this.shoutTicking(playerState);
                                return [2 /*return*/];
                        }
                    });
                }); }, 1000);
                return [2 /*return*/];
            });
        });
    };
    Controller.prototype.checkAndProcessGameState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerStates, playerStateArray, gameState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        groupSize = this.game.params.groupSize;
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        playerStateArray = Object.values(playerStates);
                        if (!(playerStateArray.length === groupSize &&
                            playerStateArray.every(function (ps) { return ps.answers && ps.answers.length === exports.ITEMS.length; }))) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _a.sent();
                        this.processGameState(gameState, playerStateArray);
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
exports.ITEMS = [
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry },
    { value: 20, garbage: config_1.GARBAGE.dry }
];
