import {IBaseGame, IGame, IGameWithId} from '@common'
import {GameModel} from '@server-model'

export class GameService {
    static async getGameList(owner: string, page: number, pageSize: number): Promise<{ gameList: Array<IGameWithId>, count: number }> {
        const count = await GameModel.countDocuments({owner})
        const _gameList = await GameModel.find({owner}).sort('-createAt').skip(page * pageSize).limit(pageSize),
            gameList = _gameList.map(({id, title, desc, published, phaseConfigs, mode}) => ({
                id,
                title,
                desc,
                published,
                phaseConfigs,
                mode
            }))
        return {count, gameList}
    }

    static async saveGame(game: IBaseGame | IGame): Promise<string> {
        if ((game as IGame).phaseConfigs) {
            game.published = true
        }
        const {id} = await new GameModel(game).save()
        return id
    }

    static async getGame(gameId: string): Promise<IGameWithId> {
        const {id, title, desc, phaseConfigs, owner, published, mode} = await GameModel.findById(gameId)
        return {id, title, desc, phaseConfigs, owner, published, mode}
    }
}
