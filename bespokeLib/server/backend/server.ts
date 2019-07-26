'use strict'

import * as path from 'path'
import {connect as connectMongo} from 'mongoose'
import * as connectRedis from 'connect-redis'
import {csrf} from 'lusca'
import * as Express from 'express'
import * as expressSession from 'express-session'
import * as socketIOSession from 'express-socket.io-session'
import * as passport from 'passport'
import * as errorHandler from 'errorhandler'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as morgan from 'morgan'
import {elfSetting} from '@elf/setting'
import {gameId2PlayUrl, getOrigin, heartBeat, QCloudSMS, RedisKey, Setting} from './util'
import {PassportStrategy} from './interface'
import {AcademusRole, config, csrfCookieKey, IGameConfig, IStartOption} from '@bespoke/share'
import {EventDispatcher} from './controller/eventDispatcher'
import {router} from './controller/requestRouter'
import {AnyLogic, BaseLogic, GameDAO} from './service'
import {AddressInfo} from 'net'
import {GameModel, UserDoc, UserModel} from './model'
import {Strategy} from 'passport-local'
import * as http from 'http'
import {Linker, RedisCall, redisClient} from '@elf/protocol'
import {Log} from '@elf/util'

export class Server {
    private static sessionMiddleware

    static start(namespace: string, Logic: new(...args) => AnyLogic, staticPath: string, bespokeRouter: Express.Router = Express.Router(), startOption: IStartOption = {}) {
        Setting.init(namespace, staticPath, startOption)
        this.initSessionMiddleware()
        this.initMongo()
        this.initPassPort()
        QCloudSMS.init()
        BaseLogic.init(Logic, startOption.syncStrategy)
        const express = this.initExpress(bespokeRouter),
            server = express.listen(Setting.port)
        EventDispatcher.startGameSocket(server).use(socketIOSession(this.sessionMiddleware))
        this.bindServerListener(server, () => {
            Log.i(`Running at：http://${Setting.ip}:${elfSetting.bespokeHmr ? config.devPort.client : Setting.port}/${config.rootName}/${Setting.namespace}`)
            heartBeat(RedisKey.gameServer(Setting.namespace), () => `${Setting.ip}:${Setting.port}`)
            if (elfSetting.bespokeWithLinker) {
                this.withLinker()
            }
        })
    }

    static async newGame<ICreateParams>(gameConfig: IGameConfig<ICreateParams>): Promise<string> {
        const [mobile] = elfSetting.adminMobileNumbers
        if (!mobile) {
            Log.e('未配置管理员账号，无法创建实验')
        }
        let owner: UserDoc = await UserModel.findOne({mobile})
        if (!owner) {
            owner = await UserModel.create({
                role: AcademusRole.teacher,
                mobile: mobile
            })
        }
        return await GameDAO.newGame(owner.id, gameConfig)
    }

    private static initMongo() {
        connectMongo(elfSetting.mongoUri, {
            ...elfSetting.mongoUser ? {user: elfSetting.mongoUser, pass: elfSetting.mongoPass} : {},
            useNewUrlParser: true,
            useCreateIndex: true
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

    private static initExpress(bespokeRouter: Express.Router): Express.Express {
        const express = Express()
        express.use(compression())
        express.use(morgan('dev'))
        express.use(bodyParser.json())
        express.use(bodyParser.urlencoded({extended: true, limit: '30mb', parameterLimit: 30000}))
        express.use(this.sessionMiddleware)
        express.use((req, res, next) => csrf({cookie: csrfCookieKey})(req, res, next))
        express.use(passport.initialize())
        express.use(passport.session())
        express.use((req, res, next) => {
            res.locals.user = req.user
            next()
        })
        express.use(errorHandler())
        express.use(`/${config.rootName}/${Setting.namespace}/static`, Express.static(Setting.staticPath, {maxAge: '10d'}))
        express.use(`/${config.rootName}/${Setting.namespace}/static`, Express.static(path.join(__dirname, '../static/'), {maxAge: '10d'}))
        express.use(`/${config.rootName}/${Setting.namespace}`, bespokeRouter)
        express.use(`/${config.rootName}/${Setting.namespace}`, router)
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

        passport.use(PassportStrategy.local, new Strategy({
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

    private static withLinker() {
        RedisCall.handle<Linker.Create.IReq, Linker.Create.IRes>(Linker.Create.name(Setting.namespace), async ({elfGameId, owner, params}) => {
            const {id} = await GameModel.create({
                namespace: Setting.namespace,
                title: Linker.Create.name(Setting.namespace),
                elfGameId,
                owner,
                params
            })
            return {playUrl: gameId2PlayUrl(id)}
        })
        heartBeat(Linker.HeartBeat.key(Setting.namespace), () => {
            const regInfo: Linker.HeartBeat.IHeartBeat = {
                namespace: Setting.namespace,
                jsUrl: `${getOrigin()}${Setting.getClientPath()}`
            }
            return JSON.stringify(regInfo)
        })
    }
}