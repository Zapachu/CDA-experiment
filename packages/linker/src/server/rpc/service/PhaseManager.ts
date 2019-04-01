import {Server} from 'grpc'
import {config} from '@common'
import {Log, redisClient, RedisKey, RedisLifetime, buildPlayUrl} from '@server-util'
import {StateManager} from '@server-service'
import {PhaseManager as P} from 'elf-protocol'

export function setGameService(server: Server) {

    function registerPhases(req: { request: P.TRegisterPhasesReq }, callback: P.TRegisterPhasesCallBack) {
        Log.d('registerPhases:', JSON.stringify(req.request))
        new Promise(async resolve => {
            req.request.phases.forEach(async phase => {
                await redisClient.setex(RedisKey.phaseRegInfo(phase.namespace), RedisLifetime.phaseRegInfo, JSON.stringify(phase))
            })
            await redisClient.sadd(RedisKey.registeredPhaseSet, req.request.phases.map(({namespace}) => namespace))
            resolve()
        }).then(() => callback(null, {
            success: true,
            waitURL: `/${config.rootName}/waiting`
        }))
    }

    function sendBackPlayer(req: { request: P.TSendBackPlayerReq }, callback: P.TSendBackPlayerCallback) {
        Log.d('sendBackPlayer:', JSON.stringify(req.request))
        const {elfGameId: gameId, playUrl, playerToken, nextPhaseKey, phaseResult} = req.request
        StateManager.getManager(gameId).then(async (stateManager) => {
            await stateManager.sendBackPlayer(playUrl, playerToken, nextPhaseKey, phaseResult)
            callback(null, {sendBackUrl: buildPlayUrl(gameId, playerToken)})
        })
    }

    P.setGameService(server, {registerPhases, sendBackPlayer})
}

const phaseServices: { [k: string]: P.TPhaseServiceConsumer } = {}

export function getPhaseService(phaseServiceUri: string) {
    if (!phaseServices[phaseServiceUri]) {
        phaseServices[phaseServiceUri] = P.getPhaseService(phaseServiceUri)
    }
    return phaseServices[phaseServiceUri]
}
