import * as Express from 'express';
import {csrf} from 'lusca';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import {connect as connectMongo} from 'mongoose';
import * as connectRedis from 'connect-redis';
import * as expressSession from 'express-session';
import * as socketIOSession from 'express-socket.io-session';
import * as morgan from 'morgan';
import {config} from 'linker-share';
import {elfSetting} from '@elf/setting';
import {Log, NetWork} from '@elf/util';
import {csrfCookieKey} from '@elf/share';
import * as passport from 'passport';
import {redisClient} from '@elf/protocol';
import requestRouter from './controller/requestRouter';
import {serve as serveRPC} from './rpc';
import {EventDispatcher} from './controller/eventDispatcher';
import {UserDoc, UserModel} from './model';

class Server {
    private static sessionMiddleware

    static start() {
        this.initSessionMiddleware()
        this.initMongo()
        this.initPassPort()
        const express = this.initExpress()
        const server = express.listen(elfSetting.linkerPort)
            .on('listening', () => {
                Log.i(`Running at：http://${NetWork.getIp()}:${elfSetting.linkerPort}/${config.rootName}`)
            })
        EventDispatcher.startSocketService(server)
            .use(socketIOSession(this.sessionMiddleware))
        serveRPC()
    }

    private static initMongo() {
        connectMongo(elfSetting.mongoUri, {
            ...elfSetting.mongoUser ? {user: elfSetting.mongoUser, pass: elfSetting.mongoPass} : {},
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        }, err => err ? Log.e(err) : null)
    }

    private static initSessionMiddleware() {
        const RedisStore = connectRedis(expressSession)
        this.sessionMiddleware = expressSession({
            name: elfSetting.sessionName,
            resave: true,
            saveUninitialized: true,
            secret: elfSetting.sessionSecret,
            store: new RedisStore({
                ttl: 60 * 60 * 24 * 7,
                client: redisClient as any
            }),
            cookie: {
                path: '/',
                domain: elfSetting.inProductEnv ? 'ancademy.org' : '',
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        })
    }

    private static initExpress(): Express.Express {
        const express = Express()
        express.use(morgan('dev'))
        express.use(bodyParser.json())
        express.use(bodyParser.urlencoded({extended: true, limit: '30mb', parameterLimit: 30000}))
        express.use(`/${config.rootName}/static`, Express.static(
            path.join(__dirname, '../dist/'),
            {maxAge: '10d'}
        ))

        express.use(this.sessionMiddleware)
        express.use(csrf({cookie: csrfCookieKey}))
        express.use(passport.initialize())
        express.use(passport.session())
        express.use((req, res, next) => {
            res.locals.user = req.user
            next()
        })
        express.use(`/${config.rootName}`, requestRouter)
        return express
    }

    private static initPassPort() {
        passport.serializeUser<UserDoc, string>(function (user, done) {
            done(null, user.id)
        })
        passport.deserializeUser<UserDoc, string>(function (id, done) {
            UserModel.findById(id, function (err, user) {
                done(err, user)
            })
        })
    }
}

Server.start()

