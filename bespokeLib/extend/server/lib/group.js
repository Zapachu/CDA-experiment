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
var server_1 = require("@bespoke/server");
var share_1 = require("@extend/share");
var Group;
(function (Group) {
    var StateManager = /** @class */ (function () {
        function StateManager(groupIndex, stateManager) {
            this.groupIndex = groupIndex;
            this.stateManager = stateManager;
        }
        StateManager.prototype.getPlayerState = function (index) {
            return __awaiter(this, void 0, void 0, function () {
                var playerStates;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getPlayerStates()];
                        case 1:
                            playerStates = _a.sent();
                            return [2 /*return*/, playerStates[index]];
                    }
                });
            });
        };
        StateManager.prototype.getGameState = function () {
            return __awaiter(this, void 0, void 0, function () {
                var groups;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                        case 1:
                            groups = (_a.sent()).groups;
                            return [2 /*return*/, groups[this.groupIndex].state];
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
                                return playerState.groupIndex === _this.groupIndex
                                    ? (playerStates[playerState.index] = playerState)
                                    : null;
                            });
                            return [2 /*return*/, playerStates.sort(function (p1, p2) { return p1.index - p2.index; })];
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
    Group.StateManager = StateManager;
    var Logic = /** @class */ (function () {
        function Logic(gameId, groupIndex, groupSize, params, stateManager) {
            this.gameId = gameId;
            this.groupIndex = groupIndex;
            this.groupSize = groupSize;
            this.params = params;
            this.stateManager = stateManager;
        }
        Logic.prototype.init = function () {
            return this;
        };
        Logic.prototype.initGameState = function () {
            return {};
        };
        Logic.prototype.initPlayerState = function (user, groupIndex, index) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            user: user,
                            groupIndex: groupIndex,
                            index: index
                        }];
                });
            });
        };
        Logic.prototype.teacherMoveReducer = function (type, params, cb) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        Logic.prototype.playerMoveReducer = function (index, type, params, cb) {
            return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/];
            }); });
        };
        return Logic;
    }());
    Group.Logic = Logic;
})(Group = exports.Group || (exports.Group = {}));
var Logic = /** @class */ (function (_super) {
    __extends(Logic, _super);
    function Logic() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Logic.prototype.init = function () {
        var _this = this;
        _super.prototype.init.call(this);
        var _a = this.game, id = _a.id, _b = _a.params, group = _b.group, groupSize = _b.groupSize, groupsParams = _b.groupsParams;
        this.groupsLogic = Array(group)
            .fill(null)
            .map(function (_, i) {
            return new _this.GroupLogic(id, i, groupSize, groupsParams[i], new Group.StateManager(i, _this.stateManager)).init();
        });
        return this;
    };
    Logic.prototype.initGameState = function () {
        var _this = this;
        var gameState = _super.prototype.initGameState.call(this);
        gameState.groups = Array(this.game.params.group)
            .fill(null)
            .map(function (_, i) { return ({
            playerNum: 0,
            state: _this.groupsLogic[i].initGameState()
        }); });
        return gameState;
    };
    Logic.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.groupsLogic[params.groupIndex].teacherMoveReducer(type, params.params, cb)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Logic.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, gameState, playerState, groupIndex, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        groupSize = this.game.params.groupSize;
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _d.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _d.sent();
                        if (!(type === share_1.GroupDecorator.MoveType.getGroup)) return [3 /*break*/, 5];
                        if (playerState.groupIndex !== undefined) {
                            return [2 /*return*/];
                        }
                        groupIndex = gameState.groups.findIndex(function (group) { return group.playerNum < groupSize; });
                        if (groupIndex === -1) {
                            return [2 /*return*/];
                        }
                        _b = (_a = Object).assign;
                        _c = [playerState];
                        return [4 /*yield*/, this.groupsLogic[groupIndex].initPlayerState(playerState.user, groupIndex, gameState.groups[groupIndex].playerNum++)];
                    case 3:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [4 /*yield*/, this.stateManager.syncState()];
                    case 4:
                        _d.sent();
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, this.groupsLogic[params.groupIndex].playerMoveReducer(playerState.index, type, params.params, cb)];
                    case 6:
                        _d.sent();
                        _d.label = 7;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    return Logic;
}(server_1.BaseLogic));
exports.Logic = Logic;
