import { elfSetting } from '@elf/setting'
import { Server, ServerCredentials } from 'grpc'
import { setElfService } from './service/ElfAdmin'
import { Linker, RedisCall } from '@elf/protocol'
import { PlayerModel } from '../model'

export { getAdminService } from './service/ElfAdmin'

export function serve() {
  const server = new Server()
  setElfService(server)
  server.bind(`0.0.0.0:5${elfSetting.linkerPort}`, ServerCredentials.createInsecure())
  server.start()
}

RedisCall.handle<Linker.Result.IReq, Linker.Result.IRes>(
  Linker.Result.name,
  async ({ elfGameId, playerToken, result }) => {
    await PlayerModel.findOneAndUpdate({ gameId: elfGameId, token: playerToken }, { result })
    return null
  }
)
