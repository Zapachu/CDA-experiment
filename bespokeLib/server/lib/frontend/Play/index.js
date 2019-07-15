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
var share_1 = require("@bespoke/share");
var style = require("./style.scss");
var component_1 = require("@elf/component");
var util_1 = require("../util");
var socket_io_client_1 = require("socket.io-client");
var deep_diff_1 = require("deep-diff");
var queryString = require("query-string");
var GameControl_1 = require("./console/GameControl");
var GameResult_1 = require("./console/GameResult");
var cloneDeep = require("lodash/cloneDeep");
var Play = /** @class */ (function (_super) {
    __extends(Play, _super);
    function Play() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.token = queryString.parse(location.search).token;
        _this.lang = component_1.Lang.extractLang({
            Mask_GamePaused: ['实验已暂停', 'Experiment Paused']
        });
        _this.state = {
            playerStates: {}
        };
        return _this;
    }
    Play.prototype.componentDidMount = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, token, _b, history, gameId, _c, code, game, socketClient;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this, token = _a.token, _b = _a.props, history = _b.history, gameId = _b.match.params.gameId;
                        return [4 /*yield*/, util_1.Api.getGame(gameId)];
                    case 1:
                        _c = _d.sent(), code = _c.code, game = _c.game;
                        if (code !== share_1.ResponseCode.success) {
                            history.push('/404');
                            return [2 /*return*/];
                        }
                        socketClient = socket_io_client_1.connect('/', {
                            path: share_1.config.socketPath(NAMESPACE),
                            query: "gameId=" + gameId + "&token=" + token
                        });
                        this.setState({
                            game: game,
                            socketClient: socketClient,
                            frameEmitter: new share_1.FrameEmitter(socketClient)
                        }, function () { return _this.registerStateReducer(); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Play.prototype.componentWillUnmount = function () {
        if (this.state.socketClient) {
            this.state.socketClient.close();
        }
    };
    Play.prototype.registerStateReducer = function () {
        var _this = this;
        var _a = this, token = _a.token, history = _a.props.history, socketClient = _a.state.socketClient;
        socketClient.on(share_1.SocketEvent.connection, function (actor) {
            if (!actor) {
                return history.push('/404');
            }
            if (token && (actor.token !== token)) {
                location.href = "" + location.origin + location.pathname;
            }
            else {
                _this.setState({ actor: actor });
            }
            socketClient.emit(share_1.SocketEvent.online);
        });
        socketClient.on(share_1.SocketEvent.syncGameState_json, function (gameState) {
            _this.setState({ gameState: gameState });
        });
        socketClient.on(share_1.SocketEvent.changeGameState_diff, function (stateChanges) {
            var gameState = cloneDeep(_this.state.gameState) || {};
            stateChanges.forEach(function (change) { return deep_diff_1.applyChange(gameState, null, change); });
            _this.setState({ gameState: gameState });
        });
        socketClient.on(share_1.SocketEvent.syncPlayerState_json, function (playerState, token) { return _this.applyPlayerState(playerState, token); });
        socketClient.on(share_1.SocketEvent.changePlayerState_diff, function (stateChanges, token) {
            var _a;
            var playerStates = _this.state.playerStates;
            var playerState = cloneDeep(token ? playerStates[token] : _this.state.playerState) || {};
            stateChanges.forEach(function (change) { return deep_diff_1.applyChange(playerState, null, change); });
            token ? _this.setState({
                playerStates: __assign({}, playerStates, (_a = {}, _a[token] = playerState, _a))
            }) : _this.setState({ playerState: playerState });
        });
    };
    Play.prototype.applyPlayerState = function (playerState, token) {
        var _a;
        var playerStates = this.state.playerStates;
        token ? this.setState({
            playerStates: __assign({}, playerStates, (_a = {}, _a[token] = playerState, _a))
        }) : this.setState({ playerState: playerState });
    };
    Play.prototype.render = function () {
        var _a = this, lang = _a.lang, _b = _a.props, history = _b.history, gameTemplate = _b.gameTemplate, _c = _a.state, game = _c.game, actor = _c.actor, gameState = _c.gameState, playerState = _c.playerState, playerStates = _c.playerStates, frameEmitter = _c.frameEmitter;
        if (!gameTemplate || !gameState) {
            return React.createElement(component_1.MaskLoading, null);
        }
        var Play4Owner = gameTemplate.Play4Owner, Result4Owner = gameTemplate.Result4Owner, Play = gameTemplate.Play, Result = gameTemplate.Result;
        if (!PRODUCT_ENV) {
            console.log(gameState, playerState || playerStates);
        }
        if (actor.type === share_1.Actor.owner) {
            return React.createElement("section", { className: style.play4owner },
                React.createElement(GameControl_1.GameControl, __assign({}, {
                    game: game,
                    gameState: gameState,
                    playerStates: playerStates,
                    frameEmitter: frameEmitter,
                    historyPush: function (path) { return history.push(path); }
                })),
                gameState.status === share_1.GameStatus.over ?
                    React.createElement(GameResult_1.GameResult, __assign({}, { game: game, Result4Owner: Result4Owner })) :
                    React.createElement(Play4Owner, __assign({}, {
                        game: game,
                        frameEmitter: frameEmitter,
                        gameState: gameState,
                        playerStates: playerStates
                    })));
        }
        if (!playerState) {
            return React.createElement(component_1.MaskLoading, null);
        }
        switch (gameState.status) {
            case share_1.GameStatus.paused:
                return React.createElement(component_1.MaskLoading, { label: lang.Mask_GamePaused });
            case share_1.GameStatus.started:
                return React.createElement(Play, __assign({}, { game: game, gameState: gameState, playerState: playerState, frameEmitter: frameEmitter }));
            case share_1.GameStatus.over:
                return React.createElement(Result, __assign({}, { game: game, gameState: gameState, playerState: playerState }));
        }
    };
    return Play;
}(React.Component));
exports.Play = Play;
//# sourceMappingURL=index.js.map