import {PlayerModel} from '@server-model'
import {TApiGroupPlayers} from '@common'

export class PlayerService {
    static async savePlayer(gameId: string, userId: string): Promise<string> {
        const player = await new PlayerModel({gameId, userId}).save()
        return player.id
    }

    static async findPlayerId(gameId: string, userId: string): Promise<string> {
        const player = await PlayerModel.findOne({gameId, userId})
        return player ? player.id : null
    }

    static async getPlayers(groupId: string):Promise<TApiGroupPlayers> {
        const players = await PlayerModel.find({groupId}).populate('userId', 'name') as any
        return players.map(({id, groupId, userId})=>({playerId:id, userId:userId.id, name:userId.name}))
    }
}