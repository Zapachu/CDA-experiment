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
var linker_share_1 = require("linker-share");
var GameService_1 = require("./GameService");
var model_1 = require("../model");
var eventDispatcher_1 = require("../controller/eventDispatcher");
var util_1 = require("@elf/util");
var protocol_1 = require("@elf/protocol");
var stateManagers = {};
var StateManager = /** @class */ (function () {
    function StateManager(game) {
        this.game = game;
    }
    StateManager.getManager = function (gameId) {
        return __awaiter(this, void 0, void 0, function () {
            var game, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!!stateManagers[gameId]) return [3 /*break*/, 3];
                        return [4 /*yield*/, GameService_1.GameService.getGame(gameId)];
                    case 1:
                        game = _c.sent();
                        _a = stateManagers;
                        _b = gameId;
                        return [4 /*yield*/, (new StateManager(game)).init()];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3: return [2 /*return*/, stateManagers[gameId]];
                }
            });
        });
    };
    StateManager.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.initState()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    StateManager.prototype.initState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameStateDoc, _a, namespace, params, playUrl;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, model_1.GameStateModel.findOne({ gameId: this.game.id })];
                    case 1:
                        gameStateDoc = _b.sent();
                        if (gameStateDoc) {
                            this.gameState = gameStateDoc.data;
                            return [2 /*return*/];
                        }
                        _a = this.game, namespace = _a.namespace, params = _a.params;
                        return [4 /*yield*/, protocol_1.RedisCall.call(protocol_1.Linker.Create.name(namespace), {
                                owner: this.game.owner,
                                elfGameId: this.game.id,
                                params: params
                            })];
                    case 2:
                        playUrl = (_b.sent()).playUrl;
                        this.gameState = {
                            gameId: this.game.id,
                            playUrl: playUrl,
                            playerState: {}
                        };
                        return [4 /*yield*/, new model_1.GameStateModel({ gameId: this.game.id, data: this.gameState }).save()];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    StateManager.prototype.joinRoom = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState;
            return __generator(this, function (_a) {
                playerState = this.gameState.playerState;
                if (playerState[actor.token] === undefined) {
                    playerState[actor.token] = {
                        actor: actor
                    };
                }
                return [2 /*return*/];
            });
        });
    };
    StateManager.prototype.setPlayerResult = function (playerToken, result) {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerCurPhaseState;
            return __generator(this, function (_a) {
                gameState = this.gameState;
                playerCurPhaseState = gameState.playerState[playerToken];
                if (!playerCurPhaseState) {
                    return [2 /*return*/];
                }
                model_1.PlayerModel.findByIdAndUpdate(playerCurPhaseState.actor.playerId, {
                    result: result
                }, function (err) { return err && util_1.Log.e(err); });
                return [2 /*return*/];
            });
        });
    };
    StateManager.prototype.broadcastState = function () {
        util_1.Log.d(JSON.stringify(this.gameState));
        eventDispatcher_1.EventDispatcher.socket.in(this.game.id)
            .emit(linker_share_1.SocketEvent.syncGameState, this.gameState);
        model_1.GameStateModel.findOneAndUpdate({ gameId: this.game.id }, {
            $set: {
                data: this.gameState,
                updateAt: Date.now()
            }
        }, { new: true }, function (err) { return err ? util_1.Log.e(err) : null; });
    };
    return StateManager;
}());
exports.StateManager = StateManager;
//# sourceMappingURL=StateManager.js.map