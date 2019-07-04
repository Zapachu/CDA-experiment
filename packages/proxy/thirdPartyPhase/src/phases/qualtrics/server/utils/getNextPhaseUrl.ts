'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from 'elf-setting'
import {RedisCall, SendBackPlayer} from 'elf-protocol'

const {qualtricsProxy} = settings

const getNextPhaseUrl = async (req) => {

    console.log('log > getNextPhaseUrl')

    const qualtricsHash = req.url.split('/jfe/form/')[1]

    const phaseId = req.session.qualtricsPhaseId

    console.log('log > qualtrics hash ', qualtricsHash)

    const qualtricsPhase: any = await ThirdPartPhase.findById(phaseId)
    console.log('log > qualtrics phase', qualtricsPhase)
    const paramsJson = JSON.parse(qualtricsPhase.param)
    const request = {
        elfGameId: qualtricsPhase.elfGameId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qualtricsPhase.playHash[0].player,
        playUrl: `${qualtricsProxy}/init/jfe/form/${qualtricsPhase._id.toString()}`,
    }

    const {sendBackUrl} = await RedisCall.call<SendBackPlayer.IReq, SendBackPlayer.IRes>(SendBackPlayer.name, request)
    return sendBackUrl
}

export {
    getNextPhaseUrl
}
