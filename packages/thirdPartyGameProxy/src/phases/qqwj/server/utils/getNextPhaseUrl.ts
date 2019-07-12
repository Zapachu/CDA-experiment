import {ThirdPartPhase} from '../../../../core/server/models'
import {Linker, RedisCall} from '@elf/protocol'

const getNextPhaseUrl = async (req) => {
    const phaseId = req.session.qqwjPhaseId
    const qqwjHash = req.url.split('/s/')[1]
    console.log('log > qqwj hash ', qqwjHash)
    const qqwjPhase: any = await ThirdPartPhase.findById(phaseId)
    const paramsJson = JSON.parse(qqwjPhase.param)
    await RedisCall.call<Linker.Result.IReq, Linker.Result.IRes>(Linker.Result.name, {
        elfGameId: qqwjPhase.elfGameId,
        playerToken: paramsJson.palyerCode || qqwjPhase.playHash[0].player
    })
    return '#'
}

export {
    getNextPhaseUrl
}
