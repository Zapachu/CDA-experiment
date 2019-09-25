import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import session from 'express-session';
import mongoose from 'mongoose';
import connectRedis from 'connect-redis';
import errorHandler from 'errorhandler';
import {csrf} from 'lusca';
import path from 'path';
import http from 'http';
import morgan from 'morgan';
import socket from 'socket.io';
import passport from 'passport';
import socketRedis from 'socket.io-redis';
import socketSession from 'express-socket.io-session';
import socketPassport from 'passport.socketio';
import cookieParser from 'cookie-parser';
import router from './router';
import {SocketHandler} from './controller';
import {elfSetting} from '@elf/setting';
import {Config} from './config';
import {csrfCookieKey, ResCode} from '@micro-experiment/share';
import {AddressInfo} from 'net';
import {Log, NetWork} from '@elf/util';
import {redisClient} from './redis';
import {User, UserDoc} from './models';
import {runRPC} from './rpc';

const RedisStore = connectRedis(session);

mongoose.connect(
    elfSetting.mongoUri,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        ...elfSetting.mongoUser ? {
            user: elfSetting.mongoUser,
            pass: elfSetting.mongoPass,
        } : null
    }
);
mongoose.connection.on('error', () => {
    console.error(
        'MongoDB Connection Error. Please make sure MongoDB is running.'
    );
});
const app = express();
const sessionStore = new RedisStore({
    client: redisClient as any,
    ttl: 60 * 24 * 60 * 30
});
app.use(compression());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
        limit: '30mb',
        parameterLimit: 30000
    })
);
const sessionMiddleWare = session({
    name: elfSetting.sessionName,
    resave: true,
    saveUninitialized: true,
    secret: elfSetting.sessionSecret,
    store: sessionStore,
    cookie: {
        path: '/',
        domain: process.env.NODE_ENV !== 'production' ? null : Config.domain, // TODO
        maxAge: 1000 * 60 * 24 * 7 // 24 hours
    }
});
app.use(sessionMiddleWare);
passport.serializeUser(function (user: UserDoc, done) {
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({cookie: csrfCookieKey}));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
app.use(Config.rootName + '/static', express.static(path.resolve(__dirname, '../dist'), {maxAge: '10d'}));
app.use(Config.rootName || '/', router);
app.use(errorHandler({
    log: (err, str, req, res) => {
        Log.d(err);
        res.json({
            code: ResCode.unexpectError,
            msg: err.message
        });
    }
}));

const port = process.env.PORT || '3020';
app.set('port', port);

const server = http.createServer(app);

const io = socket(server);
io.adapter(socketRedis({host: elfSetting.redisHost, port: elfSetting.redisPort}));
io.use(socketSession(sessionMiddleWare, {autoSave: true}));
io.use(socketPassport.authorize({
    cookieParser: cookieParser,
    key: elfSetting.sessionName,
    secret: elfSetting.sessionSecret,
    store: sessionStore
}));
SocketHandler.init(io);
server.listen(port)
    .on('error', (error: NodeJS.ErrnoException) => {
        if (error.syscall !== 'listen') {
            Log.e(error);
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
                Log.e(error);
        }
    })
    .on('listening', () => {
        const addr = server.address() as AddressInfo,
            bind = typeof addr === 'string' ? `pipe:${addr}` : `http://${NetWork.getIp()}:${addr.port}`;
        console.log(`Running at：${bind}`);
    });
runRPC();


