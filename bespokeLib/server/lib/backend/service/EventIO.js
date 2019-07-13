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
var share_1 = require("@bespoke/share");
var util_1 = require("@elf/util");
var net_1 = require("net");
var fs_1 = require("fs");
var SocketIO = require("socket.io");
var GameDAO_1 = require("./GameDAO");
var util_2 = require("../util");
var events_1 = require("events");
var model_1 = require("../model");
var setting_1 = require("@elf/setting");
var EventIO = /** @class */ (function () {
    function EventIO() {
    }
    EventIO.emitEvent = function (nspId, event) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        if (!(nspId && event && args.length)) {
            return;
        }
        var socketNsp = this.socketIOServer.to(nspId), unixSocketNsp = this.robotIOServer.to(nspId);
        socketNsp && socketNsp.emit.apply(socketNsp, __spread([event], args));
        unixSocketNsp && unixSocketNsp.emit.apply(unixSocketNsp, __spread([event], args));
    };
    EventIO.initSocketIOServer = function (server, subscribeOnConnection) {
        var _this = this;
        this.socketIOServer = SocketIO(server, { path: share_1.config.socketPath(util_2.Setting.namespace) });
        this.socketIOServer.on(share_1.SocketEvent.connection, function (connection) { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, token, gameId, _c, _d, userId, linkerActor, sessionID, game, actor, user, _e, id, mobile, name_1, role;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = connection.handshake, _b = _a.query, token = _b.token, gameId = _b.gameId, _c = _a.session, _d = _c.passport, userId = (_d === void 0 ? { user: undefined } : _d).user, linkerActor = _c.actor, sessionID = _a.sessionID;
                        return [4 /*yield*/, GameDAO_1.GameDAO.getGame(gameId)];
                    case 1:
                        game = _f.sent();
                        actor = util_1.Token.checkToken(token) ?
                            game.owner === userId ? { type: share_1.Actor.clientRobot, token: token } : { type: share_1.Actor.player, token: token } :
                            game.owner === userId ? { type: share_1.Actor.owner, token: util_1.Token.geneToken(userId) } :
                                setting_1.elfSetting.bespokeWithLinker ? linkerActor :
                                    { type: share_1.Actor.player, token: util_1.Token.geneToken(userId || sessionID) };
                        user = null;
                        if (!userId) return [3 /*break*/, 3];
                        return [4 /*yield*/, model_1.UserModel.findById(userId)];
                    case 2:
                        _e = _f.sent(), id = _e.id, mobile = _e.mobile, name_1 = _e.name, role = _e.role;
                        user = { id: id, mobile: mobile, name: name_1, role: role };
                        _f.label = 3;
                    case 3:
                        subscribeOnConnection(Object.assign(connection, { actor: actor, game: game, user: user }));
                        connection.emit(share_1.SocketEvent.connection, actor);
                        return [2 /*return*/];
                }
            });
        }); });
        return this.socketIOServer;
    };
    EventIO.initRobotIOServer = function (subscribeOnConnection) {
        var _this = this;
        var socketPath = util_1.getSocketPath(util_2.Setting.namespace);
        if (fs_1.existsSync(socketPath)) {
            fs_1.unlinkSync(socketPath);
        }
        this.robotIOServer = new RobotIO.Server();
        net_1.createServer(function (socket) {
            var ipcConnection = new util_1.IpcConnection(socket);
            ipcConnection
                .on(util_1.IpcEvent.asDaemon, function () {
                util_1.Log.i('Robot daemon connection initialized');
                _this.robotIOServer.daemonConnection = ipcConnection;
            })
                .on(share_1.SocketEvent.connection, function (_a, cb) {
                var actor = _a.actor, game = _a.game;
                return __awaiter(_this, void 0, void 0, function () {
                    var socketConnection;
                    return __generator(this, function (_b) {
                        util_1.Log.i("RobotConnect : " + actor.token);
                        socketConnection = new RobotIO.Connection(actor, game, socket);
                        subscribeOnConnection(socketConnection);
                        this.robotIOServer.initNamespace(socketConnection);
                        cb();
                        return [2 /*return*/];
                    });
                });
            });
        }).listen(socketPath);
    };
    EventIO.startRobot = function (actor, game, meta) {
        if (!this.robotIOServer.daemonConnection) {
            util_1.Log.w('Robot daemon connection not initialized yet');
        }
        this.robotIOServer.daemonConnection.emit(util_1.IpcEvent.startRobot, { actor: actor, game: game }, meta);
    };
    return EventIO;
}());
exports.EventIO = EventIO;
var RobotIO;
(function (RobotIO) {
    var Server = /** @class */ (function () {
        function Server() {
            this.namespaces = {};
        }
        Server.prototype.getNamespace = function (nsp) {
            if (!this.namespaces[nsp]) {
                this.namespaces[nsp] = new Namespace();
            }
            return this.namespaces[nsp];
        };
        Server.prototype.initNamespace = function (connection) {
            this.namespaces[connection.id] = new Namespace();
            connection.robotIOServer = this;
            connection.join(connection.id);
        };
        Server.prototype.to = function (clientId) {
            return this.namespaces[clientId];
        };
        return Server;
    }());
    RobotIO.Server = Server;
    var Namespace = /** @class */ (function (_super) {
        __extends(Namespace, _super);
        function Namespace() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.connections = {};
            return _this;
        }
        Namespace.prototype.addConnection = function (connection) {
            this.connections[connection.id] = connection;
            return this;
        };
        Namespace.prototype.emit = function (event) {
            var _a;
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var success = true;
            for (var id in this.connections) {
                if (!(_a = this.connections[id]).emit.apply(_a, __spread([event], args))) {
                    success = false;
                }
            }
            return success;
        };
        return Namespace;
    }(events_1.EventEmitter));
    var Connection = /** @class */ (function (_super) {
        __extends(Connection, _super);
        function Connection(actor, game, socket) {
            var _this = _super.call(this, socket) || this;
            _this.actor = actor;
            _this.game = game;
            _this.id = actor.token;
            return _this;
        }
        Connection.prototype.join = function (nsp) {
            return this.robotIOServer.getNamespace(nsp).addConnection(this);
        };
        return Connection;
    }(util_1.IpcConnection));
    RobotIO.Connection = Connection;
})(RobotIO || (RobotIO = {}));
//# sourceMappingURL=EventIO.js.map