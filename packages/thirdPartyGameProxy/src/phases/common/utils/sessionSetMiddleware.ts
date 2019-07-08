
'use strict'

import * as expressSession from "express-session"
import {elfSetting} from '@elf/setting'

const redis = require('redis')
const RedisStore = require('connect-redis')(expressSession)
const redisClient = redis.createClient(elfSetting.redisPort, elfSetting.redisHost)

const SessionSet = {
    name: elfSetting.sessionName,
    resave: true,
    saveUninitialized: true,
    secret: elfSetting.sessionSecret,
    store: new RedisStore({
        client: redisClient,
        ttl: 60 * 60 * 24 * 7,
        auto_reconnect: true
    }),
    cookie: {
        path: '/',
        domain: 'ancademy.org',
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

const SessionSetMiddleware = (app) => {
    app.use(expressSession(SessionSet))
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
        next();
    })
}

export {
    SessionSetMiddleware
}
