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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@bespoke/server");
var config_1 = require("./config");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.periods = [];
        gameState.periodIndex = 0;
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
                        playerState.periodIndices = [];
                        playerState.profit = 0;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            function isA() {
                return playerState.role === config_1.Role.A;
            }
            function calcResult(aChoice, bChoice) {
                switch (gameType) {
                    case config_1.GameType.Card: {
                        var _a = __read(config_1.cardGame.outcomeMatrix4Player1[aChoice][bChoice], 2), aEarning = _a[0], bEarning = _a[1];
                        return { aEarning: aEarning, bEarning: bEarning };
                    }
                    case config_1.GameType.LeftRight: {
                        var dieRoll = ~~(Math.random() * 6) + 1;
                        var matrix = dieRoll > 2 ? config_1.LRGame.outcomeMatrix4Player1.big : config_1.LRGame.outcomeMatrix4Player1.small;
                        var _b = __read(matrix[aChoice][bChoice], 2), aEarning = _b[0], bEarning = _b[1];
                        return { aEarning: aEarning, bEarning: bEarning, dieRoll: dieRoll };
                    }
                }
            }
            var _a, vsRobot, gameType, playerStates, playerState, gameState, pairEntry, choice, hisState, _b, aChoice, bChoice, _c, aEarning, bEarning, dieRoll, _d, myEarning, hisEarning, roundRecord;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.game.params, vsRobot = _a.vsRobot, gameType = _a.gameType;
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _e.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _e.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 3:
                        gameState = _e.sent();
                        switch (type) {
                            case config_1.MoveType.getRole: {
                                if (playerState.role !== undefined) {
                                    break;
                                }
                                if (vsRobot) {
                                    playerState.role = Math.random() > 0.5 ? config_1.Role.A : config_1.Role.B;
                                }
                                else {
                                    pairEntry = Object.entries(playerStates)
                                        .find(function (_a) {
                                        var _b = __read(_a, 2), token = _b[0], state = _b[1];
                                        return token !== actor.token && state.pairId === undefined;
                                    });
                                    if (!pairEntry) {
                                        playerState.role = config_1.Role.A;
                                        break;
                                    }
                                    playerState.role = config_1.Role.B;
                                    playerState.pairId = pairEntry[0];
                                    pairEntry[1].pairId = actor.token;
                                }
                                break;
                            }
                            case config_1.MoveType.submitMove: {
                                choice = params.choice;
                                if (vsRobot) {
                                }
                                else {
                                    hisState = playerStates[playerState.pairId];
                                    if (hisState.choice === undefined) {
                                        playerState.choice = choice;
                                        playerState.playerStatus = config_1.PlayerStatus.waiting;
                                    }
                                    else {
                                        _b = __read(isA() ? [choice, hisState.choice] : [hisState.choice, choice], 2), aChoice = _b[0], bChoice = _b[1];
                                        _c = calcResult(aChoice, bChoice), aEarning = _c.aEarning, bEarning = _c.bEarning, dieRoll = _c.dieRoll;
                                        _d = __read(isA() ? [aEarning, bEarning] : [bEarning, aEarning], 2), myEarning = _d[0], hisEarning = _d[1];
                                        roundRecord = {
                                            index: gameState.periodIndex++,
                                            aChoice: aChoice,
                                            bChoice: bChoice,
                                            aEarning: aEarning,
                                            bEarning: bEarning,
                                            dieRoll: dieRoll
                                        };
                                        gameState.periods.push(roundRecord);
                                        playerState.periodIndices.push(roundRecord.index);
                                        playerState.profit += myEarning;
                                        playerState.playerStatus = config_1.PlayerStatus.result;
                                        hisState.choice = undefined;
                                        hisState.periodIndices.push(roundRecord.index);
                                        hisState.profit += hisEarning;
                                        hisState.playerStatus = config_1.PlayerStatus.result;
                                    }
                                }
                                break;
                            }
                            case config_1.MoveType.proceed: {
                                playerState.playerStatus = config_1.PlayerStatus.playing;
                                playerStates[playerState.pairId].playerStatus = config_1.PlayerStatus.playing;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
