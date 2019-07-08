import {ThirdPartPhase} from "../../../../core/server/models"
import {elfSetting as settings} from '@elf/setting'
import {RedisCall, SetPlayerResult} from '@elf/protocol'

const getNextPhaseUrl = async (req) => {
    const phaseId =  req.session.qqwjPhaseId
    const qqwjHash = req.url.split('/s/')[1]
    console.log('log > qqwj hash ', qqwjHash)
    const qqwjPhase: any = await ThirdPartPhase.findById(phaseId)
    console.log('log > qqwj phase', qqwjPhase)
    const paramsJson = JSON.parse(qqwjPhase.param)
    const request = {
        elfGameId: qqwjPhase.elfGameId,
        nextPhaseKey: paramsJson.nextPhaseKey || -1,
        playerToken: paramsJson.palyerCode || qqwjPhase.playHash[0].player,
        playUrl: `${settings.qqwjProxy}/init/qqwj/${qqwjPhase._id.toString()}`,
    }

    await RedisCall.call<SetPlayerResult.IReq, SetPlayerResult.IRes>(SetPlayerResult.name, request)
    return '#'
}

export {
    getNextPhaseUrl
}
