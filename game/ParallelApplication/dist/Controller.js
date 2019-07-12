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
var share_1 = require("@bespoke/share");
var protocol_1 = require("@elf/protocol");
var config_1 = require("./config");
var FreeStyleModel = server_1.Model.FreeStyleModel;
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.robotJoined = false;
        return _this;
    }
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.sortedPlayers = [];
        return gameState;
    };
    // async initPlayerState(actor: IActor): Promise<TPlayerState<IPlayerState>> {
    //   const playerState = await super.initPlayerState(actor);
    //   return playerState;
    // }
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var groupSize, playerState, gameState, playerStates, _a, playerStateArray, token_1, me, onceMore, res;
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
                            case config_1.MoveType.checkVersion: return [3 /*break*/, 4];
                            case config_1.MoveType.join: return [3 /*break*/, 6];
                            case config_1.MoveType.shout: return [3 /*break*/, 7];
                            case config_1.MoveType.result: return [3 /*break*/, 8];
                            case config_1.MoveType.back: return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 13];
                    case 4: return [4 /*yield*/, this.checkOldVersion(gameState, playerState.userId, cb)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 13];
                    case 6:
                        {
                            if (playerState.score !== undefined) {
                                return [2 /*return*/];
                            }
                            this.initPlayer(playerState);
                            if ((playerState.actor.type = server_1.Actor.serverRobot)) {
                                this.push(playerState.actor, config_1.PushType.robotShout);
                            }
                            return [3 /*break*/, 13];
                        }
                        _b.label = 7;
                    case 7:
                        {
                            if (playerState.schools !== undefined) {
                                return [2 /*return*/];
                            }
                            if (this.invalidParams(params)) {
                                return [2 /*return*/, cb("请选择正确的学校投递")];
                            }
                            playerState.schools = params.schools;
                            playerStateArray = Object.values(playerStates);
                            if (!this.robotJoined && playerStateArray.length < groupSize) {
                                // 第一次有人报价时补满机器人
                                this.initRobots(groupSize - playerStateArray.length);
                                this.robotJoined = true;
                            }
                            if (playerStateArray.length === groupSize &&
                                playerStateArray.every(function (ps) { return ps.schools !== undefined; })) {
                                this.processGameState(gameState, playerStateArray);
                            }
                            return [3 /*break*/, 13];
                        }
                        _b.label = 8;
                    case 8:
                        if (playerState.admission !== undefined) {
                            return [2 /*return*/];
                        }
                        token_1 = playerState.actor.token;
                        me = gameState.sortedPlayers.find(function (item) { return item.token === token_1; });
                        playerState.admission = me && me.admission;
                        if (!(playerState.admission !== undefined)) return [3 /*break*/, 10];
                        return [4 /*yield*/, new FreeStyleModel({
                                game: this.game.id,
                                key: playerState.userId,
                                data: {
                                    admission: playerState.admission
                                }
                            }).save()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10:
                        cb("/" + share_1.config.rootName + "/" + config_1.namespace + "/result/" + this.game.id);
                        return [3 /*break*/, 13];
                    case 11:
                        onceMore = params.onceMore;
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.Trial.Done.name, {
                                userId: playerState.user.id,
                                onceMore: onceMore,
                                namespace: config_1.namespace
                            })];
                    case 12:
                        res = _b.sent();
                        res ? cb(res.lobbyUrl) : null;
                        return [3 /*break*/, 13];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.invalidParams = function (params) {
        var schools = params.schools;
        return (schools.length !== config_1.APPLICATION_NUM ||
            schools.some(function (s) {
                return (typeof s !== "number" ||
                    s < config_1.SCHOOL.beijingUni ||
                    s > config_1.SCHOOL.zhongshanUni);
            }));
    };
    Controller.prototype.processGameState = function (gameState, playerStates) {
        var _a;
        var enrollment = (_a = {},
            _a[config_1.SCHOOL.beijingUni] = 0,
            _a[config_1.SCHOOL.qinghuaUni] = 0,
            _a[config_1.SCHOOL.renminUni] = 0,
            _a[config_1.SCHOOL.fudanUni] = 0,
            _a[config_1.SCHOOL.shangjiaoUni] = 0,
            _a[config_1.SCHOOL.zhejiangUni] = 0,
            _a[config_1.SCHOOL.nanjingUni] = 0,
            _a[config_1.SCHOOL.wuhanUni] = 0,
            _a[config_1.SCHOOL.huakeUni] = 0,
            _a[config_1.SCHOOL.nankaiUni] = 0,
            _a[config_1.SCHOOL.xiamenUni] = 0,
            _a[config_1.SCHOOL.zhongshanUni] = 0,
            _a);
        var sortedPlayers = gameState.sortedPlayers;
        var candidates = playerStates.sort(function (a, b) { return b.score - a.score; });
        candidates.forEach(function (ps) {
            var admission = config_1.SCHOOL.none;
            var schools = ps.schools;
            for (var i = 0; i < schools.length; i++) {
                var school = schools[i];
                if (enrollment[school] < config_1.QUOTA[school]) {
                    admission = school;
                    enrollment[school]++;
                    break;
                }
            }
            sortedPlayers.push({
                token: ps.actor.token,
                schools: schools,
                score: ps.score,
                admission: admission
            });
        });
    };
    Controller.prototype.initRobots = function (amount) {
        for (var i = 0; i < amount; i++) {
            this.startRobot("Robot_" + i);
        }
    };
    Controller.prototype.initPlayer = function (playerState) {
        var scores = this._getScores();
        playerState.scores = scores;
        playerState.score = scores.reduce(function (acc, item) { return acc + item; });
        // this._shoutTicking();
    };
    // private _shoutTicking() {
    //   if (this.shoutTimer) {
    //     return;
    //   }
    //   const { groupSize } = this.game.params;
    //   let shoutTime = 1;
    //   this.shoutTimer = setInterval(async () => {
    //     const playerStates = await this.stateManager.getPlayerStates();
    //     const playerStateArray = Object.values(playerStates);
    //     playerStateArray.forEach(s => {
    //       this.push(s.actor, PushType.shoutTimer, { shoutTime });
    //     });
    //     if (
    //       playerStateArray.length === groupSize &&
    //       playerStateArray.every(ps => ps.price !== undefined)
    //     ) {
    //       clearInterval(this.shoutTimer);
    //       return;
    //     }
    //     if (
    //       !this.robotJoined &&
    //       playerStateArray.length < groupSize &&
    //       SHOUT_TIMER - shoutTime < 30
    //     ) {
    //       // 倒计时30秒时补满机器人
    //       this.initRobots(groupSize - playerStateArray.length);
    //       this.robotJoined = true;
    //     }
    //     if (shoutTime++ < SHOUT_TIMER) {
    //       return;
    //     }
    //     clearInterval(this.shoutTimer);
    //     await this._shoutTickEnds(playerStateArray);
    //   }, 1000);
    // }
    // private async _shoutTickEnds(playerStates: Array<IPlayerState>) {
    //   const shoutedPlayerStates = playerStates.filter(ps => {
    //     if (ps.price === undefined) {
    //       ps.price = 0;
    //       ps.bidNum = 0;
    //       return false;
    //     }
    //     return true;
    //   });
    //   const gameState = await this.stateManager.getGameState();
    //   this.processProfits(gameState, shoutedPlayerStates);
    //   await this.stateManager.syncState();
    // }
    Controller.prototype.checkOldVersion = function (gameState, userId, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!gameState.sortedPlayers) return [3 /*break*/, 2];
                        return [4 /*yield*/, server_1.RedisCall.call(protocol_1.Trial.Done.name, {
                                userId: userId,
                                onceMore: true,
                                namespace: config_1.namespace
                            })];
                    case 1:
                        res = _a.sent();
                        res ? cb(res.lobbyUrl) : null;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype._getScores = function () {
        var chinese = genRandomInt(80, 149);
        var maths = genRandomInt(80, 149);
        var english = genRandomInt(80, 149);
        var comprehensive = genRandomInt(160, 295);
        return [chinese, maths, english, comprehensive];
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.genRandomInt = genRandomInt;
