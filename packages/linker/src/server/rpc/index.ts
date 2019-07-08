import {elfSetting} from '@elf/setting'
import {Server, ServerCredentials} from 'grpc'
import {setElfService} from './service/ElfAdmin'
import {RedisCall, SetPlayerResult} from '@elf/protocol'
import {StateManager} from '@server-service'

export {getAdminService} from './service/ElfAdmin'

export function serve() {
    const server = new Server()
    setElfService(server)
    server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
    server.start()
}

RedisCall.handle<SetPlayerResult.IReq, SetPlayerResult.IRes>(SetPlayerResult.name,
    async ({elfGameId, playUrl, playerToken, result}) => {
        const stageManger = await StateManager.getManager(elfGameId)
        await stageManger.setPlayerResult(playUrl, playerToken, result)
        return null
    })


