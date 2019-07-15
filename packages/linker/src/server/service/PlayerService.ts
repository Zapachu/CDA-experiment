import {PlayerModel} from '../model'
import {TApiPlayers} from 'linker-share'

export class PlayerService {
    static async savePlayer(gameId: string, userId: string): Promise<string> {
        const player = await new PlayerModel({gameId, userId}).save()
        return player.id
    }

    static async findPlayerId(gameId: string, userId: string): Promise<string> {
        const player = await PlayerModel.findOne({gameId, userId})
        return player ? player.id : null
    }

    static async getPlayers(gameId: string):Promise<TApiPlayers> {
        const players = await PlayerModel.find({gameId}).populate('userId', 'name') as any
        return players.map(({id, userId})=>({playerId:id, userId:userId.id, name:userId.name}))
    }
}
