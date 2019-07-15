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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var linker_share_1 = require("linker-share");
var util_1 = require("../util");
var component_1 = require("@elf/component");
var socket_io_client_1 = require("socket.io-client");
var queryString = require("query-string");
var component_2 = require("../component");
var style = require("./style.scss");
var antd_1 = require("antd");
var Play = /** @class */ (function (_super) {
    __extends(Play, _super);
    function Play() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = {};
        return _this;
    }
    Play.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, gameId, search, user, _b, token, game, actor, socketClient;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this.props, gameId = _a.match.params.gameId, search = _a.location.search, user = _a.user, _b = queryString.parse(search).token, token = _b === void 0 ? '' : _b;
                        return [4 /*yield*/, util_1.Api.getGame(gameId)];
                    case 1:
                        game = (_c.sent()).game;
                        return [4 /*yield*/, util_1.Api.getActor(gameId, token)];
                    case 2:
                        actor = (_c.sent()).actor;
                        if (!actor) {
                            this.props.history.push('/join');
                        }
                        document.title = game.title;
                        socketClient = socket_io_client_1.connect('/', {
                            path: linker_share_1.config.socketPath,
                            query: "gameId=" + gameId + "&userId=" + user.id + "&token=" + actor.token + "&type=" + actor.type + "&playerId=" + actor.playerId
                        });
                        this.registerStateReducer(socketClient);
                        this.setState({
                            game: game,
                            actor: actor,
                            socketClient: socketClient
                        }, function () { return socketClient.emit(linker_share_1.SocketEvent.joinRoom); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Play.prototype.registerStateReducer = function (socketClient) {
        var _this = this;
        socketClient.on(linker_share_1.SocketEvent.syncGameState, function (gameState) {
            _this.setState({ gameState: gameState });
        });
    };
    Play.prototype.render = function () {
        var _a = this, user = _a.props.user, _b = _a.state, game = _b.game, actor = _b.actor, gameState = _b.gameState;
        if (!gameState) {
            return React.createElement(component_2.Loading, null);
        }
        if (actor.type === linker_share_1.Actor.owner) {
            return React.createElement(Play4Owner, __assign({}, { gameState: gameState, game: game, user: user }));
        }
        return React.createElement("iframe", { className: style.playIframe, src: gameState.playUrl + "?" + component_1.Lang.key + "=" + component_1.Lang.activeLanguage });
    };
    return Play;
}(React.Component));
exports.Play = Play;
var Play4Owner = /** @class */ (function (_super) {
    __extends(Play4Owner, _super);
    function Play4Owner() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.lang = component_1.Lang.extractLang({
            share: ['分享', 'Share'],
            playerList: ['玩家列表', 'PlayerList'],
            console: ['控制台', 'Console'],
            playerStatus: ['玩家状态', 'Player Status'],
            point: ['得分', 'Point'],
            uniKey: ['唯一标识', 'UniKey'],
            detail: ['详情', 'Detail'],
            reward: ['奖励', 'Reward']
        });
        return _this;
    }
    Play4Owner.prototype.render = function () {
        var _a = this, _b = _a.props, user = _b.user, game = _b.game, gameState = _b.gameState, lang = _a.lang;
        return React.createElement("section", null,
            React.createElement(antd_1.Affix, { style: { position: 'absolute', right: 32, top: 64, zIndex: 1000 } },
                React.createElement(antd_1.Dropdown, { overlay: React.createElement(antd_1.Menu, null,
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(antd_1.Button, { onClick: function () { return util_1.toV5(linker_share_1.config.academus.route.member(user.orgCode, game.id)); } }, lang.playerList)),
                        React.createElement(antd_1.Menu.Item, null,
                            React.createElement(antd_1.Button, { onClick: function () { return util_1.toV5(linker_share_1.config.academus.route.share(game.id)); } }, lang.share))) },
                    React.createElement(antd_1.Button, { type: 'primary', shape: "circle", icon: "bars" }))),
            React.createElement("iframe", { className: style.playIframe, src: gameState.playUrl + "?" + component_1.Lang.key + "=" + component_1.Lang.activeLanguage }));
    };
    return Play4Owner;
}(React.Component));
//# sourceMappingURL=index.js.map