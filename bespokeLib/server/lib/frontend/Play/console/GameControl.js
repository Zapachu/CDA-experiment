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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var React = require("react");
var style = require("./style.scss");
var share_1 = require("@bespoke/share");
var component_1 = require("@elf/component");
var util_1 = require("../../util");
var started = share_1.GameStatus.started, paused = share_1.GameStatus.paused, over = share_1.GameStatus.over;
var GameControl = /** @class */ (function (_super) {
    __extends(GameControl, _super);
    function GameControl() {
        var _a;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lang = component_1.Lang.extractLang({
            gameStatus: ['实验状态', 'Game Status'],
            notStarted: ['未开始', 'Not Started'],
            started: ['进行中', 'Playing'],
            paused: ['已暂停', 'Paused'],
            over: ['已关闭', 'Closed'],
            start: ['开始', 'START'],
            pause: ['暂停', 'PAUSE'],
            resume: ['恢复', 'RESUME'],
            stop: ['关闭', 'CLOSE'],
            onlinePlayers: ['当前在线人数', 'Online Players'],
            players: ['实验成员', 'Players']
        });
        _this.gameStatusMachine = (_a = {},
            _a[started] = [
                {
                    status: over,
                    label: _this.lang.stop,
                    color: component_1.ButtonProps.Color.red,
                    width: component_1.ButtonProps.Width.small
                },
                {
                    status: paused,
                    label: _this.lang.pause
                }
            ],
            _a[paused] = [
                {
                    status: over,
                    label: _this.lang.stop,
                    color: component_1.ButtonProps.Color.red,
                    width: component_1.ButtonProps.Width.small
                },
                {
                    status: started,
                    label: _this.lang.resume
                }
            ],
            _a);
        return _this;
    }
    GameControl.prototype.render = function () {
        var _a;
        var _b = this, lang = _b.lang, _c = _b.props, historyPush = _c.historyPush, game = _c.game, gameState = _c.gameState, playerStates = _c.playerStates, frameEmitter = _c.frameEmitter;
        if (!gameState) {
            return null;
        }
        var btnProps = {
            type: component_1.ButtonProps.Type.flat,
            color: component_1.ButtonProps.Color.blue,
            width: component_1.ButtonProps.Width.tiny
        };
        return React.createElement("section", { className: style.gameControl },
            React.createElement("div", { className: style.headBar },
                React.createElement("div", { className: style.gameStatus },
                    React.createElement("label", null, lang.gameStatus),
                    React.createElement("span", null, (_a = {},
                        _a[started] = lang.start,
                        _a[paused] = lang.paused,
                        _a[over] = lang.over,
                        _a)[gameState.status])),
                React.createElement("div", { className: style.gameTitle },
                    React.createElement("span", null, game.title)),
                React.createElement("div", { className: style.btnGroup },
                    WITH_LINKER ? null : React.createElement(component_1.Button, __assign({}, btnProps, { icon: component_1.ButtonProps.Icon.home, onClick: function () { return historyPush("/dashboard"); } })),
                    React.createElement(component_1.Button, __assign({}, btnProps, { icon: component_1.ButtonProps.Icon.parameter, onClick: function () { return historyPush("/configuration/" + game.id); } })),
                    WITH_LINKER ? null : React.createElement(component_1.Button, __assign({}, btnProps, { icon: component_1.ButtonProps.Icon.share, onClick: function () { return historyPush("/share/" + game.id); } })))),
            React.createElement("section", { className: style.players },
                React.createElement(SimulatePlayer, { gameId: game.id }),
                React.createElement("section", { className: style.onlinePlayers },
                    React.createElement("div", { className: style.onlinePlayersCount },
                        React.createElement("label", null, lang.onlinePlayers),
                        React.createElement("span", null, Object.values(playerStates).length)))),
            React.createElement("div", { className: style.statusSwitcher },
                React.createElement("div", { className: style.switcherWrapper }, (this.gameStatusMachine[gameState.status] || [])
                    .map(function (_a) {
                    var status = _a.status, label = _a.label, _b = _a.color, color = _b === void 0 ? component_1.ButtonProps.Color.blue : _b, _c = _a.width, width = _c === void 0 ? component_1.ButtonProps.Width.medium : _c;
                    return React.createElement(component_1.Button, __assign({ key: label }, {
                        type: component_1.ButtonProps.Type.primary,
                        label: label,
                        color: color,
                        width: width,
                        onClick: function () { return frameEmitter.emit(share_1.CoreMove.switchGameStatus, { status: status }); }
                    }));
                }))));
    };
    return GameControl;
}(React.Component));
exports.GameControl = GameControl;
var SimulatePlayer = /** @class */ (function (_super) {
    __extends(SimulatePlayer, _super);
    function SimulatePlayer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.NAMES = ['宋远桥', '俞莲舟', '俞岱岩', '张松溪', '张翠山', '殷梨亭', '莫声谷', '马钰', '丘处机', '谭处端', '王处一', '郝大通', '刘处玄', '孙不二'];
        _this.MAX_SIZE = 20;
        _this.state = {
            simulateNameSeq: 0,
            simulatePlayers: []
        };
        _this.lang = component_1.Lang.extractLang({
            SimulatePlayer: ['模拟玩家', 'SimulatePlayer'],
            Add: ['添加', 'ADD'],
            StartAll: ['全部启动', 'Start All']
        });
        return _this;
    }
    SimulatePlayer.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var simulatePlayers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, util_1.Api.getSimulatePlayers(this.props.gameId)];
                    case 1:
                        simulatePlayers = (_a.sent()).simulatePlayers;
                        this.setState({ simulatePlayers: simulatePlayers, simulateNameSeq: simulatePlayers.length });
                        return [2 /*return*/];
                }
            });
        });
    };
    SimulatePlayer.prototype.addSimulatePlayer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, MAX_SIZE, gameId, _b, simulatePlayers, simulateName, simulateNameSeq, name, token;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this, MAX_SIZE = _a.MAX_SIZE, gameId = _a.props.gameId, _b = _a.state, simulatePlayers = _b.simulatePlayers, simulateName = _b.simulateName, simulateNameSeq = _b.simulateNameSeq;
                        if (simulatePlayers.length >= MAX_SIZE) {
                            return [2 /*return*/];
                        }
                        name = simulateName || this.NAMES[simulateNameSeq];
                        return [4 /*yield*/, util_1.Api.newSimulatePlayer(gameId, name)];
                    case 1:
                        token = (_c.sent()).token;
                        this.setState(function (_a) {
                            var simulatePlayers = _a.simulatePlayers;
                            return ({
                                simulateName: '',
                                simulateNameSeq: (simulateNameSeq + 1) % _this.NAMES.length,
                                simulatePlayers: __spread(simulatePlayers, [{ gameId: gameId, token: token, name: name }])
                            });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    SimulatePlayer.prototype.render = function () {
        var _this = this;
        var _a = this, lang = _a.lang, _b = _a.state, simulatePlayers = _b.simulatePlayers, _c = _b.simulateName, simulateName = _c === void 0 ? '' : _c, simulateNameSeq = _b.simulateNameSeq;
        return React.createElement("section", { className: style.simulatePlayer },
            React.createElement("div", { className: style.header },
                React.createElement("label", null,
                    lang.SimulatePlayer,
                    "(",
                    simulatePlayers.length,
                    "/",
                    this.MAX_SIZE,
                    ")"),
                React.createElement("div", { className: style.addWrapper },
                    React.createElement("input", { value: simulateName, placeholder: this.NAMES[simulateNameSeq], onChange: function (_a) {
                            var simulateName = _a.target.value;
                            return _this.setState({ simulateName: simulateName });
                        } }),
                    React.createElement("span", { onClick: function () { return _this.addSimulatePlayer(); } }, lang.Add))),
            React.createElement("div", { className: style.playerNames },
                simulatePlayers.map(function (_a) {
                    var token = _a.token, name = _a.name;
                    return React.createElement("a", { key: token, href: "" + window.location.origin + window.location.pathname + "?token=" + token, target: '_blank' }, name);
                }),
                simulatePlayers.length > 3 ?
                    React.createElement("a", { className: style.startAll, onClick: function () { return simulatePlayers.forEach(function (_a) {
                            var token = _a.token;
                            return window.open("" + window.location.origin + window.location.pathname + "?token=" + token, '_blank');
                        }); } }, lang.StartAll) : null));
    };
    return SimulatePlayer;
}(React.Component));
//# sourceMappingURL=GameControl.js.map