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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var _common_1 = require("@common");
var _client_util_1 = require("@client-util");
var socket_io_client_1 = require("socket.io-client");
var _client_context_1 = require("@client-context");
var Owner_1 = require("./Owner");
var Player_1 = require("./Player");
var queryString = require("query-string");
var _client_component_1 = require("@client-component");
var share_1 = require("@elf/share");
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
                        return [4 /*yield*/, _client_util_1.Api.getGame(gameId)];
                    case 1:
                        game = (_c.sent()).game;
                        return [4 /*yield*/, _client_util_1.Api.getActor(gameId, token)];
                    case 2:
                        actor = (_c.sent()).actor;
                        if (!actor) {
                            this.props.history.push('/join');
                        }
                        socketClient = socket_io_client_1.connect('/', {
                            path: _common_1.config.socketPath,
                            query: "gameId=" + gameId + "&userId=" + user.id + "&token=" + actor.token + "&type=" + actor.type + "&playerId=" + actor.playerId
                        });
                        this.registerStateReducer(socketClient);
                        this.setState({
                            game: game,
                            actor: actor,
                            socketClient: socketClient
                        }, function () { return socketClient.emit(_common_1.SocketEvent.upFrame, _common_1.NFrame.UpFrame.joinRoom); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Play.prototype.registerStateReducer = function (socketClient) {
        var _this = this;
        socketClient.on(_common_1.SocketEvent.downFrame, function (frame, data) {
            switch (frame) {
                case _common_1.NFrame.DownFrame.syncGameState: {
                    _this.setState({
                        gameState: data
                    });
                }
            }
        });
    };
    Play.prototype.render = function () {
        var _a = this, history = _a.props.history, _b = _a.state, game = _b.game, actor = _b.actor, socketClient = _b.socketClient, gameState = _b.gameState;
        if (!gameState) {
            return React.createElement(_client_component_1.Loading, null);
        }
        return React.createElement(_client_context_1.playContext.Provider, { value: { gameState: gameState, socketClient: socketClient, game: game, actor: actor } }, actor.type === share_1.Actor.owner ?
            React.createElement(Owner_1.Play4Owner, { history: history }) :
            React.createElement(Player_1.Play4Player, null));
    };
    Play = __decorate([
        _client_util_1.connCtx(_client_context_1.rootContext)
    ], Play);
    return Play;
}(React.Component));
exports.Play = Play;
//# sourceMappingURL=index.js.map