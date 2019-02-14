import {GameModel, GroupModel} from '@server-model'
import {IGameWithId} from '@common'

export class GameService {
    static async getGame(gameId:string):Promise<IGameWithId>{
        const {id, owner, title, desc} = await GameModel.findById(gameId)
        return {id, owner, title, desc}
    }

    static async getGameList(owner: string): Promise<Array<IGameWithId>> {
        const gameList = await GameModel.find({owner})
        return gameList.map(({id, title, desc}) => ({id, title, desc}))
    }

    static async saveGame(owner: string, title: string, desc: string): Promise<string> {
        const game = await new GameModel({owner, title, desc}).save()
        return game.id
    }

    static async getGroupList(gameId: string): Promise<Array<IGameWithId>> {
        const groupList = await GroupModel.find({gameId})
        return groupList.map(({id, title, desc}) => ({id, title, desc}))
    }
}