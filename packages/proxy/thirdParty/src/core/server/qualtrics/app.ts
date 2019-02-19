import * as path from 'path'
import * as zlib from 'zlib'
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
import { gameService } from './rpc/service/QualtricsManager'
import { ThirdPartPhase } from '../models'

const { Gzip } = require('zlib')
const qualtricsPlayUrl = settings.qualtricsServerRootUrl
const qualtricsProxyServer = settings.qualtricsPhaseServerPrefix

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
app.use(`/${settings.qualtricsRootName}/static`, Express.static(
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

const getNextPhaseUrl = async (req) => {
    console.log('log > req.url ', req.url)
    const qualtricsHash = req.url.split('/jfe/form/')[1]
    console.log('log > qualtrics hash ', qualtricsHash)
    const qualtricsPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qualtrics',
        playHashs: { $elemMatch: { hash: qualtricsHash } }
    })
    console.log('log > qualtrics phase', qualtricsPhase)
    const paramsJson = JSON.parse(qualtricsPhase.param)
    const request = {
        groupId: qualtricsPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qualtricsPhase.playHashs[0].player,
        playUrl: `${qualtricsProxyServer}/init/jfe/form/${qualtricsPhase._id.toString()}`,
    }

    return await new Promise((resolve, reject) => {
        console.log(request)
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
    target: qualtricsPlayUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {

        console.log('log > requst info:', req.url, req.method)

        if (!req.url.includes('/init') && !req.url.includes('.js.map') && req.url.includes('/jfe/form') && req.method === 'GET') {

            const originWrite = res.write
            const originEnd = res.end

            res.setHeader('content-encoding', 'gzip')
            res.setHeader('content-type', 'text/html; charset=utf-8')
            let buffers = []
            res.write = (chunk) => {
                console.log('log > got buffer from proxyRes')
                buffers.push(chunk)
                return true
            }
            res.end = () => {
                console.log("log > got end")
                let fullChunk = Buffer.concat(buffers)
                console.log(fullChunk)
                zlib.unzip(fullChunk, {
                    finishFlush: zlib.constants.Z_SYNC_FLUSH,
                    flush: zlib.Z_SYNC_FLUSH,
                }, async (err, buffer) => {
                    if (!err) {

                        const nextPhaseUrl = await getNextPhaseUrl(req)
                        let gzipStream = Gzip()
                        const insert_scripts = `
                            <script>
                                (function () {
                                    setInterval(() => {
                                        console.log('debug: find end sign')
                                        if (document.getElementById('EndOfSurvey')) {
                                            window.location.href = '${nextPhaseUrl}'
                                        }
                                    }, 2000)
                                })()
                            </script>
                        `

                        gzipStream.on('data', chunk => {
                            console.log('log > write gziped buffer')
                            originWrite.call(res, chunk)
                        })
                        gzipStream.on('end', () => {
                            console.log('log > write gziped buffer end')
                            originEnd.call(res)
                        })

                        const data = buffer.toString()
                        const dataStart = data.split('</body>')[0]
                        const dataEnd = data.split('</body>')[1]
                        const newData = dataStart + insert_scripts + dataEnd
                        console.log('log > new html produced')
                        gzipStream.write(new Buffer(newData))
                        gzipStream.end()
                    } else {
                        console.log(err)
                    }
                })
            }
        }
    }
})

interface IRequest extends Request {
    user: {
        _id: string
    }
}

app.use(async (req: IRequest, res: Response, next: NextFunction) => {


    // 非登录用户禁止访问
    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    req.header['Accept-Encoding'] = 'gzip'

    // 用户访问问卷
    if (req.path.indexOf('/init/jfe/form') !== -1 && req.method === 'GET') {
        console.log('log > Starting init.....')
        const currentUserElfGameHash = req.query.token
        console.log('log > current Elf hash ....', currentUserElfGameHash)
        const currentPhaseId = req.url.split('/jfe/form/')[1].slice(0, 24)
        try {
            const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
            const currentPhaseParamsJson = JSON.parse(currentPhase.param)
            const currentPhaseSurveyId = currentPhaseParamsJson.qualtricsHash

            // 访问不存在的phase
            if (!currentPhase) {
                return res.redirect('https://ancademy.org')
            }

            console.log('log > find phase object...')
            console.log(currentPhase)

            const { playHashs } = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${qualtricsProxyServer}/jfe/form/${currentPhaseSurveyId}`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({ hash: currentPhaseSurveyId, player: currentUserElfGameHash })
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${qualtricsProxyServer}/jfe/form/${currentPhaseSurveyId}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    next()
})


/**
 * 部署于 二级域名 或仅适用代理  eg:   https://qualtrics.ancademy.org/...
 */
app.use(errorhandler())
const server: any = app.listen(3071, () => {
    console.log('listening at ', server.address().port)
})

app.use(proxy)

RPC()