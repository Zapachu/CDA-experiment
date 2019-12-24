import { IGame, IGameWithId } from 'linker-share'
import { GameModel } from '../model'
import { elfSetting } from '@elf/setting'
import { getAdminService } from '../rpc'
import { Log } from '@elf/util'
import { Linker, RedisCall, redisClient } from '@elf/protocol'
import HeartBeat = Linker.HeartBeat

export class GameService {
  static async saveGame(game: IGame): Promise<string> {
    const { id } = await new GameModel(game).save()
    const { playUrl } = await RedisCall.call<Linker.Create.IReq, Linker.Create.IRes>(
      Linker.Create.name(game.namespace),
      {
        owner: game.owner,
        elfGameId: id,
        params: game.params
      }
    )
    await GameModel.findByIdAndUpdate(id, { playUrl })
    return id
  }

  static async getGame(id: string): Promise<IGameWithId> {
    const game = await GameModel.findById(id).lean()
    return { ...game, id }
  }

  static async getHeartBeats(userId?: string): Promise<Array<HeartBeat.IHeartBeat>> {
    const heartBeats: Array<HeartBeat.IHeartBeat> = []
    const registeredPhaseKeys: Array<string> = await redisClient.keys(HeartBeat.key('*'))
    for (let key of registeredPhaseKeys) {
      heartBeats.push(JSON.parse(await redisClient.get(key)))
    }
    if (!elfSetting.inProductEnv || !userId) {
      return heartBeats
    }
    return new Promise<Array<HeartBeat.IHeartBeat>>(resolve => {
      getAdminService().getAuthorizedTemplates({ userId }, (err, response) => {
        if (err) {
          Log.e(err)
          return resolve([])
        }
        resolve(heartBeats.filter(({ namespace }) => response.namespaces.includes(namespace)))
      })
    })
  }
}
