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
Object.defineProperty(exports, "__esModule", { value: true });
var share_1 = require("@bespoke/share");
var GameDAO_1 = require("../GameDAO");
var EventIO_1 = require("../EventIO");
var isEqual = require("lodash/isEqual");
var cloneDeep = require("lodash/cloneDeep");
var GameStateSynchronizer = /** @class */ (function () {
    function GameStateSynchronizer(logic) {
        this.logic = logic;
    }
    GameStateSynchronizer.prototype.getState = function (forClient) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this._state) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, GameDAO_1.GameDAO.queryGameState(this.logic.game.id)];
                    case 1:
                        _a._state = (_b.sent()) || this.logic.initGameState();
                        _b.label = 2;
                    case 2:
                        if (forClient) {
                            return [2 /*return*/, this.logic.filterGameState(this._state)];
                        }
                        else {
                            return [2 /*return*/, this._state];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    GameStateSynchronizer.prototype.syncState = function (wholeState) {
        return __awaiter(this, void 0, void 0, function () {
            var state, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.getState(false)];
                    case 1:
                        state = _d.sent();
                        if (!wholeState) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.syncClientState(wholeState)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (isEqual(state, this._stateSnapshot)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.syncClientState(wholeState)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        this._stateSnapshot = cloneDeep(state);
                        _b = (_a = GameDAO_1.GameDAO).saveGameState;
                        _c = [this.logic.game.id];
                        return [4 /*yield*/, this.getState(false)];
                    case 6:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    GameStateSynchronizer.prototype.syncClientState = function (wholeState) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getState(true)];
                    case 1:
                        state = _a.sent();
                        EventIO_1.EventIO.emitEvent(this.logic.game.id, share_1.SocketEvent.syncGameState_json, state);
                        return [2 /*return*/];
                }
            });
        });
    };
    return GameStateSynchronizer;
}());
exports.GameStateSynchronizer = GameStateSynchronizer;
var PlayerStateSynchronizer = /** @class */ (function () {
    function PlayerStateSynchronizer(actor, controller) {
        this.actor = actor;
        this.controller = controller;
    }
    PlayerStateSynchronizer.prototype.getState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!this._state) return [3 /*break*/, 4];
                        _a = this;
                        return [4 /*yield*/, GameDAO_1.GameDAO.queryPlayerState(this.controller.game.id, this.actor.token)];
                    case 1:
                        _b = (_c.sent());
                        if (_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.controller.initPlayerState(this.actor)];
                    case 2:
                        _b = (_c.sent());
                        _c.label = 3;
                    case 3:
                        _a._state = _b;
                        _c.label = 4;
                    case 4: return [2 /*return*/, this._state];
                }
            });
        });
    };
    PlayerStateSynchronizer.prototype.syncState = function (wholeState) {
        return __awaiter(this, void 0, void 0, function () {
            var state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getState()];
                    case 1:
                        state = _a.sent();
                        if (!wholeState) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.syncClientState(wholeState)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (isEqual(state, this._stateSnapshot)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.syncClientState(wholeState)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        this._stateSnapshot = cloneDeep(state);
                        GameDAO_1.GameDAO.savePlayerState(this.controller.game.id, this.actor.token, state);
                        return [2 /*return*/];
                }
            });
        });
    };
    PlayerStateSynchronizer.prototype.syncClientState = function (wholeState) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, state;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.controller.stateManager.getGameState()];
                    case 1:
                        gameState = _a.sent();
                        return [4 /*yield*/, this.getState()];
                    case 2:
                        state = _a.sent();
                        EventIO_1.EventIO.emitEvent(state.connectionId, share_1.SocketEvent.syncPlayerState_json, state);
                        EventIO_1.EventIO.emitEvent(gameState.connectionId, share_1.SocketEvent.syncPlayerState_json, state, this.actor.token);
                        return [2 /*return*/];
                }
            });
        });
    };
    return PlayerStateSynchronizer;
}());
exports.PlayerStateSynchronizer = PlayerStateSynchronizer;
//# sourceMappingURL=BaseSynchronizer.js.map