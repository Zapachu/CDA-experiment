"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Express = require("express");
var lusca_1 = require("lusca");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose_1 = require("mongoose");
var connectRedis = require("connect-redis");
var expressSession = require("express-session");
var socketIOSession = require("express-socket.io-session");
var morgan = require("morgan");
var paths = require(path.join(__dirname, '../../tsconfig.json')).compilerOptions.paths;
var tsconfig_paths_1 = require("tsconfig-paths");
tsconfig_paths_1.register({
    baseUrl: path.resolve(__dirname, '../'),
    paths: paths
});
var _common_1 = require("@common");
var setting_1 = require("@elf/setting");
var util_1 = require("@elf/util");
var passport = require("passport");
var _server_util_1 = require("@server-util");
var requestRouter_1 = require("./controller/requestRouter");
var rpc_1 = require("./rpc");
var eventDispatcher_1 = require("./controller/eventDispatcher");
var _server_model_1 = require("@server-model");
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.initMongo = function () {
        mongoose_1.connect(setting_1.elfSetting.mongoUri, __assign({}, setting_1.elfSetting.mongoUser ? { user: setting_1.elfSetting.mongoUser, pass: setting_1.elfSetting.mongoPass } : {}, { useNewUrlParser: true, useCreateIndex: true }), function (err) { return err ? util_1.Log.e(err) : null; });
    };
    Server.initSessionMiddleware = function () {
        var RedisStore = connectRedis(expressSession);
        this.sessionMiddleware = expressSession({
            name: setting_1.elfSetting.sessionName,
            resave: true,
            saveUninitialized: true,
            secret: setting_1.elfSetting.sessionSecret,
            store: new RedisStore({
                ttl: 60 * 60 * 24 * 7,
                client: _server_util_1.redisClient
            }),
            cookie: {
                path: '/',
                domain: setting_1.elfSetting.inProductEnv ? 'ancademy.org' : '',
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        });
    };
    Server.initExpress = function () {
        var express = Express();
        express.use(morgan('dev'));
        express.use(bodyParser.json());
        express.use(bodyParser.urlencoded({ extended: true, limit: '30mb', parameterLimit: 30000 }));
        express.use("/" + _common_1.config.rootName + "/static", Express.static(path.join(__dirname, '../../static/'), { maxAge: '10d' }));
        express.use(this.sessionMiddleware);
        var csrfWhitelist = ["/" + _common_1.config.rootName + "/" + _common_1.config.apiPrefix + "/game/phaseTemplates"];
        express.use(function (req, res, next) {
            if (csrfWhitelist.includes(req.path)) {
                return next();
            }
            lusca_1.csrf({
                cookie: _common_1.config.cookieKey.csrf
            })(req, res, next);
        });
        express.use(passport.initialize());
        express.use(passport.session());
        express.use(function (req, res, next) {
            res.locals.user = req.user;
            next();
        });
        express.use("/" + _common_1.config.rootName, requestRouter_1.default);
        return express;
    };
    Server.initPassPort = function () {
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
        passport.deserializeUser(function (id, done) {
            _server_model_1.UserModel.findById(id, function (err, user) {
                done(err, user);
            });
        });
    };
    Server.start = function () {
        this.initSessionMiddleware();
        this.initMongo();
        this.initPassPort();
        var express = this.initExpress();
        var server = express.listen(setting_1.elfSetting.linkerPort)
            .on('listening', function () {
            util_1.Log.i("Running at\uFF1Ahttp://" + util_1.NetWork.getIp() + ":" + setting_1.elfSetting.linkerPort + "/" + _common_1.config.rootName);
        });
        eventDispatcher_1.EventDispatcher.startSocketService(server)
            .use(socketIOSession(this.sessionMiddleware));
        rpc_1.serve();
    };
    return Server;
}());
Server.start();
//# sourceMappingURL=server.js.map