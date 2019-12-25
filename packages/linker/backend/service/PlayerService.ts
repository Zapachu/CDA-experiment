import { GameModel, PlayerModel, UserModel } from '../model'
import { IPlayerWithId } from 'linker-share'
import { Token } from '@elf/util'

export class PlayerService {
  static async savePlayer(gameId: string, userId: string): Promise<string> {
    const user = await UserModel.findById(userId)
    if (!user.orgCode) {
      const { owner } = await GameModel.findById(gameId),
        { orgCode, orgName } = (await UserModel.findById(owner)) as any
      await UserModel.findByIdAndUpdate(userId, { orgCode, orgName })
    }
    const token = Token.geneToken(`${gameId}_${userId}`)
    const player = await new PlayerModel({ gameId, userId, token }).save()
    return player.id
  }

  static async findPlayer(gameId: string, userId: string): Promise<IPlayerWithId> {
    const player = await PlayerModel.findOne({ gameId, userId }).lean()
    if (!player) {
      return null
    }
    return { ...player, id: player._id }
  }
}
