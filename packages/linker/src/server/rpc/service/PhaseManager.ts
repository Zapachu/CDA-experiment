import {Server,ServerUnaryCall} from 'grpc'
import {Log, redisClient, RedisKey, RedisLifetime, buildPlayUrl} from '@server-util'
import {StateManager} from '@server-service'
import {PhaseManager as P} from 'elf-protocol'

export function setGameService(server: Server) {

    function registerPhases(req: ServerUnaryCall<P.TRegisterPhasesReq>, callback: P.TRegisterPhasesCallBack) {
        const clientHost = req.getPeer().split(':')[1]
        Log.d(`registerPhases: ${clientHost}`, JSON.stringify(req.request), clientHost)
        new Promise(async resolve => {
            req.request.phases.forEach(async phase => {
                await redisClient.setex(RedisKey.phaseRegInfo(phase.namespace), RedisLifetime.phaseRegInfo, JSON.stringify({
                    ...phase,
                    rpcUri:`${clientHost}:${phase.rpcPort}`
                }))
            })
            await redisClient.sadd(RedisKey.registeredPhaseSet, req.request.phases.map(({namespace}) => namespace))
            resolve()
        }).then(() => callback(null, {
            success: true
        }))
    }

    function setPhaseResult(req: { request: P.TSetPhaseResultReq }, callback: P.TSetPhaseResultCallback) {
        Log.i(JSON.stringify(req.request))
        const {elfGameId: gameId, playUrl, playerToken, phaseResult} = req.request
        StateManager.getManager(gameId).then(async stateManager => {
            await stateManager.setPhaseResult(playUrl, playerToken, phaseResult)
            callback(null, {success: true})
        })
    }

    function sendBackPlayer(req: { request: P.TSendBackPlayerReq }, callback: P.TSendBackPlayerCallback) {
        Log.i(JSON.stringify(req.request))
        const {elfGameId: gameId, playUrl, playerToken, nextPhaseKey, phaseResult} = req.request
        StateManager.getManager(gameId).then(async stateManager => {
            await stateManager.sendBackPlayer(playUrl, playerToken, nextPhaseKey, phaseResult)
            callback(null, {sendBackUrl: buildPlayUrl(gameId, playerToken)})
        })
    }

    P.setGameService(server, {registerPhases, setPhaseResult, sendBackPlayer})
}

const phaseServices: { [k: string]: P.TPhaseServiceConsumer } = {}

export function getPhaseService(phaseServiceUri: string) {
    if (!phaseServices[phaseServiceUri]) {
        phaseServices[phaseServiceUri] = P.getPhaseService(phaseServiceUri)
    }
    return phaseServices[phaseServiceUri]
}
