import * as httpProxy from 'http-proxy-middleware'
import {Response, Request, NextFunction} from 'express'
import {settings, ThirdPartPhase, GameUserPermissionModel, Server, getGameService} from '@core/server'
import {serve as serveRPC} from './rpcService'

const express = Server.start(3070, settings.otreeRootName)

const OTREE = {
    PLAY_URL: settings.otreeServerRootUrl,
    PARTICIPANT_URL: 'InitializeParticipant/',
    END_SIGN: 'OutOfRangeNotification'
}
express.use(async (req: Request & {
    user: { _id: string }
}, res: Response, next: NextFunction) => {

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
            const userGamePermissions: any = await GameUserPermissionModel.find({userId: req.user._id.toString()}).populate('gameTemplateId')
            userGamePermissions.forEach(rec => {
                if (rec.gameTemplateId.code === otreePhaseTypeCode) {
                    permittedList.push(rec.gameTemplateId.namespace)
                }
            })
            return res.json({err: 0, list: permittedList})
        } catch (err) {
            if (err) {
                return res.json({err: 1, msg: err})
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
    if (req.path.indexOf(OTREE.END_SIGN) != -1) {

        let playerGameHash: string
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]

        try {
            const otreePhase: any = await ThirdPartPhase.findOne({
                namespace: 'otree',
                playHashs: {$elemMatch: {hash: playerOtreeHash}}
            }).exec()
            otreePhase.playHashs.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerGameHash = op.player.toString()
                }
            })

            const params: { nextPhaseKey: string } = JSON.parse(otreePhase.param)
            const groupId: string = otreePhase.groupId
            const playUrl: string = otreePhase.prefixUrl + OTREE.PARTICIPANT_URL + playerOtreeHash
            const playerToken: string = playerGameHash
            const nextPhaseKey: string = params.nextPhaseKey

            const request: { groupId: string, playUrl: string, playerToken: string, nextPhaseKey: string } = {
                groupId, playUrl, playerToken, nextPhaseKey
            }
            getGameService().sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
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
                console.log(`${OTREE.PLAY_URL}/${OTREE.PARTICIPANT_URL}${findExistOne[0].hash}`)
                return res.redirect(`${OTREE.PLAY_URL}/${OTREE.PARTICIPANT_URL}${findExistOne[0].hash}`)
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
                return res.redirect(`${OTREE.PLAY_URL}/${OTREE.PARTICIPANT_URL}${findHash}`)
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

express.use(httpProxy({
    target: OTREE.PLAY_URL,
    ws: true
}))

serveRPC()