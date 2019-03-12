'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import settings from "../../../../config/settings"
import {gameService} from "../../../common/utils"

const {wjxProxy} = settings

const getNextPhaseUrl = async (wjxHash) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findOne({
        namespace: 'wjx',
        playHash: {$elemMatch: {hash: `${wjxHash}.aspx`}}
    })
    console.log('log > wjx phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    const request = {
        groupId: wjxPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || wjxPhase.playHash[0].player,
        playUrl: `${wjxProxy}/init/jq/${wjxPhase._id.toString()}`,
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

export {
    getNextPhaseUrl
}
