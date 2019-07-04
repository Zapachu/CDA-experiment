'use strict'


import {ErrorPage} from '../../../common/utils'
import {ThirdPartPhase} from "../../../../core/server/models"
import {RedisCall, SendBackPlayer} from 'elf-protocol'
import {elfSetting as settings} from 'elf-setting'
import {Request, Response} from 'express'
import {previewScreenXlsxRoute} from '../config'

const {oTreeProxy} = settings

const START_SIGN = 'InitializeParticipant'
const END_SIGN = 'OutOfRangeNotification'


export const rewriteResBuffers = async (proxyRes, req: Request, res: Response) => {

    if (!req.session.oTreePhaseId) return ErrorPage(res, 'Error In Rewrite Buffer')

    const isEnd = req.url.includes(END_SIGN)

    if (isEnd) {
        const originWrite = res.write
        const originEnd = res.end

        const okRes = () => {
            res.write = originWrite
            res.end = originEnd
            return res
        }
        res.write = () => true
        res.end = () => {
        }


        let playerGameHash: string
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]
        try {
            const otreePhase: any = await ThirdPartPhase.findOne({playHash: {$elemMatch: {hash: playerOtreeHash}}})
            otreePhase.playHash.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerGameHash = op.player.toString()
                }
            })
            const params: { nextPhaseKey: string } = JSON.parse(otreePhase.param)
            const elfGameId: string = otreePhase.elfGameId
            const playUrl: string = `${oTreeProxy}/init/${START_SIGN}/${otreePhase._id}`
            const playerToken: string = playerGameHash
            const nextPhaseKey: string = params.nextPhaseKey
            const {sendBackUrl} = await RedisCall.call<SendBackPlayer.IReq, SendBackPlayer.IRes>(SendBackPlayer.name, {
                elfGameId, playUrl, playerToken, nextPhaseKey,
                phaseResult: {uniKey: playerOtreeHash, detailIframeUrl:`${oTreeProxy}${previewScreenXlsxRoute}/${otreePhase.id}`}
            })
            return okRes().redirect(sendBackUrl)
        } catch (err) {
            if (err) {
                console.trace(err)
                return okRes().send(err)
            }
        }
    }
}
