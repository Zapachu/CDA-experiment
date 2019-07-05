import {elfSetting} from '@elf/setting'
import {Server, ServerCredentials} from 'grpc'
import {setElfService} from './service/ElfAdmin'
import {RedisCall, SendBackPlayer, SetPhaseResult} from '@elf/protocol'
import {StateManager} from '@server-service'
import {buildPlayUrl} from '@server-util'

export {getAdminService} from './service/ElfAdmin'

export function serve() {
    const server = new Server()
    setElfService(server)
    server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
    server.start()
}

RedisCall.handle<SetPhaseResult.IReq, SetPhaseResult.IRes>(SetPhaseResult.name,
    async ({elfGameId, playUrl, playerToken, phaseResult}) => {
        const stageManger = await StateManager.getManager(elfGameId)
        await stageManger.setPhaseResult(playUrl, playerToken, phaseResult)
        return null
    })

RedisCall.handle<SendBackPlayer.IReq, SendBackPlayer.IRes>(SendBackPlayer.name,
    async ({elfGameId, playUrl, playerToken, phaseResult, nextPhaseKey}) => {
        const stageManger = await StateManager.getManager(elfGameId)
        await stageManger.sendBackPlayer(playUrl, playerToken, nextPhaseKey, phaseResult)
        return {sendBackUrl: buildPlayUrl(elfGameId, playerToken)}
    })


