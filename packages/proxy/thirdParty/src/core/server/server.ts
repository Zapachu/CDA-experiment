import setting from './config/settings'
import {connect as connectMongo} from 'mongoose'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as connectRedis from 'connect-redis'
import * as expressSession from 'express-session'
import * as Express from 'express'
import * as morgan from 'morgan'
import {redisClient} from './util'
import * as path from 'path'
import * as passport from 'passport'
import {UserModel} from '@core/server/models'

export class Server {

    private static initMongo() {
        connectMongo(setting.mongoUri, {
            ...setting.mongoUser ? {user: setting.mongoUser, pass: setting.mongoPass} : {},
            useNewUrlParser: true,
            useCreateIndex: true
        }, err => err ? console.error(err) : null)
    }

    private static initPassport() {
        passport.serializeUser(function (user: { id: string }, done) {
            done(null, user.id)
        })

        passport.deserializeUser(function (id, done) {
            UserModel.findById(id, function (err, user) {
                done(err, user)
            })
        })
    }

    private static initExpress(routePrefix: string): Express.Express {
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
        express.use(passport.initialize())
        express.use(passport.session())
        express.use((req, res, next) => {
            res.locals.user = req.user
            next()
        })
        express.use(`/${routePrefix}/static`, Express.static(
            path.join(__dirname, '../../../dist'),
            {maxAge: '10d'}
        ))
        return express
    }

    static start(port: number, routePrefix: string): Express.Express {
        this.initMongo()
        this.initPassport()
        const express = this.initExpress(routePrefix)
        express.listen(port, err => console.log(err ? err : `listening on ${port}`))
        return express
    }
}