'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {gameService} from "../../../common/utils"
import settings from "../../../../config/settings"

const {qualtricsProxy} = settings

const getNextPhaseUrl = async (req) => {

    console.log('log > getNextPhaseUrl')

    const qualtricsHash = req.url.split('/jfe/form/')[1]

    console.log('log > qualtrics hash ', qualtricsHash)

    const qualtricsPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qualtrics',
        playHash: {$elemMatch: {hash: qualtricsHash}}
    })
    console.log('log > qualtrics phase', qualtricsPhase)
    const paramsJson = JSON.parse(qualtricsPhase.param)
    const request = {
        groupId: qualtricsPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qualtricsPhase.playHash[0].player,
        playUrl: `${qualtricsProxy}/init/jfe/form/${qualtricsPhase._id.toString()}`,
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

export {
    getNextPhaseUrl
}
