'use strict';
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
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var mongoose_1 = require("mongoose");
var connectRedis = require("connect-redis");
var lusca_1 = require("lusca");
var Express = require("express");
var expressSession = require("express-session");
var socketIOSession = require("express-socket.io-session");
var passport = require("passport");
var errorHandler = require("errorhandler");
var bodyParser = require("body-parser");
var compression = require("compression");
var morgan = require("morgan");
var setting_1 = require("@elf/setting");
var util_1 = require("./util");
var interface_1 = require("./interface");
var share_1 = require("@bespoke/share");
var eventDispatcher_1 = require("./controller/eventDispatcher");
var requestRouter_1 = require("./controller/requestRouter");
var service_1 = require("./service");
var model_1 = require("./model");
var passport_local_1 = require("passport-local");
var protocol_1 = require("@elf/protocol");
var util_2 = require("@elf/util");
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.initMongo = function () {
        mongoose_1.connect(setting_1.elfSetting.mongoUri, __assign({}, setting_1.elfSetting.mongoUser ? { user: setting_1.elfSetting.mongoUser, pass: setting_1.elfSetting.mongoPass } : {}, { useNewUrlParser: true, useCreateIndex: true }), function (err) { return err ? util_2.Log.e(err) : null; });
    };
    Server.initSessionMiddleware = function () {
        var RedisStore = connectRedis(expressSession);
        this.sessionMiddleware = expressSession({
            name: 'academy.sid',
            resave: true,
            saveUninitialized: true,
            secret: setting_1.elfSetting.sessionSecret,
            store: new RedisStore({
                ttl: 60 * 60 * 24 * 7,
                client: protocol_1.redisClient
            }),
            cookie: {
                path: '/',
                domain: setting_1.elfSetting.inProductEnv ? 'ancademy.org' : '',
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        });
    };
    Server.initExpress = function (bespokeRouter) {
        var express = Express();
        express.use(compression());
        express.use(morgan('dev'));
        express.use(bodyParser.json());
        express.use(bodyParser.urlencoded({ extended: true, limit: '30mb', parameterLimit: 30000 }));
        express.use(this.sessionMiddleware);
        express.use(function (req, res, next) { return lusca_1.csrf({ cookie: share_1.config.cookieKey.csrf })(req, res, next); });
        express.use(passport.initialize());
        express.use(passport.session());
        express.use(function (req, res, next) {
            res.locals.user = req.user;
            next();
        });
        express.use(errorHandler());
        express.use("/" + share_1.config.rootName + "/" + util_1.Setting.namespace + "/static", Express.static(util_1.Setting.staticPath, { maxAge: '10d' }));
        express.use("/" + share_1.config.rootName + "/" + util_1.Setting.namespace + "/static", Express.static(path.join(__dirname, '../../static/'), { maxAge: '10d' }));
        express.use("/" + share_1.config.rootName + "/" + util_1.Setting.namespace, bespokeRouter);
        express.use("/" + share_1.config.rootName + "/" + util_1.Setting.namespace, requestRouter_1.router);
        return express;
    };
    Server.initPassPort = function () {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
        passport.deserializeUser(function (id, done) {
            model_1.UserModel.findById(id, function (err, user) {
                done(err, user);
            });
        });
        passport.use(interface_1.PassportStrategy.local, new passport_local_1.Strategy({
            usernameField: 'mobile',
            passwordField: 'mobile'
        }, function (mobile, password, done) {
            var result = true;
            if (result) {
                model_1.UserModel.findOne({ mobile: mobile }).then(function (user) {
                    done(null, user);
                });
            }
            else {
                done(null, false);
            }
        }));
    };
    Server.bindServerListener = function (server, cb) {
        server.on('error', function (error) {
            if (error.syscall !== 'listen') {
                util_2.Log.e(error);
            }
            switch (error.code) {
                case 'EACCES':
                    console.error('Port requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error('Port is already in use');
                    process.exit(1);
                    break;
                default:
                    util_2.Log.e(error);
            }
        })
            .on('listening', function () {
            var port = server.address().port;
            util_1.Setting.setPort(port);
            cb();
        });
    };
    Server.withLinker = function () {
        var _this = this;
        protocol_1.RedisCall.handle(protocol_1.NewPhase.name(util_1.Setting.namespace), function (_a) {
            var elfGameId = _a.elfGameId, owner = _a.owner, namespace = _a.namespace, param = _a.param;
            return __awaiter(_this, void 0, void 0, function () {
                var id;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, model_1.GameModel.create({
                                title: '',
                                desc: '',
                                owner: owner,
                                elfGameId: elfGameId,
                                namespace: namespace,
                                params: JSON.parse(param)
                            })];
                        case 1:
                            id = (_b.sent()).id;
                            return [2 /*return*/, { playUrl: util_1.gameId2PlayUrl(id) }];
                    }
                });
            });
        });
        var elfComponentPath = require('../../static/index.json')['ElfComponent.js'].replace('static', util_1.Setting.namespace + "/static");
        var regInfo = {
            namespace: util_1.Setting.namespace,
            jsUrl: "" + util_1.getOrigin() + elfComponentPath + ";" + util_1.getOrigin() + util_1.Setting.getClientPath()
        };
        util_1.heartBeat(protocol_1.PhaseReg.key(util_1.Setting.namespace), JSON.stringify(regInfo));
    };
    Server.start = function (namespace, Logic, staticPath, bespokeRouter, startOption) {
        var _this = this;
        if (bespokeRouter === void 0) { bespokeRouter = Express.Router(); }
        if (startOption === void 0) { startOption = {}; }
        util_1.Setting.init(namespace, staticPath, startOption);
        this.initSessionMiddleware();
        this.initMongo();
        this.initPassPort();
        util_1.QCloudSMS.init();
        service_1.BaseLogic.init(Logic, startOption.syncStrategy);
        var express = this.initExpress(bespokeRouter), server = express.listen(util_1.Setting.port);
        eventDispatcher_1.EventDispatcher.startGameSocket(server).use(socketIOSession(this.sessionMiddleware));
        this.bindServerListener(server, function () {
            util_2.Log.i("Running at\uFF1Ahttp://" + util_1.Setting.ip + ":" + (setting_1.elfSetting.bespokeHmr ? share_1.config.devPort.client : util_1.Setting.port) + "/" + share_1.config.rootName + "/" + util_1.Setting.namespace);
            util_1.heartBeat(util_1.RedisKey.gameServer(util_1.Setting.namespace), util_1.Setting.ip + ":" + util_1.Setting.port);
            if (setting_1.elfSetting.bespokeWithLinker) {
                _this.withLinker();
            }
        });
    };
    Server.newGame = function (gameConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mobile, owner;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = __read(setting_1.elfSetting.adminMobileNumbers, 1), mobile = _a[0];
                        if (!mobile) {
                            util_2.Log.e('未配置管理员账号，无法创建实验');
                        }
                        return [4 /*yield*/, model_1.UserModel.findOne({ mobile: mobile })];
                    case 1:
                        owner = _b.sent();
                        if (!!owner) return [3 /*break*/, 3];
                        return [4 /*yield*/, model_1.UserModel.create({
                                role: share_1.baseEnum.AcademusRole.teacher,
                                mobile: mobile
                            })];
                    case 2:
                        owner = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, service_1.GameDAO.newGame(owner.id, gameConfig)];
                    case 4: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map