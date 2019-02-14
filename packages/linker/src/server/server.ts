import * as Express from 'express'
import {csrf} from 'lusca'
import * as path from 'path'
import {createServer} from 'http'
import * as bodyParser from 'body-parser'
import {connect as connectMongo} from 'mongoose'
import * as connectRedis from 'connect-redis'
import * as expressSession from 'express-session'
import * as morgan from 'morgan'

const {compilerOptions: {paths}} = require(path.join(__dirname, '../../../tsconfig.json'))
import {register as registerTsConfigPath} from 'tsconfig-paths'

registerTsConfigPath({
    baseUrl: path.resolve(__dirname, '../../'),
    paths
})

import {config} from '@common'
import settings from './config/settings'
import {redisClient, usePassport} from '@server-util'
import requestRouter from './controller/requestRouter'
import {serve as serveRPC} from './rpc'
import {EventDispatcher} from './controller/eventDispatcher'
import {WebpackHmr} from './util/WebpackHmr'

connectMongo(settings.mongoUri, {
    ...settings.mongoUser ? {user: settings.mongoUser, pass: settings.mongoPass} : {},
    useNewUrlParser: true
}).then(
    ({connection}) => connection.on('error', () => {
        console.error('MongoDB Connection Error. Please make sure MongoDB is running.')
    })
)

const express = Express()
WebpackHmr.applyHotDevMiddleware(express)
express.set('views', path.join(__dirname, './view'))
express.set('view engine', 'pug')
express.use(morgan('dev'))
express.use(bodyParser.json())
express.use(bodyParser.urlencoded({extended: true, limit: '30mb', parameterLimit: 30000}))
express.use(`/${config.rootName}/static`, Express.static(
    path.join(__dirname, '../../../dist/'),
    {maxAge: '10d'}
))
const RedisStore = connectRedis(expressSession)
express.use(expressSession({
    name: "academy.sid",
    resave: true,
    saveUninitialized: true,
    secret: settings.sessionSecret,
    store: new RedisStore({
        client: redisClient as any
    })
}))
express.use(csrf(
    {
        cookie: config.cookieKey.csrf
    }
))
usePassport(express)
express.use(`/${config.rootName}`, requestRouter)
express.set('port', settings.port)

const server = createServer(express)
    .listen(settings.port)
    .on('listening', () => {
        console.info(`Listening on ${settings.port}`)
    })
EventDispatcher.startGroupSocket(server)
serveRPC()


