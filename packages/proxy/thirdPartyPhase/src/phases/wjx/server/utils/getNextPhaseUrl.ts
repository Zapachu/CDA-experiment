'use strict'

import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting as settings} from 'elf-setting'
import {RedisCall, SendBackPlayer} from 'elf-protocol'

const {wjxProxy} = settings

export const getNextPhaseUrl = async (wjxHash, wjxPhaseId, jidx) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findById(wjxPhaseId)
    console.log('log > wjx phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    const request = {
        elfGameId: wjxPhase.elfGameId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || wjxPhase.playHash[0].player,
        playUrl: `${wjxProxy}/init/jq/${wjxPhase._id.toString()}`,
        phaseResult: {uniKey: jidx}
    }
    const {sendBackUrl} = await RedisCall.call<SendBackPlayer.IReq, SendBackPlayer.IRes>(SendBackPlayer.name, request)
    return sendBackUrl
}