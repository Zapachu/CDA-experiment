
import * as path from 'path'
import * as Express from 'express'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import * as errorhandler from 'errorhandler'
import * as expressSession from 'express-session'
import * as httpProxy from 'http-proxy-middleware'

import { Response, Request, NextFunction } from 'express'
import { connect as mongodConnect, connection as mongodConnection } from 'mongoose'

import './passport'
import settings from '../config/settings'

// Mongoose Model Import
import { ThirdPartPhase } from '../models'
import { GameUserPermissionModel } from '../models'

// Otree 对外 RPC 服务;  阶段切换 服务
import { serve as otreeRPC } from './rpc'
import { gameService } from './rpc/service/OtreeManager'

// Otree Sign
const otreePlayUrl = settings.otreeServerRootUrl
const otreeParticipantUrl = 'InitializeParticipant/'
const otreeEndSign = 'OutOfRangeNotification'

// Mongoose settings
mongodConnect(settings.mongoUri, {
    ...settings.mongoUser ? { user: settings.mongoUser, pass: settings.mongoPass } : {},
    useNewUrlParser: true
})
mongodConnection.on('error', () => console.log('Mongodb Connection Error'))

// Redis settings
const redis = require('redis')
const RedisStore = require('connect-redis')(expressSession)
const redisClient = redis.createClient(settings.redisPort, settings.redisHost)

// session config
const sessionSet = {
    name: "academy.sid",
    resave: true,
    saveUninitialized: true,
    secret: settings.sessionSecret,
    store: new RedisStore({ client: redisClient, auto_reconnect: true })
}

const app = Express()

// 静态文件
app.set('views', path.join(__dirname, './view'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb', parameterLimit: 30000 }))
app.use(`/${settings.otreeRootName}/static`, Express.static(
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

const proxy = httpProxy({
    target: otreePlayUrl,
    ws: true
})

interface IRequest extends Request { user: { _id: string } }

app.use(async (req: IRequest, res: Response, next: NextFunction) => {

    console.log(`${req.method}  ${req.url}`)

    // 非登录用户禁止访问 Otree
    if (!req.user) {
        return res.redirect('https://ancademy.org')
    }

    // Otree phase 列表权限验证, 1. 获取用户信息, 2. 权限验证, 3. 返回列表
    const otreePhaseJSRequestSign: string = '/phases/list'
    const otreePhaseTypeCode = '70'

    // 获取用户许可的 otree 类型
    if (req.path.indexOf(otreePhaseJSRequestSign) != -1) {
        const permittedList = []
        try {
            const userGamePermissions: any = await GameUserPermissionModel.find({ userId: req.user._id.toString() }).populate('gameTemplateId')
            userGamePermissions.forEach(rec => {
                if (rec.gameTemplateId.code === otreePhaseTypeCode) {
                    permittedList.push(rec.gameTemplateId.namespace)
                }
            })
            return res.json({ err: 0, list: permittedList })
        } catch (err) {
            if (err) {
                return res.json({ err: 1, msg: err })
            }
        }
    }

    /**
     * 如果所有otree 实验阶段完成，则到Game的下一个 phase
     *      1. 获取otree结束标记
     *      2. 获取 player otreehash
     *      3. 通过 player otreehash 获得 otree phase
     *      4. 通过 otree phase 获得下一阶段所需参数
     *      5. 通过 player code、nextPhaseKey 获得 下一阶段 url
     */
    if (req.path.indexOf(otreeEndSign) != -1) {

        let playerGameHash: string
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]

        try {
            const otreePhase: any = await ThirdPartPhase.findOne({ 
                namespace: 'otree',
                playHashs: { $elemMatch: { hash: playerOtreeHash } } 
            }).exec()
            otreePhase.playHashs.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerGameHash = op.player.toString()
                }
            })

            const params: { nextPhaseKey: string } = JSON.parse(otreePhase.param)
            const groupId: string = otreePhase.groupId
            const playUrl: string = otreePhase.prefixUrl + otreeParticipantUrl + playerOtreeHash
            const playerToken: string = playerGameHash
            const nextPhaseKey: number = parseInt(params.nextPhaseKey)

            const request: { groupId: string, playUrl: string, playerToken: string, nextPhaseKey: number } = {
                groupId, playUrl, playerToken, nextPhaseKey
            }

            gameService.sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
                if (err) {
                    console.log(err)
                    return res.redirect('https://ancademy.org')
                }
                const nextPhaseUrl = service_res.sendBackUrl
                return res.redirect(nextPhaseUrl)
            })
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }
    }

    /**
     * 来自 Game 服务 Phase 阶段的跳转路由
     *      路由包含 二级域名前缀、初始化Session标记、otreePhaseId、由Game服务提供的Player HASH
     *      其格式举例为  https://otree.ancademy/init/InitializeParticipant/[otreePhaseId]?[hash=GAME服务提供的HASH]
     */

    if (req.path.indexOf('/init/') > -1) {
        let findHash: string
        const gameServicePlayerHash: string = req.query.token
        const otreePhaseId: string = req.path.split('InitializeParticipant/')[1]

        try {
            const otreePhase: any = await ThirdPartPhase.findById(otreePhaseId).exec()

            if (!otreePhase) {
                return res.redirect('https://ancademy.org')
            }

            const findExistOne = otreePhase.playHashs.filter(h => h.player.toString() === gameServicePlayerHash.toString())

            //  已加入过
            if (findExistOne.length > 0) {
                console.log('????')
                console.log(`${otreePlayUrl}/${otreeParticipantUrl}${findExistOne[0].hash}`)
                return res.redirect(`${otreePlayUrl}/${otreeParticipantUrl}${findExistOne[0].hash}`)
            } else {
                for (let i = 0; i < otreePhase.playHashs.length; i++) {
                    console.log(otreePhase.playHashs[i].player)
                    if (otreePhase.playHashs[i].player === 'wait') {
                        findHash = otreePhase.playHashs[i].hash.toString()
                        otreePhase.playHashs[i].player = gameServicePlayerHash.toString()
                        break
                    }
                }
                console.log(findHash)
                // 已分配完毕，不再允许加入
                if (!findHash) {
                    throw '分配完毕，不再允许加入'
                }
                // 新加入的
                otreePhase.markModified('playHashs')
                await otreePhase.save()
                return res.redirect(`${otreePlayUrl}/${otreeParticipantUrl}${findHash}`)
            }
        } catch (err) {
            if (err) {
                console.log(err)
                return res.redirect('https://ancademy.org')
            }
        }
    }
    next()
})


/**
 * 部署于 二级域名  eg:   https://otree.ancademy.org/...
 */
app.use(errorhandler())
const server: any = app.listen(3070, () => {
    console.log('listening at ', server.address().port)
})

app.use(proxy)

/**
 * Otree phase RPC 服务
 */
otreeRPC()