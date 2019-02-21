'use strict'


import {ThirdPartPhase} from "../../../../core/server/models"
import {gameService} from "../../rpc"
import settings from '../../../../config/settings'
const {localOtreeRootUrl} = settings

const rewriteResBuffers = async (proxyRes, req, res) => {

    const isEnd = req.url.includes('OutOfRangeNotification')  // 是否结束标志
    const otreeParticipantUrl = 'InitializeParticipant/'      // 初始化的标志

    if (isEnd) {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }
        res.write = (r) => {}
        res.end = () => {}
        let playerGameHash: string
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]
        try {
            const otreePhase: any = await ThirdPartPhase.findOne({
                // namespace: 'otree',
                playHashs: {$elemMatch: {hash: playerOtreeHash}}
            }).exec()
            console.log('phase', otreePhase)
            otreePhase.playHashs.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerGameHash = op.player.toString()
                }
            })
            const params: { nextPhaseKey: string } = JSON.parse(otreePhase.param)
            const groupId: string = otreePhase.groupId
            const playUrl: string = `${localOtreeRootUrl}/init/${otreeParticipantUrl}${otreePhase._id}`
            const playerToken: string = playerGameHash
            const nextPhaseKey: string = params.nextPhaseKey
            const request: { groupId: string, playUrl: string, playerToken: string, nextPhaseKey: string } = {
                groupId, playUrl, playerToken, nextPhaseKey
            }
            gameService.sendBackPlayer(request, (err: {}, service_res: { sendBackUrl: string }) => {
                if (err) {
                    console.log(err)
                    return okRes().send('Get Next Phase Error From Core')
                }
                console.log(service_res.sendBackUrl)
                const nextPhaseUrl = service_res.sendBackUrl
                return okRes().redirect(nextPhaseUrl)
            })
        } catch (err) {
            if (err) {
                console.log(err)
                return okRes().send(err)
            }
        }
    }
}

export {
    rewriteResBuffers
}