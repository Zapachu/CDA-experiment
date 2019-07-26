import {ThirdPartPhase} from '../../../../core/server/models'
import {elfSetting} from '@elf/setting'
import {Linker, RedisCall} from '@elf/protocol'

const {qualtricsProxy} = elfSetting

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
        playUrl: `${qualtricsProxy}/init/jfe/form/${qualtricsPhase._id.toString()}`
    }

    await RedisCall.call<Linker.Result.IReq, Linker.Result.IRes>(Linker.Result.name, request)
    return '#'
}

export {
    getNextPhaseUrl
}
