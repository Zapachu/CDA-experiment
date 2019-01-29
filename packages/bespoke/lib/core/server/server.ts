'use strict'

import * as path from 'path'
import {connect as connectMongo} from 'mongoose'
import * as connectRedis from 'connect-redis'
// import {csrf} from 'lusca'
import * as Express from 'express'
import * as expressSession from 'express-session'
import * as passport from 'passport'
import * as errorHandler from 'errorhandler'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as morgan from 'morgan'

const {compilerOptions: {paths}} = require(path.join(__dirname, '../../../tsconfig.json'))
import {register as registerTsConfigPath} from 'tsconfig-paths'

registerTsConfigPath({
    baseUrl: path.resolve(__dirname, '../../'),
    paths
})

import {Log, redisClient, WebpackHmr, setting, TServerOption} from '@server-util'
import {baseEnum, config} from '@common'
import {EventDispatcher} from './controller/eventDispatcher'
import {rootRouter, namespaceRouter} from './controller/requestRouter'
import {GameLogic, ILogicTemplate} from './manager/logicManager'
import {serve as serveRPC, proxyService} from './rpc'
import {AddressInfo} from 'net'
import {UserDoc, UserModel} from '@server-model'
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
        WebpackHmr.applyHotDevMiddleware(express)
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
// express.use((req, res, next) => csrf({cookie: config.cookieKey.csrf})(req, res, next))
        express.use(passport.initialize())
        express.use(passport.session())
        express.use((req, res, next) => {
            res.locals.user = req.user
            next()
        })
        express.use(errorHandler())
        express.use(`/${config.rootName}/static`, Express.static(path.join(__dirname, '../../../dist/'), {maxAge: '10d'}))
        express.use(`/${config.rootName}/${namespace}/static`, Express.static(path.join(__dirname, `../../../dist/${namespace}/`), {maxAge: '10d'}))
        express.use(`/${config.rootName}`, rootRouter.use(`/${namespace}`, namespaceRouter))
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

    static start(namespace: string, logicTemplate: ILogicTemplate, serverOption: TServerOption = {}): Express.Express {
        Object.assign(setting, serverOption, {namespace})
        this.initMongo()
        this.initPassPort()
        GameLogic.initInstance(logicTemplate)
        const {host, port} = setting,
            express = this.initExpress()
        this.bindServerListener(EventDispatcher.startGameSocket(express.listen(port)), port, () => {
            const registerReq = {namespace, host, port: port.toString()}
            const heartBeat2Proxy = () => {
                proxyService.registerGame(registerReq,
                    err => err ? Log.w(`注册至代理失败，${config.gameRegisterInterval}秒后重试`) : null)
                setTimeout(() => heartBeat2Proxy(), config.gameRegisterInterval)
            }
            heartBeat2Proxy()
        })
        if (!config.deployIndependently) {
            serveRPC()
        }
        return express
    }
}