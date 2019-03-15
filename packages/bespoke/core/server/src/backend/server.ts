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
import {Log, redisClient, setting, initSetting, QCloudSMS} from './util'
import {baseEnum, config, ISetting} from 'bespoke-common'
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
        connectMongo(setting.mongoUri, {
            ...setting.mongoUser ? {user: setting.mongoUser, pass: setting.mongoPass} : {},
            useNewUrlParser: true,
            useCreateIndex: true
        }, err => err ? Log.e(err) : null)
    }

    private static initExpress(): Express.Express {
        const {namespace} = setting
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
            secret: setting.sessionSecret,
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
        express.use(`/${config.rootName}/${namespace}/static`, Express.static(setting.staticPath, {maxAge: '10d'}))
        express.use(`/${config.rootName}/static`, Express.static(path.join(__dirname, '../../dist/'), {maxAge: '10d'}))
        express.use(`/${config.rootName}/${namespace}`, namespaceRouter)
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

    private static bindServerListener(server: http.Server, port: number, cb: () => void) {
        server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                Log.e(error)
            }
            const bind = `${typeof port !== 'number' ? 'Pipe' : 'Port'} ${port}`
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges')
                    process.exit(1)
                    break
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use')
                    process.exit(1)
                    break
                default:
                    Log.e(error)
            }
        })
            .on('listening', () => {
                const {port} = server.address() as AddressInfo
                Log.i(`Listening on port ${port}`)
                cb()
            })
    }

    static start(gameSetting: ISetting, logicTemplate: ILogicTemplate): Express.Express {
        initSetting(gameSetting)
        this.initMongo()
        this.initPassPort()
        QCloudSMS.init()
        GameLogic.init(logicTemplate)
        const {port} = setting,
            express = this.initExpress()
        this.bindServerListener(EventDispatcher.startGameSocket(express.listen(port)), port, () => {
            Log.i(`CreateGame：http://127.0.0.1:${port}/${config.rootName}/${setting.namespace}/create`)
            if (!gameSetting.withProxy) {
                return
            }
            if (setting.withLinker) {
                serveRPC()
            }
            const heartBeat2Proxy = () => {
                const {namespace, rpcPort} = setting
                getProxyService().registerGame({namespace, port: port.toString(), rpcPort: rpcPort.toString()},
                    err => err ? Log.w(`注册至代理失败，${config.gameRegisterInterval}秒后重试`) : null)
                setTimeout(() => heartBeat2Proxy(), config.gameRegisterInterval)
            }
            setTimeout(() => heartBeat2Proxy(), .5 * config.gameRegisterInterval)
        })
        return express
    }
}
