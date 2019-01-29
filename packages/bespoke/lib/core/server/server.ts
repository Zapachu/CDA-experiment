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

const {compilerOptions: {paths}} = require(path.join(__dirname, '../../../tsconfig.json'))
import {register as registerTsConfigPath} from 'tsconfig-paths'

registerTsConfigPath({
    baseUrl: path.resolve(__dirname, '../../'),
    paths
})

import {Log, redisClient, WebpackHmr, setting, TServerOption} from '@server-util'
import {config} from '@common'
import {EventDispatcher} from './controller/eventDispatcher'
import requestRouter from './controller/requestRouter'
import {GameLogic, ILogicTemplate} from './manager/logicManager'
import {serve as serveRPC, proxyService} from './rpc'
import {AddressInfo} from 'net'

const RedisStore = connectRedis(expressSession)

require('./util/passport')

connectMongo(setting.mongoUri, {
    ...setting.mongoUser ? {user: setting.mongoUser, pass: setting.mongoPass} : {},
    useNewUrlParser: true,
    useCreateIndex: true
}, err => err ? Log.e(err) : null)

const express = Express()
WebpackHmr.applyHotDevMiddleware(express)
express.use(compression())
express.use(morgan('dev'))
express.use(bodyParser.json())
express.use(bodyParser.urlencoded({extended: true, limit: '30mb', parameterLimit: 30000}))
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
express.use(`/${config.rootName}/static`, Express.static(path.join(__dirname, '../../../dist/'), {maxAge: '10d'}))
express.use(`/${config.rootName}`, requestRouter)

export function startServer(namespace: string, logicTemplate: ILogicTemplate, serverOption: TServerOption = {}): Express.Express {
    Object.assign(setting, serverOption, {namespace})
    GameLogic.initInstance(logicTemplate)
    const {host, port} = setting
    const server = express.listen(port)
        .on('error', (error: NodeJS.ErrnoException) => {
            if (error.syscall !== 'listen') {
                throw error
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
                    throw error
            }
        })
        .on('listening', () => {
            const {port} = server.address() as AddressInfo
            Log.i(`Listening on port ${port}`)
            const registerReq = {namespace, host, port: port.toString()}
            const heartBeat2Proxy = () => {
                proxyService.registerGame(registerReq,
                    err => err ? Log.w(`注册至代理失败，${config.gameRegisterInterval}秒后重试`) : null)
                setTimeout(() => heartBeat2Proxy(), config.gameRegisterInterval)
            }
            if (!config.deployIndependently) {
                serveRPC()
                heartBeat2Proxy()
            }
        })
    EventDispatcher.startGameSocket(server)
    return express
}