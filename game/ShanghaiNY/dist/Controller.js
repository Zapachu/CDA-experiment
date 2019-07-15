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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
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
    //region init
    Controller.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.init.call(this)];
                    case 1:
                        _a.sent();
                        switch (this.game.params.gameType) {
                            case config_1.GameType.T1: {
                                this.Test = config_1.Test1;
                                break;
                            }
                            case config_1.GameType.T2: {
                                this.Test = config_1.Test2;
                                break;
                            }
                        }
                        return [2 /*return*/, this];
                }
            });
        });
    };
    Controller.prototype.initGameState = function () {
        var gameState = _super.prototype.initGameState.call(this);
        gameState.groups = [];
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
                        playerState.stage = config_1.Stage.Seat;
                        playerState.stageIndex = config_1.TestStageIndex.Interface;
                        playerState.choices = [];
                        playerState.profits = [];
                        playerState.surveyAnswers = [];
                        playerState.roundIndex = 0;
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            function validateAnswer(params) {
                var c1 = params.c1, c2 = params.c2;
                switch (gameType) {
                    case config_1.GameType.T1: {
                        return !!c1;
                    }
                    case config_1.GameType.T2: {
                        return !!c1 && !!c2 && !c2.includes(undefined) && c2.length === 2;
                    }
                }
            }
            function calcProfit(playerState, min) {
                var probs = groups[playerState.groupIndex].probs;
                var roundIndex = playerState.roundIndex;
                var curChoice = playerState.choices[roundIndex];
                var x = curChoice.c || curChoice.c1;
                var bi = version === config_1.Version.V3 ? (probs[roundIndex] ? b1 : b0) : b;
                var ei = eH * (x - 1) + eL * (2 - x);
                var emin = min === config_1.Choice.One ? eL : eH;
                var ui = a * emin - bi * ei + c;
                if (curChoice.c1 === config_1.Choice.Wait && curChoice.c === config_1.Choice.One)
                    ui = ui - d;
                return ui;
            }
            var gameState, playerState, playerStates, groups, _a, playersPerGroup, gameType, version, rounds, a, b, b0, b1, c, d, eH, eL, p, _b, openGroupIndex, group, hasBeenOccupied, playersInGroup, ready, curRoundIndex_1, playersInGroup, ready, min_1, choseOne_1, min_2, nextRoundIndex;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _c.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 2:
                        playerState = _c.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _c.sent(), groups = gameState.groups, _a = this.game.params, playersPerGroup = _a.playersPerGroup, gameType = _a.gameType, version = _a.version, rounds = _a.rounds, a = _a.a, b = _a.b, b0 = _a.b0, b1 = _a.b1, c = _a.c, d = _a.d, eH = _a.eH, eL = _a.eL, p = _a.p;
                        _b = type;
                        switch (_b) {
                            case config_1.MoveType.initPosition: return [3 /*break*/, 4];
                            case config_1.MoveType.inputSeatNumber: return [3 /*break*/, 5];
                            case config_1.MoveType.answerTest: return [3 /*break*/, 6];
                            case config_1.MoveType.toMain: return [3 /*break*/, 7];
                            case config_1.MoveType.answerMain: return [3 /*break*/, 9];
                            case config_1.MoveType.advanceRoundIndex: return [3 /*break*/, 11];
                            case config_1.MoveType.answerSurvey: return [3 /*break*/, 12];
                        }
                        return [3 /*break*/, 13];
                    case 4:
                        {
                            if (playerState.groupIndex !== undefined) {
                                return [3 /*break*/, 13];
                            }
                            openGroupIndex = groups.findIndex(function (_a) {
                                var playerNum = _a.playerNum;
                                return playerNum < playersPerGroup;
                            });
                            if (openGroupIndex === -1) {
                                group = {
                                    playerNum: 0,
                                    mins: [],
                                    ones: [],
                                    probs: new Array(rounds).fill('').map(function () { return _this._isP(p); })
                                };
                                openGroupIndex = groups.push(group) - 1;
                            }
                            playerState.groupIndex = openGroupIndex;
                            playerState.positionIndex = groups[openGroupIndex].playerNum++;
                            return [3 /*break*/, 13];
                        }
                        _c.label = 5;
                    case 5:
                        {
                            hasBeenOccupied = Object.values(playerStates).some(function (_a) {
                                var seatNumber = _a.seatNumber;
                                return seatNumber === params.seatNumber;
                            });
                            if (hasBeenOccupied) {
                                cb(false);
                                return [3 /*break*/, 13];
                            }
                            playerState.seatNumber = params.seatNumber;
                            this.setPhaseResult(playerState.actor.token, { uniKey: params.seatNumber });
                            return [3 /*break*/, 13];
                        }
                        _c.label = 6;
                    case 6:
                        {
                            if (playerState.stageIndex < config_1.TestStageIndex.Interface) {
                                return [3 /*break*/, 13];
                            }
                            if (playerState.stageIndex === this.Test.length - 1) {
                                playerState.stageIndex = config_1.TestStageIndex.Next;
                            }
                            else {
                                playerState.stageIndex++;
                            }
                            return [3 /*break*/, 13];
                        }
                        _c.label = 7;
                    case 7:
                        playerState.stageIndex = config_1.TestStageIndex.Wait4Others;
                        return [4 /*yield*/, this.getPlayersInGroup(playerState.groupIndex)];
                    case 8:
                        playersInGroup = _c.sent();
                        ready = playersInGroup.length === playersPerGroup && playersInGroup.every(function (ps) { return ps.stageIndex === config_1.TestStageIndex.Wait4Others; });
                        if (ready) {
                            playersInGroup.forEach(function (ps) {
                                ps.stageIndex = config_1.MainStageIndex.Choose;
                                ps.stage = config_1.Stage.Main;
                            });
                        }
                        return [3 /*break*/, 13];
                    case 9:
                        if (!validateAnswer(params)) {
                            cb('invalid input');
                            return [3 /*break*/, 13];
                        }
                        curRoundIndex_1 = playerState.roundIndex;
                        if (playerState.choices[curRoundIndex_1]) {
                            return [3 /*break*/, 13];
                        }
                        playerState.choices[curRoundIndex_1] = { c1: params.c1, c2: params.c2 || [] };
                        playerState.stageIndex = config_1.MainStageIndex.Wait4Result;
                        return [4 /*yield*/, this.getPlayersInGroup(playerState.groupIndex)];
                    case 10:
                        playersInGroup = _c.sent();
                        ready = playersInGroup.length === playersPerGroup && playersInGroup.every(function (ps) { return !!ps.choices[curRoundIndex_1]; });
                        if (ready) {
                            switch (gameType) {
                                case config_1.GameType.T1: {
                                    min_1 = playersInGroup.some(function (ps) { return ps.choices[curRoundIndex_1].c1 === config_1.Choice.One; }) ? config_1.Choice.One : config_1.Choice.Two;
                                    groups[playerState.groupIndex].mins[curRoundIndex_1] = min_1;
                                    playersInGroup.forEach(function (ps) {
                                        var ui = calcProfit(ps, min_1);
                                        ps.profits[curRoundIndex_1] = ui;
                                        ps.finalProfit = ps.profits.reduce(function (acc, cur) { return acc + cur; }, 0);
                                        ps.stageIndex = config_1.MainStageIndex.Result;
                                    });
                                    break;
                                }
                                case config_1.GameType.T2: {
                                    choseOne_1 = playersInGroup.some(function (ps) { return ps.choices[curRoundIndex_1].c1 === config_1.Choice.One; });
                                    if (version === config_1.Version.V3) {
                                        choseOne_1 = choseOne_1 && groups[playerState.groupIndex].probs[curRoundIndex_1];
                                    }
                                    groups[playerState.groupIndex].ones[curRoundIndex_1] = choseOne_1;
                                    playersInGroup.forEach(function (ps) {
                                        var curChoice = ps.choices[curRoundIndex_1];
                                        var c = curChoice.c1 === config_1.Choice.Wait ? (choseOne_1 ? curChoice.c2[0] : curChoice.c2[1]) : curChoice.c1;
                                        curChoice.c = c;
                                    });
                                    min_2 = playersInGroup.some(function (ps) { return ps.choices[curRoundIndex_1].c === config_1.Choice.One; }) ? config_1.Choice.One : config_1.Choice.Two;
                                    groups[playerState.groupIndex].mins[curRoundIndex_1] = min_2;
                                    playersInGroup.forEach(function (ps) {
                                        var ui = calcProfit(ps, min_2);
                                        ps.profits[curRoundIndex_1] = ui;
                                        ps.finalProfit = ps.profits.reduce(function (acc, cur) { return acc + cur; }, 0);
                                        ps.stageIndex = config_1.MainStageIndex.Result;
                                    });
                                    break;
                                }
                            }
                        }
                        return [3 /*break*/, 13];
                    case 11:
                        {
                            nextRoundIndex = params.nextRoundIndex;
                            if (nextRoundIndex === rounds) {
                                playerState.stageIndex = 0;
                                playerState.stage = config_1.Stage.Survey;
                            }
                            else {
                                playerState.roundIndex = nextRoundIndex;
                                playerState.stageIndex = config_1.MainStageIndex.Choose;
                            }
                            return [3 /*break*/, 13];
                        }
                        _c.label = 12;
                    case 12:
                        {
                            playerState.surveyAnswers = params.surveys;
                            playerState.stage = config_1.Stage.End;
                            return [3 /*break*/, 13];
                        }
                        _c.label = 13;
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        switch (type) {
                            case config_1.MoveType.startTest: {
                                Object.values(playerStates).forEach(function (playerState) {
                                    if (playerState.stage === config_1.Stage.Seat && playerState.seatNumber) {
                                        playerState.stage = config_1.Stage.Test;
                                    }
                                });
                                break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.getPlayersInGroup = function (groupIndex) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, playersInGroup;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        playersInGroup = Object.values(playerStates).filter(function (ps) { return ps.groupIndex === groupIndex; });
                        return [2 /*return*/, playersInGroup];
                }
            });
        });
    };
    Controller.prototype.genExportData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, playerStates, _a, rounds, gameType, participationFee, s, groups, choiceTerms, resultData, playersByGroup;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _c.sent();
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 2:
                        playerStates = _c.sent();
                        _a = this.game.params, rounds = _a.rounds, gameType = _a.gameType, participationFee = _a.participationFee, s = _a.s;
                        groups = gameState.groups;
                        choiceTerms = (_b = {},
                            _b[config_1.Choice.One] = 1,
                            _b[config_1.Choice.Two] = 2,
                            _b[config_1.Choice.Wait] = 0,
                            _b);
                        resultData = [['组', '座位号', '手机号', '最终收益', '轮次', '第一阶段选择', '第二阶段选择(结果1)', '第二阶段选择(结果2)', '最终选择', '第一阶段有人选1', '组内最低选择', '该轮积分', '专业', '年龄', '年级', '家庭住址', '性别']];
                        playersByGroup = Object.values(playerStates).sort(function (a, b) { return a.groupIndex - b.groupIndex; });
                        if (!groups) {
                            groups = this._rebuildGroups(playersByGroup, this.game.params);
                        }
                        playersByGroup.forEach(function (ps) {
                            var curGroup = groups[ps.groupIndex];
                            var curRound = 0;
                            while (curRound < rounds) {
                                var row = curRound === 0 ? [ps.groupIndex + 1, ps.seatNumber || '-', ps.mobile || '-', participationFee + (ps.finalProfit * s || 0), curRound + 1] : ['', '', '', '', curRound + 1];
                                var curChoice = ps.choices[curRound];
                                if (curChoice) {
                                    row.push(choiceTerms[curChoice.c1], curChoice.c1 === config_1.Choice.Wait ? choiceTerms[curChoice.c2[0]] : 0, curChoice.c1 === config_1.Choice.Wait ? choiceTerms[curChoice.c2[1]] : 0);
                                    if (curGroup.mins[curRound]) {
                                        row.push(curChoice.c ? curChoice.c : curChoice.c1, gameType === config_1.GameType.T2 ? (curGroup.ones[curRound] ? 1 : 0) : '-', curGroup.mins[curRound], ps.profits[curRound]);
                                        if (ps.surveyAnswers.length && curRound === 0) {
                                            row.push.apply(row, __spread(_this._formatSurveyAnswers(ps.surveyAnswers)));
                                        }
                                    }
                                }
                                resultData.push(row);
                                curRound++;
                            }
                        });
                        return [2 /*return*/, resultData];
                }
            });
        });
    };
    Controller.prototype._rebuildGroups = function (playerStates, _a) {
        var _this = this;
        var rounds = _a.rounds, p = _a.p, playersPerGroup = _a.playersPerGroup, gameType = _a.gameType, version = _a.version;
        var groups = [];
        var playerArrayByGroup = [];
        playerStates.forEach(function (ps) {
            var groupIndex = ps.groupIndex;
            if (!playerArrayByGroup[groupIndex]) {
                playerArrayByGroup[groupIndex] = [];
            }
            playerArrayByGroup[groupIndex].push(ps);
            if (!groups[groupIndex]) {
                groups[groupIndex] = {
                    playerNum: playersPerGroup,
                    mins: [],
                    ones: [],
                    probs: new Array(rounds).fill('').map(function () { return _this._isP(p); })
                };
            }
        });
        groups.forEach(function (group, groupIndex) {
            var playersInGroup = playerArrayByGroup[groupIndex];
            var roundIndex = 0;
            while (roundIndex >= 0) {
                if (playersInGroup.every(function (ps) { return !!ps.choices[roundIndex]; })) {
                    switch (gameType) {
                        case config_1.GameType.T1: {
                            var min = playersInGroup.some(function (ps) { return ps.choices[roundIndex].c1 === config_1.Choice.One; }) ? config_1.Choice.One : config_1.Choice.Two;
                            group.mins[roundIndex] = min;
                            break;
                        }
                        case config_1.GameType.T2: {
                            var choseOne = playersInGroup.some(function (ps) { return ps.choices[roundIndex].c1 === config_1.Choice.One; });
                            if (version === config_1.Version.V3) {
                                choseOne = choseOne && group.probs[roundIndex];
                            }
                            group.ones[roundIndex] = choseOne;
                            var min = playersInGroup.some(function (ps) { return ps.choices[roundIndex].c === config_1.Choice.One; }) ? config_1.Choice.One : config_1.Choice.Two;
                            group.mins[roundIndex] = min;
                            break;
                        }
                    }
                    roundIndex++;
                }
                else {
                    roundIndex = -1;
                }
            }
        });
        return groups;
    };
    Controller.prototype._isP = function (p) {
        var random = Math.floor(Math.random() * 10) / 10;
        return random < p;
    };
    Controller.prototype._formatSurveyAnswers = function (surveyAnswers) {
        return surveyAnswers.map(function (ans, i) {
            if ([0, 2, 4].includes(i)) {
                return '' + (config_1.Survey[i].options.indexOf(ans) + 1);
            }
            else {
                return ans;
            }
        });
    };
    Controller.prototype.onGameOver = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameState, resultData, _a, participationFee, s, playerStates;
            var _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _c.sent();
                        return [4 /*yield*/, this.genExportData()];
                    case 2:
                        resultData = _c.sent();
                        Object.assign(gameState, {
                            sheets: (_b = {},
                                _b[config_1.SheetType.result] = {
                                    data: resultData
                                },
                                _b)
                        });
                        _a = this.game.params, participationFee = _a.participationFee, s = _a.s;
                        return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 3:
                        playerStates = _c.sent();
                        Object.keys(playerStates).forEach(function (token) {
                            var ps = playerStates[token];
                            var point = participationFee + (ps.finalProfit * s || 0);
                            _this.setPhaseResult(token, { point: point, uniKey: ps.seatNumber || '-' });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
