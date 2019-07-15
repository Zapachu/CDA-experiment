import {ThirdPartPhase} from '../../../../core/server/models'
import {RedisCall, Linker} from '@elf/protocol'

export const getNextPhaseUrl = async (wjxHash, wjxPhaseId, jidx) => {
    console.log('log > wjx hash ', wjxHash)
    const wjxPhase: any = await ThirdPartPhase.findById(wjxPhaseId)
    console.log('log > wjx phase', wjxPhase)
    const paramsJson = JSON.parse(wjxPhase.param)
    await RedisCall.call<Linker.Result.IReq, Linker.Result.IRes>(Linker.Result.name, {
        elfGameId: wjxPhase.elfGameId,
        playerToken: paramsJson.palyerCode || wjxPhase.playHash[0].player,
        result: {uniKey: jidx}
    })
    return '#'
}