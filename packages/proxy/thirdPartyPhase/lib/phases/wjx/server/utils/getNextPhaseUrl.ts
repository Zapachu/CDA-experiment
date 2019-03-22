'use strict'

import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from 'elf-setting'
import {gameService} from "../../../common/utils"

const {wjxProxy} = settings

const getNextPhaseUrl = async (wjxHash, wjxPhaseId, jidx) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findById(wjxPhaseId)
    console.log('log > wjx phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    const request = {
        groupId: wjxPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || wjxPhase.playHash[0].player,
        playUrl: `${wjxProxy}/init/jq/${wjxPhase._id.toString()}`,
        phasePlayer: {uniKey: jidx}
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
