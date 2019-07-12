import {IBaseGame, IGame, IGameWithId} from '@common'
import {GameModel} from '@server-model'

export class GameService {
    static async getGameList(owner: string, page: number, pageSize: number): Promise<{ gameList: Array<IGameWithId>, count: number }> {
        const count = await GameModel.countDocuments({owner})
        const _gameList = await GameModel.find({owner}).sort('-createAt').skip(page * pageSize).limit(pageSize),
            gameList = _gameList.map(({id, title, desc, namespace, params}) => ({
                id,
                title,
                desc,
                namespace,
                params
            }))
        return {count, gameList}
    }

    static async saveGame(game: IBaseGame | IGame): Promise<string> {
        const {id} = await new GameModel(game).save()
        return id
    }

    static async getGame(gameId: string): Promise<IGameWithId> {
        const {id, title, desc, owner, namespace, params} = await GameModel.findById(gameId)
        return {id, title, desc, namespace, params, owner}
    }
}
