import {ThirdPartPhase} from "../../../../core/server/models"
import settings from "../../../../config/settings"
import {gameService} from '../../../common/utils'

const getNextPhaseUrl = async (req) => {
    const qqwjHash = req.url.split('/s/')[1]
    console.log('log > qqwj hash ', qqwjHash)
    const qqwjPhase: any = await ThirdPartPhase.findOne({
        namespace: 'qqwj',
        playHash: {$elemMatch: {hash: qqwjHash}}
    })
    console.log('log > qqwj phase', qqwjPhase)
    const paramsJson = JSON.parse(qqwjPhase.param)
    const request = {
        groupId: qqwjPhase.groupId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qqwjPhase.playHash[0].player,
        playUrl: `${settings.qqwjProxy}/init/qqwj/${qqwjPhase._id.toString()}`,
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
