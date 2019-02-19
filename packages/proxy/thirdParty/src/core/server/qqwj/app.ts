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
import { gameService } from './rpc/service/qqwjManager'
import { ThirdPartPhase } from '../models'
import * as zlib from 'zlib'
const {Gzip} = require('zlib')

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
app.use(`/${settings.qqwjRootName}/static`, Express.static(
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

const getNextPhaseUrl = async (qqwjHash) => {
    console.log('log > qqwj hash ', qqwjHash)
    const qqwjPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qqwj',
        playHashs: { $elemMatch: { hash: qqwjHash } }
    })
    console.log('log > qqwj phase', qqwjPhase)
    const paramsJson = JSON.parse(qqwjPhase.param)
    const request = {
        groupId: qqwjPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qqwjPhase.playHashs[0].player,
        playUrl: `${settings.qqwjPhaseServerPrefix}/init/qqwj/${qqwjPhase._id.toString()}`,
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
    target: settings.qqwjServerRootUrl,
    ws: true,
    changeOrigin: true,
    autoRewrite: true,
    protocolRewrite: 'http',
    onProxyRes: async (proxyRes, req, res) => {
        if (req.url.includes('/s/') && !req.url.includes('/init/') && req.method === 'GET') {

            const qqwjHash = req.url.split('/s/')[1]
            const nextPhaseUrl = await getNextPhaseUrl(qqwjHash)

            const originWrite = res.write
            const originEnd = res.end

            // res.setHeader('content-encoding', 'gzip')
            // res.setHeader('content-type', 'text/html; charset=utf-8')

            let gzipStream = Gzip()
            const insert_scripts = `
                <script>
                    // Recover setInterval and new a Timer Obejct
                    function Timer(fn, t) {
                        var timerObj = setInterval(fn, t);
                        this.stop = function() {
                            if (timerObj) {
                                clearInterval(timerObj);
                                timerObj = null;
                            }
                            return this;
                        }
                    
                        this.start = function() {
                            if (!timerObj) {
                                this.stop();
                                timerObj = setInterval(fn, t);
                            }
                            return this;
                        }
                    
                        this.reset = function(newT) {
                            t = newT;
                            return this.stop().start();
                        }
                    }
                    (function () {
                        Timer(() => {
                            console.warn('debug: find end sign')
                            if (document.getElementsByClassName('survey_suffix') && $('.survey_suffix').css('display') != 'none') {
                                window.location.href = '${nextPhaseUrl}'
                            }
                        }, 2000)
                    })()
                </script>
            `
            let buffers = []

            res.write = (chunk) => {
                console.log('log > got buffer from proxyRes')
                buffers.push(chunk)
                return true
            }
            res.end = () => {
                console.log("log > got end")
                let fullChunk = Buffer.concat(buffers)
                zlib.unzip(fullChunk, { finishFlush: zlib.constants.Z_SYNC_FLUSH }, (err, buffer) => {
                    if (!err) {
                        gzipStream.on('data', chunk => {
                            console.log('log > write gziped buffer')
                            originWrite.call(res, chunk)
                        })
                        gzipStream.on('end', () => {
                            console.log('log > write gziped buffer end')
                            originEnd.call(res)
                        })

                        const data = buffer.toString()
                        const dataStart = data.split('<head>')[0]
                        const dataEnd = data.split('<head>')[1]
                        const newData = dataStart + '<head>' + insert_scripts + dataEnd

                        const removeSafePart = newData.replace('<script src="//js.aq.qq.com/js/aq_common.js"></script>', '')
                        gzipStream.write(new Buffer(removeSafePart))
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

    console.log(`${req.method}  ${req.url}`)

    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    // 初始化
    if (req.url.includes('/init/qqwj/')) {
        const currentUserElfGameHash = req.query.token
        console.log('log > current Elf hash ....', currentUserElfGameHash)
        const currentPhaseId = req.url.split('/init/qqwj/')[1].slice(0, 24)
        try {
            const currentPhase: any = await ThirdPartPhase.findById(currentPhaseId)
            const currentPhaseParamsJson = JSON.parse(currentPhase.param)
            const currentPhaseqqwjHash = currentPhaseParamsJson.qqwjHash

            if (!currentPhase) {
                return res.redirect('https://ancademy.org')
            }

            console.log('log > find phase object...')
            console.log(currentPhase)

            const { playHashs } = currentPhase

            let redirectTo = null

            for (let i = 0; i < playHashs.length; i++) {
                if (playHashs[i].player.toString() === currentUserElfGameHash.toString()) {
                    redirectTo = `${settings.qqwjPhaseServerPrefix}/s/${currentPhaseqqwjHash}`
                }
            }

            if (redirectTo) {
                return res.redirect(redirectTo)
            }

            // 新加入成员
            playHashs.push({ hash: currentPhaseqqwjHash, player: currentUserElfGameHash })
            currentPhase.playHashs = playHashs
            currentPhase.markModified('playHashs')
            await currentPhase.save()
            return res.redirect(`${settings.qqwjPhaseServerPrefix}/s/${currentPhaseqqwjHash}`)
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }

        next()
    }

    if (req.url.includes('/s/') && !req.url.includes('init')) {
        req.headers = Object.assign(req.headers, {
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'zh-CN,zh;q=0.9',
            'origin': 'https://wj.qq.com',
            'referer': 'https://wj.qq.com/s/2831201/232f/'
        })
        next()
    }

    next()
})


/**
 * 部署于 二级域名 或仅使用代理  eg:   https://qqwj.ancademy.org/...
 */
app.use(errorhandler())
const server: any = app.listen(3073, () => {
    console.log('listening at ', server.address().port)
})

app.use(proxy)

RPC()