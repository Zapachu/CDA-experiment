'use strict'

import * as path from 'path'
import {connect as connectMongo} from 'mongoose'
import * as connectRedis from 'connect-redis'
import {csrf} from 'lusca'
import * as Express from 'express'
import * as expressSession from 'express-session'
import * as passport from 'passport'
import * as errorHandler from 'errorhandler'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as morgan from 'morgan'
import {elfSetting} from 'elf-setting'
import {Log, redisClient, Setting, QCloudSMS} from './util'
import {baseEnum, config, IGameSetting} from 'bespoke-common'
import {EventDispatcher} from './controller/eventDispatcher'
import {rootRouter, namespaceRouter} from './controller/requestRouter'
import {GameLogic, ILogicTemplate} from './service/GameLogic'
import {serve as serveRPC, getProxyService} from './rpc'
import {AddressInfo} from 'net'
import {UserDoc, UserModel} from './model'
import {Strategy} from 'passport-local'
import * as http from 'http'

export class Server {
    private static initMongo() {
        connectMongo(elfSetting.mongoUri, {
            ...elfSetting.mongoUser ? {user: elfSetting.mongoUser, pass: elfSetting.mongoPass} : {},
            useNewUrlParser: true,
            useCreateIndex: true
        }, err => err ? Log.e(err) : null)
    }

    private static initExpress(): Express.Express {
        const express = Express()
        express.use(compression())
        express.use(morgan('dev'))
        express.use(bodyParser.json())
        express.use(bodyParser.urlencoded({extended: true, limit: '30mb', parameterLimit: 30000}))
        const RedisStore = connectRedis(expressSession)
        express.use(expressSession({
            name: 'academy.sid',
            resave: true,
            saveUninitialized: true,
            secret: elfSetting.sessionSecret,
            store: new RedisStore({
                client: redisClient as any
            })
        }))
        express.use((req, res, next) => csrf({cookie: config.cookieKey.csrf})(req, res, next))
        express.use(passport.initialize())
        express.use(passport.session())
        express.use((req, res, next) => {
            res.locals.user = req.user
            next()
        })
        express.use(errorHandler())
        express.use(`/${config.rootName}/${elfSetting.bespokeNamespace}/static`, Express.static(Setting.staticPath, {maxAge: '10d'}))
        express.use(`/${config.rootName}/static`, Express.static(path.join(__dirname, '../../dist/'), {maxAge: '10d'}))
        express.use(`/${config.rootName}/${elfSetting.bespokeNamespace}`, namespaceRouter)
        express.use(`/${config.rootName}`, rootRouter)
        return express
    }

    private static initPassPort() {
        passport.serializeUser<UserDoc, string>(function (user, done) {
            done(null, user.id)
        })
        passport.deserializeUser<UserDoc, string>(function (id, done) {
            UserModel.findById(id, (err, user) => {
                done(err, user)
            })
        })

        passport.use(baseEnum.PassportStrategy.local, new Strategy({
            usernameField: 'mobile',
            passwordField: 'mobile'
        }, function (mobile, password, done) {
            const result = true
            if (result) {
                UserModel.findOne({mobile}).then(user => {
                    done(null, user)
                })
            } else {
                done(null, false)
            }
        }))
    }

    private static bindServerListener(server: http.Server, cb: () => void) {
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                Log.e(error)
            }
            switch (error.code) {
                case 'EACCES':
                    console.error('Port requires elevated privileges')
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    console.error('Port is already in use')
                    process.exit(1)
                    break
                default:
                    Log.e(error)
            }
        })
            .on('listening', () => {
                const {port} = server.address() as AddressInfo
                Setting.setPort(port)
                cb()
            })
    }

    static start(gameSetting: IGameSetting, logicTemplate: ILogicTemplate): Express.Express {
        Setting.init(gameSetting)
        this.initMongo()
        this.initPassPort()
        QCloudSMS.init()
        GameLogic.init(logicTemplate)
        const express = this.initExpress(),
            server = express.listen(Setting.port)
        EventDispatcher.startGameSocket(server)
        this.bindServerListener(server, () => {
            Log.i(`CreateGame：http://localhost:${elfSetting.bespokeHmr ? config.devPort.client : Setting.port}/${config.rootName}/${elfSetting.bespokeNamespace}/create`)
            if (!elfSetting.bespokeWithProxy) {
                return
            }
            if (elfSetting.bespokeWithLinker) {
                serveRPC()
            }
            const heartBeat2Proxy = () => {
                getProxyService().registerGame({
                        namespace: elfSetting.bespokeNamespace,
                        port: Setting.port.toString(),
                        rpcPort: Setting.rpcPort.toString()
                    },
                    err => err ? Log.w(`注册至代理失败，${config.gameRegisterInterval}秒后重试`) : null)
                setTimeout(() => heartBeat2Proxy(), config.gameRegisterInterval)
            }
            setTimeout(() => heartBeat2Proxy(), .5 * config.gameRegisterInterval)
        })
        return express
    }
}
