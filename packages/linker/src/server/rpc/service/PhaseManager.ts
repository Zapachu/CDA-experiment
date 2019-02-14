import {resolve} from 'path'
import {loadPackageDefinition, credentials} from 'grpc'
import {config} from '@common'
import {loadSync} from '@grpc/proto-loader'
import {Log, redisClient, RedisKey, RedisLifetime, buildPlayUrl} from '@server-util'
import {IRegisterPhasesReq, ISendBackPlayerReq, PhaseService as CPhaseService} from '..'
import {GroupStateService} from '@server-service'

const {GameService, PhaseService} = loadPackageDefinition(loadSync(resolve(__dirname, '../proto/phaseManager.proto'))) as any

const gameService = {
    registerPhases: (req: { request: IRegisterPhasesReq }, callback) => {
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
    },
    sendBackPlayer: (req: { request: ISendBackPlayerReq }, callback) => {
        Log.d('sendBackPlayer:', JSON.stringify(req.request))
        const {groupId, playUrl, playerToken, nextPhaseKey} = req.request
        GroupStateService.getService(groupId).then(async (groupService) => {
            await groupService.sendBackPlayer(playUrl, playerToken, nextPhaseKey)
            callback(null, {sendBackUrl: buildPlayUrl(groupId, playerToken)})
        })
    }
}
export {GameService, gameService}

const phaseServices: { [k: string]: CPhaseService } = {}

export function getPhaseService(phaseServiceUri: string): CPhaseService {
    if (!phaseServices[phaseServiceUri]) {
        phaseServices[phaseServiceUri] = new PhaseService(phaseServiceUri, credentials.createInsecure())
    }
    return phaseServices[phaseServiceUri]
}