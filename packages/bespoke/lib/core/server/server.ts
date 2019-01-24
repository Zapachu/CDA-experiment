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

import {Log, redisClient, WebpackHmr, setting} from '@server-util'
import {config} from '@common'
import {EventDispatcher} from './controller/eventDispatcher'
import requestRouter from './controller/requestRouter'
import {serve as serveRPC} from './rpc'
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

export function startServer(port: number = 0): Express.Express {
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
            const address = server.address()
            Log.i(`Listening on ${typeof address === 'string' ? `pipe ${address}` : `port ${(<AddressInfo>address).port}`}`)
        })
    EventDispatcher.startGameSocket(server)
    if (!config.deployIndependently) {
        serveRPC()
    }
    return express
}