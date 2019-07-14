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
var linker_share_1 = require("linker-share");
var setting_1 = require("@elf/setting");
var util_1 = require("@elf/util");
var share_1 = require("@elf/share");
var passport = require("passport");
var protocol_1 = require("@elf/protocol");
var requestRouter_1 = require("./controller/requestRouter");
var rpc_1 = require("./rpc");
var eventDispatcher_1 = require("./controller/eventDispatcher");
var model_1 = require("./model");
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.start = function () {
        this.initSessionMiddleware();
        this.initMongo();
        this.initPassPort();
        var express = this.initExpress();
        var server = express.listen(setting_1.elfSetting.linkerPort)
            .on('listening', function () {
            util_1.Log.i("Running at\uFF1Ahttp://" + util_1.NetWork.getIp() + ":" + setting_1.elfSetting.linkerPort + "/" + linker_share_1.config.rootName);
        });
        eventDispatcher_1.EventDispatcher.startSocketService(server)
            .use(socketIOSession(this.sessionMiddleware));
        rpc_1.serve();
    };
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
                client: protocol_1.redisClient
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
        express.use("/" + linker_share_1.config.rootName + "/static", Express.static(path.join(__dirname, '../../static/'), { maxAge: '10d' }));
        express.use(this.sessionMiddleware);
        express.use(lusca_1.csrf({ cookie: share_1.csrfCookieKey }));
        express.use(passport.initialize());
        express.use(passport.session());
        express.use(function (req, res, next) {
            res.locals.user = req.user;
            next();
        });
        express.use("/" + linker_share_1.config.rootName, requestRouter_1.default);
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
    };
    return Server;
}());
Server.start();
//# sourceMappingURL=server.js.map