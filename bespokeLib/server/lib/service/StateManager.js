"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var StateSynchronizer_1 = require("./StateSynchronizer");
var GameDAO_1 = require("./GameDAO");
var StateManager = /** @class */ (function () {
    function StateManager(strategy, logic) {
        this.logic = logic;
        this.playerStateManagers = [];
        this.stateSynchronizer = new StateSynchronizer_1.StateSynchronizer(strategy, logic);
        this.gameStateManager = this.stateSynchronizer.getGameStateSynchronizer();
    }
    StateManager.prototype.getGameState = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameStateManager.getState(false)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StateManager.prototype.getPlayerManager = function (actor) {
        var playerStateManager = this.playerStateManagers.find(function (manager) { return manager.actor.token === actor.token; });
        if (!playerStateManager) {
            playerStateManager = this.stateSynchronizer.getPlayerStateSynchronizer(actor);
            this.playerStateManagers.push(playerStateManager);
        }
        return playerStateManager;
    };
    StateManager.prototype.getPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPlayerManager(actor).getState()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    StateManager.prototype.getPlayerStates = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, tokens, _a, _b, manager, playerState, e_1_1;
            var e_1, _c;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        playerStates = {};
                        return [4 /*yield*/, GameDAO_1.GameDAO.getPlayerTokens(this.logic.game.id)];
                    case 1:
                        tokens = _d.sent();
                        tokens.forEach(function (token) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getPlayerManager({ token: token, type: share_1.Actor.player })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        _d.label = 2;
                    case 2:
                        _d.trys.push([2, 7, 8, 9]);
                        _a = __values(this.playerStateManagers), _b = _a.next();
                        _d.label = 3;
                    case 3:
                        if (!!_b.done) return [3 /*break*/, 6];
                        manager = _b.value;
                        return [4 /*yield*/, manager.getState()];
                    case 4:
                        playerState = _d.sent();
                        playerStates[playerState.actor.token] = playerState;
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 3];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_1_1 = _d.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/, playerStates];
                }
            });
        });
    };
    StateManager.prototype.syncState = function (wholeState) {
        if (wholeState === void 0) { wholeState = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameStateManager.syncState(wholeState)];
                    case 1:
                        _a.sent();
                        this.playerStateManagers.forEach(function (manager) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            return [2 /*return*/, manager.syncState(wholeState)];
                        }); }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    StateManager.prototype.syncWholeState2Player = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameStateManager.syncState(true)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getPlayerManager(actor).syncState(true)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return StateManager;
}());
exports.StateManager = StateManager;
