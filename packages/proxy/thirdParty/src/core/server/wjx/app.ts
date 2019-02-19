import * as path from 'path'
import * as Express from 'express'
import * as passport from 'passport'
import * as bodyParser from 'body-parser'
import * as errorhandler from 'errorhandler'
import * as expressSession from 'express-session'
import * as httpProxy from 'http-proxy-middleware'
import { Response, Request, NextFunction } from 'express'
import { connect as mongodConnect, connection as mongodConnection } from 'mongoose'

import './passport'
import { serve as RPC } from './rpc'
import settings from '../config/settings'
import { gameService } from './rpc/service/WjxManager'
import { ThirdPartPhase } from '../models'

/**
 * Mongoose settings
 */
mongodConnect(settings.mongoUri, {
    ...settings.mongoUser ? { user: settings.mongoUser, pass: settings.mongoPass } : {},
    useNewUrlParser: true
})
mongodConnection.on('error', () => console.log('Mongodb Connection Error'))

/**
 * Redis settings
 */
const redis = require('redis')
const RedisStore = require('connect-redis')(expressSession)
const redisClient = redis.createClient(settings.redisPort, settings.redisHost)
/**
 * Redis settings end
 */

// session config
const sessionSet = {
    name: "academy.sid",
    resave: true,
    saveUninitialized: true,
    secret: settings.sessionSecret,
    store: new RedisStore({
        client: redisClient,
        auto_reconnect: true
    })
}

const app = Express()

/**
 * 静态文件
 */
app.set('views', path.join(__dirname, './view'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb', parameterLimit: 30000 }))
app.use(`/${settings.WjxRootName}/static`, Express.static(
    path.join(__dirname, '../../../../dist'),
    { maxAge: '10d' }
))

// use session
app.use(expressSession(sessionSet))
app.use(passport.initialize())
app.use(passport.session())
app.use((req: IRequest, res: Response, next: NextFunction) => {
    res.locals.user = req.user
    next()
})

const getNextPhaseUrl = async (wjxHash) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findOne({
        namespace: 'wjx',
        playHashs: { $elemMatch: { hash: wjxHash } }
    })
    console.log('log > qualtrics phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    const request = {
        groupId: wjxPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || wjxPhase.playHashs[0].player,
        playUrl: `${settings.WjxPhaseServerPrefix}/init/jq/${wjxPhase._id.toString()}`,
    }

    return await new Promise((resolve, reject) => {
        gameService.sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
            if (err) {
                console.log(err)
            }
            console.log('log > service_res', service_res)
            const nextPhaseUrl = service_res.sendBackUrl
            resolve(nextPhaseUrl)
        })
    })
}

const proxy = httpProxy({
    target: settings.WjxServerRootUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http'
})

interface IRequest extends Request {
    user: {
        _id: string
    }
}

app.use(async (req: IRequest, res: Response, next: NextFunction) => {

    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    // 用户访问问卷星
    if (req.path.indexOf('/init/jq/') !== -1 && req.method === 'GET') {
        console.log('log > Starting init.....')
        const currentUserElfGameHash = req.query.token
        console.log('log > current Elf hash ....', currentUserElfGameHash)
        const currentPhaseId = req.url.split('/jq/')[1].slice(0, 24)
        try {
            const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
            const currentPhaseParamsJson = JSON.parse(currentPhase.param)
            const currentPhaseWjxHash = currentPhaseParamsJson.wjxHash

            if (!currentPhase) {
                return res.redirect('https://ancademy.org')
            }

            console.log('log > find phase object...')
            console.log(currentPhase)

            const { playHashs } = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${settings.WjxPhaseServerPrefix}/jq/${currentPhaseWjxHash}.aspx`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({ hash: currentPhaseWjxHash, player: currentUserElfGameHash })
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${settings.WjxPhaseServerPrefix}/jq/${currentPhaseWjxHash}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    if (req.path.indexOf('complete') !== -1 && req.method === 'GET') {
        const wjxHash = req.query.q
        const nextPhaseUrl:any = getNextPhaseUrl(wjxHash)
        return res.redirect(nextPhaseUrl)
    }

    next()
})


/**
 * 部署于 二级域名 或仅使用代理  eg:   https://wjx.ancademy.org/...
 */
app.use(errorhandler())
const server: any = app.listen(3072, () => {
    console.log('listening at ', server.address().port)
})

app.use(proxy)

RPC()