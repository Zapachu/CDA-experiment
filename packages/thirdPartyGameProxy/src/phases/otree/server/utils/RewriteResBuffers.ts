'use strict'


import {sendErrorPage} from '../../../common/utils'
import {ThirdPartPhase} from "../../../../core/server/models"
import {RedisCall, SetPlayerResult} from '@elf/protocol'
import {elfSetting as settings} from '@elf/setting'
import {Request, Response} from 'express'
import {previewScreenXlsxRoute} from '../config'

const {oTreeProxy} = settings

const START_SIGN = 'InitializeParticipant'
const END_SIGN = 'OutOfRangeNotification'


export const rewriteResBuffers = async (proxyRes, req: Request, res: Response) => {

    if (!req.session.oTreePhaseId) return sendErrorPage(res, 'Error In Rewrite Buffer')

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


        let playerToken: string = ''
        const playerOtreeHash: string = req.headers.referer.split('/p/')[1].split('/')[0]
        try {
            const otreePhase: any = await ThirdPartPhase.findOne({playHash: {$elemMatch: {hash: playerOtreeHash}}})
            otreePhase.playHash.map(op => {
                if (op.hash.toString() === playerOtreeHash.toString()) {
                    playerToken = op.player.toString()
                }
            })
            const elfGameId: string = otreePhase.elfGameId
            const playUrl: string = `${oTreeProxy}/init/${START_SIGN}/${otreePhase._id}`
            await RedisCall.call<SetPlayerResult.IReq, SetPlayerResult.IRes>(SetPlayerResult.name, {
                elfGameId, playUrl, playerToken,
                result: {uniKey: playerOtreeHash, detailIframeUrl:`${oTreeProxy}${previewScreenXlsxRoute}/${otreePhase.id}`}
            })
            return okRes().redirect('#')
        } catch (err) {
            if (err) {
                console.trace(err)
                return okRes().send(err)
            }
        }
    }
}
