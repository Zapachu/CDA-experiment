import {elfSetting} from '@elf/setting'
import {Server, ServerCredentials} from 'grpc'
import {setElfService} from './service/ElfAdmin'
import {RedisCall, Linker} from '@elf/protocol'
import {StateManager} from '@server-service'

export {getAdminService} from './service/ElfAdmin'

export function serve() {
    const server = new Server()
    setElfService(server)
    server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
    server.start()
}

RedisCall.handle<Linker.Result.IReq, Linker.Result.IRes>(Linker.Result.name,
    async ({elfGameId, playerToken, result}) => {
        const stageManger = await StateManager.getManager(elfGameId)
        await stageManger.setPlayerResult(playerToken, result)
        return null
    })


