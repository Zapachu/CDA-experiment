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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("@bespoke/server");
var config_1 = require("./config");
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    function Controller() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // initGameState(): TGameState<IGameState> {
    //   const gameState = super.initGameState();
    //   return gameState;
    // }
    Controller.prototype.initPlayerState = function (actor) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, _super.prototype.initPlayerState.call(this, actor)];
                    case 1:
                        playerState = _d.sent();
                        playerState.profit = (_a = {},
                            _a[config_1.DATE.jul5] = 0,
                            _a[config_1.DATE.aug4] = 0,
                            _a[config_1.DATE.oct13] = 0,
                            _a[config_1.DATE.nov12] = 0,
                            _a);
                        playerState.profit14 = (_b = {},
                            _b[config_1.DATE.jul5] = 0,
                            _b[config_1.DATE.aug4] = 0,
                            _b[config_1.DATE.oct13] = 0,
                            _b[config_1.DATE.nov12] = 0,
                            _b);
                        playerState.profit56 = (_c = {},
                            _c[config_1.DATE.jul5] = 0,
                            _c[config_1.DATE.aug4] = 0,
                            _c[config_1.DATE.oct13] = 0,
                            _c[config_1.DATE.nov12] = 0,
                            _c);
                        playerState.answer = {};
                        return [2 /*return*/, playerState];
                }
            });
        });
    };
    Controller.prototype.teacherMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, gameState, playerStateArray, card1, card2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        return [4 /*yield*/, this.stateManager.getGameState()];
                    case 2:
                        gameState = _a.sent();
                        switch (type) {
                            case config_1.MoveType.dealCard: {
                                if (gameState.card1 !== undefined) {
                                    return [2 /*return*/];
                                }
                                playerStateArray = Object.values(playerStates);
                                if (playerStateArray.length < 2) {
                                    return [2 /*return*/, cb("被试数量不足")];
                                }
                                if (!playerStateArray.every(function (ps) { return !!ps.random56; })) {
                                    return [2 /*return*/, cb("还有被试未完成问卷")];
                                }
                                card1 = params.card1, card2 = params.card2;
                                gameState.card1 = card1;
                                gameState.card2 = card2;
                                this.processProfit(card1, card2, playerStates);
                                break;
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.playerMoveReducer = function (actor, type, params, cb) {
        return __awaiter(this, void 0, void 0, function () {
            var playerState, answer, decision, gender, age, institute, name_1, grade, randomKey, decision14, decision56, rand14, rand56;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerState(actor)];
                    case 1:
                        playerState = _a.sent();
                        // gameState = await this.stateManager.getGameState(),
                        // playerStates = await this.stateManager.getPlayerStates();
                        switch (type) {
                            case config_1.MoveType.shout: {
                                answer = params.answer, decision = params.decision;
                                if (!Array.isArray(answer) || !answer.length || !decision) {
                                    return [2 /*return*/, cb("请选择一项再提交")];
                                }
                                if (playerState.answer.hasOwnProperty(decision)) {
                                    return [2 /*return*/];
                                }
                                playerState.answer[decision] = answer;
                                break;
                            }
                            case config_1.MoveType.info: {
                                gender = params.gender, age = params.age, institute = params.institute, name_1 = params.name, grade = params.grade;
                                if (playerState.info) {
                                    return [2 /*return*/];
                                }
                                playerState.info = {
                                    gender: gender,
                                    age: age,
                                    institute: institute,
                                    name: name_1,
                                    grade: grade
                                };
                                break;
                            }
                            case config_1.MoveType.random: {
                                randomKey = params.randomKey;
                                if (playerState[randomKey]) {
                                    return [2 /*return*/];
                                }
                                decision14 = [
                                    config_1.DECISION.one,
                                    config_1.DECISION.two,
                                    config_1.DECISION.three,
                                    config_1.DECISION.four
                                ];
                                decision56 = [config_1.DECISION.five, config_1.DECISION.six];
                                switch (randomKey) {
                                    case "profitDecision14": {
                                        rand14 = genRandomInt(0, decision14.length - 1);
                                        playerState[randomKey] = decision14[rand14];
                                        break;
                                    }
                                    case "random56": {
                                        rand56 = genRandomInt(0, decision56.length - 1);
                                        playerState[randomKey] = decision56[rand56];
                                        break;
                                    }
                                    case "random100": {
                                        playerState[randomKey] = genRandomInt(1, 100);
                                        break;
                                    }
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
            var gameState, resultData;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getGameState()];
                    case 1:
                        gameState = _b.sent();
                        return [4 /*yield*/, this.genExportData()];
                    case 2:
                        resultData = _b.sent();
                        Object.assign(gameState, {
                            sheets: (_a = {},
                                _a[config_1.SheetType.result] = {
                                    data: resultData
                                },
                                _a)
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Controller.prototype.processProfit = function (card1, card2, playerStates) {
        var _this = this;
        var playerStateArray = Object.values(playerStates);
        this._makePairs(playerStateArray);
        this._chooseDecisions(playerStates);
        this._calcProfits(card1, card2, playerStates);
        playerStateArray.forEach(function (ps) {
            _this.setPhaseResult(ps.actor.token, {
                point: ps.profit[config_1.DATE.jul5],
                uniKey: ps.mobile
                    ? "\u624B\u673A\u53F7" + ps.mobile + "\u7684\u6536\u76CA: " + _this.getProfitString(ps.profit)
                    : "-"
            });
        });
    };
    Controller.prototype.getProfitString = function (profit) {
        var str = "";
        if (profit[config_1.DATE.jul5]) {
            str += config_1.DATE.jul5 + "\u53D1\u653E" + profit[config_1.DATE.jul5] + " ";
        }
        if (profit[config_1.DATE.aug4]) {
            str += config_1.DATE.aug4 + "\u53D1\u653E" + profit[config_1.DATE.aug4] + " ";
        }
        if (profit[config_1.DATE.oct13]) {
            str += config_1.DATE.oct13 + "\u53D1\u653E" + profit[config_1.DATE.oct13] + " ";
        }
        if (profit[config_1.DATE.nov12]) {
            str += config_1.DATE.nov12 + "\u53D1\u653E" + profit[config_1.DATE.nov12] + " ";
        }
        str = str ? str : "没有收益";
        return str;
    };
    Controller.prototype.genExportData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var playerStates, resultData, playerStateArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateManager.getPlayerStates()];
                    case 1:
                        playerStates = _a.sent();
                        resultData = [
                            [
                                "手机号",
                                "决策1",
                                "决策2",
                                "决策3",
                                "决策4",
                                "决策5",
                                "决策6",
                                "配对手机号",
                                "1-4抽中的决策",
                                "5-6抽中的决策",
                                config_1.DATE.jul5 + "\u6536\u76CA",
                                config_1.DATE.aug4 + "\u6536\u76CA",
                                config_1.DATE.oct13 + "\u6536\u76CA",
                                config_1.DATE.nov12 + "\u6536\u76CA",
                                "性别",
                                "年龄",
                                "姓名",
                                "专业",
                                "年级"
                            ]
                        ];
                        playerStateArray = Object.values(playerStates);
                        playerStateArray.forEach(function (ps) {
                            var row = [
                                ps.mobile || "-",
                                ps.answer[config_1.DECISION.one]
                                    ? config_1.PAGE[config_1.DECISION.one].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.one][0]; }).label + "; " + ps.answer[config_1.DECISION.one][1]
                                    : "",
                                ps.answer[config_1.DECISION.two]
                                    ? config_1.PAGE[config_1.DECISION.two].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.two][0]; }).label + "; " + ps.answer[config_1.DECISION.two][1]
                                    : "",
                                ps.answer[config_1.DECISION.three]
                                    ? config_1.PAGE[config_1.DECISION.three].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.three][0]; }).label
                                    : "",
                                ps.answer[config_1.DECISION.four]
                                    ? config_1.PAGE[config_1.DECISION.four].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.four][0]; }).label
                                    : "",
                                ps.answer[config_1.DECISION.five]
                                    ? config_1.PAGE[config_1.DECISION.five].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.five][0]; }).label
                                    : "",
                                ps.answer[config_1.DECISION.six]
                                    ? config_1.PAGE[config_1.DECISION.six].questions[0].options.find(function (option) { return option.value === ps.answer[config_1.DECISION.six][0]; }).label
                                    : "",
                                ps.pair ? playerStates[ps.pair].mobile : "-",
                                ps.profitDecision14 || "-",
                                ps.won56 ? ps.profitDecision56 : "\u5BF9\u65B9" + ps.profitDecision56,
                                ps.profit[config_1.DATE.jul5],
                                ps.profit[config_1.DATE.aug4],
                                ps.profit[config_1.DATE.oct13],
                                ps.profit[config_1.DATE.nov12],
                                ps.info ? ps.info.gender : "-",
                                ps.info ? ps.info.age : "-",
                                ps.info ? ps.info.name : "-",
                                ps.info ? ps.info.institute : "-",
                                ps.info ? ps.info.grade : "-"
                            ];
                            resultData.push(row);
                        });
                        return [2 /*return*/, resultData];
                }
            });
        });
    };
    Controller.prototype._makePairs = function (playerStates) {
        var unpairedPlayers = __spread(playerStates);
        while (unpairedPlayers.length) {
            var player1 = unpairedPlayers.shift();
            if (!unpairedPlayers.length) {
                var player2 = playerStates[0];
                player1.pair = player2.actor.token;
                player2.extraPair = player1.actor.token;
            }
            else {
                var player2 = unpairedPlayers.shift();
                player1.pair = player2.actor.token;
                player2.pair = player1.actor.token;
            }
        }
    };
    Controller.prototype._chooseDecisions = function (playerStates) {
        var decision14 = [
            config_1.DECISION.one,
            config_1.DECISION.two,
            config_1.DECISION.three,
            config_1.DECISION.four
        ];
        var decision56 = [config_1.DECISION.five, config_1.DECISION.six];
        var playerStateArray = Object.values(playerStates);
        playerStateArray.forEach(function (ps) {
            if (!ps.profitDecision14) {
                // 兼容旧数据
                var rand14 = genRandomInt(0, decision14.length - 1);
                ps.profitDecision14 = decision14[rand14];
            }
            if (ps.random100) {
                var pair = playerStates[ps.pair];
                if (ps.random100 === pair.random100) {
                    ps.won56 = pair.won56 !== undefined ? !pair.won56 : true;
                }
                else {
                    ps.won56 = ps.random100 - pair.random100 > 0;
                }
                ps.profitDecision56 = ps.won56 ? ps.random56 : pair.random56;
            }
            else {
                // 兼容旧数据
                var luckyOne = void 0;
                var isMe = genRandomInt(0, 1);
                luckyOne = isMe ? ps : playerStates[ps.pair];
                var rand56 = genRandomInt(0, decision56.length - 1);
                luckyOne.profitDecision56 = rand56;
            }
        });
    };
    Controller.prototype._calcProfits = function (card1, card2, playerStates) {
        var _this = this;
        var playerStateArray = Object.values(playerStates);
        playerStateArray.forEach(function (ps) {
            var decision14 = ps.profitDecision14;
            var answer14 = ps.answer[decision14];
            var calc14 = CALC_PROFIT[decision14];
            var profit14 = calc14(answer14, card1, card2);
            _this._addProfit(ps.profit14, profit14);
            _this._addProfit(ps.profit, profit14);
            var decision56 = ps.profitDecision56;
            var calc56 = CALC_PROFIT[decision56];
            if (ps.won56) {
                var profit56 = calc56(ps.answer[decision56]);
                _this._addProfit(ps.profit56, profit56[0]);
                _this._addProfit(ps.profit, profit56[0]);
            }
            else {
                var pair = playerStates[ps.pair];
                var profit56 = calc56(pair.answer[decision56]);
                _this._addProfit(ps.profit56, profit56[1]);
                _this._addProfit(ps.profit, profit56[1]);
            }
        });
    };
    Controller.prototype._addProfit = function (profit, increment) {
        if (increment[config_1.DATE.jul5]) {
            profit[config_1.DATE.jul5] += increment[config_1.DATE.jul5];
        }
        if (increment[config_1.DATE.aug4]) {
            profit[config_1.DATE.aug4] += increment[config_1.DATE.aug4];
        }
        if (increment[config_1.DATE.oct13]) {
            profit[config_1.DATE.oct13] += increment[config_1.DATE.oct13];
        }
        if (increment[config_1.DATE.nov12]) {
            profit[config_1.DATE.nov12] += increment[config_1.DATE.nov12];
        }
    };
    return Controller;
}(server_1.BaseController));
exports.default = Controller;
var CALC_PROFIT = (_a = {},
    _a[config_1.DECISION.one] = function (answer, card1) {
        var _a;
        var start = 20;
        var invest = +answer[0].split(":")[0];
        var chosenCard = answer[1];
        var profit;
        if (chosenCard === card1) {
            profit = start - invest + invest * 2.5;
        }
        else {
            profit = start - invest;
        }
        return _a = {}, _a[config_1.DATE.jul5] = profit, _a;
    },
    _a[config_1.DECISION.two] = function (answer, card1, card2) {
        var _a;
        var start = 20;
        var invest = +answer[0].split(":")[0];
        var chosenCard = answer[1];
        var profit;
        if (chosenCard === card2) {
            profit = start - invest + invest * 2.5;
        }
        else {
            profit = start - invest;
        }
        return _a = {}, _a[config_1.DATE.jul5] = profit, _a;
    },
    _a[config_1.DECISION.three] = function (answer) {
        var _a;
        var profits = answer[0].split(":");
        return _a = {}, _a[config_1.DATE.jul5] = +profits[0], _a[config_1.DATE.aug4] = +profits[1], _a;
    },
    _a[config_1.DECISION.four] = function (answer) {
        var _a;
        var profits = answer[0].split(":");
        return _a = {}, _a[config_1.DATE.oct13] = +profits[0], _a[config_1.DATE.nov12] = +profits[1], _a;
    },
    _a[config_1.DECISION.five] = function (answer) {
        var _a, _b;
        var profits = answer[0].split(":");
        return [(_a = {}, _a[config_1.DATE.jul5] = +profits[0], _a), (_b = {}, _b[config_1.DATE.jul5] = +profits[1], _b)];
    },
    _a[config_1.DECISION.six] = function (answer) {
        var _a, _b;
        var profits = answer[0].split(":");
        return [(_a = {}, _a[config_1.DATE.jul5] = +profits[0], _a), (_b = {}, _b[config_1.DATE.jul5] = +profits[1], _b)];
    },
    _a);
function genRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
