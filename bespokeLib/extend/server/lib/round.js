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
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var share_1 = require("@extend/share");
var group_1 = require("./group");
var Round;
(function (Round) {
    var StateManager = /** @class */ (function () {
        function StateManager(roundIndex, stateManager) {
            this.roundIndex = roundIndex;
            this.stateManager = stateManager;
        }
        StateManager.prototype.getPlayerState = function (index) {
            return __awaiter(this, void 0, void 0, function () {
                var rounds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.getPlayerState(index)];
                        case 1:
                            rounds = (_a.sent()).rounds;
                            return [2 /*return*/, rounds[this.roundIndex]];
                    }
                });
            });
        };
        StateManager.prototype.getGameState = function () {
            return __awaiter(this, void 0, void 0, function () {
                var rounds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                        case 1:
                            rounds = (_a.sent()).rounds;
                            return [2 /*return*/, rounds[this.roundIndex]];
                    }
                });
            });
        };
        StateManager.prototype.getPlayerStates = function () {
            return __awaiter(this, void 0, void 0, function () {
                var playerStates, _a, _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            playerStates = [];
                            _b = (_a = Object).values;
                            return [4 /*yield*/, this.stateManager.getPlayerStates()];
                        case 1:
                            _b.apply(_a, [_c.sent()]).forEach(function (playerState) {
                                return (playerStates[playerState.index] =
                                    playerState.rounds[_this.roundIndex]);
                            });
                            return [2 /*return*/, playerStates];
                    }
                });
            });
        };
        StateManager.prototype.syncState = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.syncState()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return StateManager;
    }());
    Round.StateManager = StateManager;
    var Logic = /** @class */ (function () {
        function Logic(groupSize, groupIndex, roundIndex, params, stateManager, overCallback) {
            this.groupSize = groupSize;
            this.groupIndex = groupIndex;
            this.roundIndex = roundIndex;
            this.params = params;
            this.stateManager = stateManager;
            this.overCallback = overCallback;
        }
        Logic.prototype.roundStart = function () {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        Logic.prototype.initGameState = function () {
            return {};
        };
        Logic.prototype.initPlayerState = function (index) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {}];
                });
            });
        };
        Logic.prototype.playerMoveReducer = function (index, type, params, cb) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        return Logic;
    }());
    Round.Logic = Logic;
})(Round = exports.Round || (exports.Round = {}));
var Logic = /** @class */ (function (_super) {
    __extends(Logic, _super);
    function Logic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Logic.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        var _a = this, groupIndex = _a.groupIndex, _b = _a.params, round = _b.round, roundsParams = _b.roundsParams;
        this.roundsLogic = Array(round)
            .fill(null)
            .map(function (_, i) {
            return new _this.RoundLogic(_this.groupSize, groupIndex, i, roundsParams[i], new Round.StateManager(i, _this.stateManager), function () { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.roundOverCallback()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.startRound(i + 1)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        return this;
    };
    Logic.prototype.initGameState = function () {
        var _this = this;
        var gameState = _super.prototype.initGameState.call(this);
        gameState.rounds = Array(this.params.round)
            .fill(null)
            .map(function (_, i) { return _this.roundsLogic[i].initGameState(); });
        return gameState;
    };
    Logic.prototype.initPlayerState = function (user, groupIndex, index) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initPlayerState.call(this, user, groupIndex, index)];
                    case 1:
                        playerState = _c.sent();
                        playerState.status = share_1.RoundDecorator.PlayerStatus.guide;
                        playerState.rounds = [];
                        i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(i < this.params.round)) return [3 /*break*/, 5];
                        _a = playerState.rounds;
                        _b = i;
                        return [4 /*yield*/, this.roundsLogic[i].initPlayerState(index)];
                    case 3:
                        _a[_b] = _c.sent();
                        _c.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, playerState];
                }
            });
        });
    };
    Logic.prototype.playerMoveReducer = function (index, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerState, playerStates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        groupSize = this.groupSize;
                        return [4 /*yield*/, this.stateManager.getPlayerState(index)];
                    case 1:
                        playerState = _a.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _a.sent();
                        if (!(type === share_1.RoundDecorator.MoveType.guideDone)) return [3 /*break*/, 3];
                        {
                            playerState.status = share_1.RoundDecorator.PlayerStatus.round;
                            if (playerStates.length === groupSize &&
                                playerStates.every(function (p) { return p.status === share_1.RoundDecorator.PlayerStatus.round; })) {
                                this.startRound(0);
                            }
                        }
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.roundsLogic[params.roundIndex].playerMoveReducer(index, type, params.params, cb)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Logic.prototype.roundOverCallback = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    Logic.prototype.startRound = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var round, gameState, playerStates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        round = this.params.round;
                        if (!(r < round)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        gameState.round = r;
                        return [4 /*yield*/, this.roundsLogic[r].roundStart()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 4:
                        playerStates = _a.sent();
                        playerStates.forEach(function (p) { return (p.status = share_1.RoundDecorator.PlayerStatus.result); });
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.stateManager.syncState()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Logic;
}(group_1.Group.Logic));
exports.Logic = Logic;
