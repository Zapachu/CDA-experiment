import {IBaseGame, IGameWithId, IGameToUpdate, IGame} from '@common'
import {GameModel} from '@server-model'

export class GameService {
    static async getGameList(owner: string): Promise<Array<IGameWithId>> {
        const gameList = await GameModel.find({owner}).sort('-createAt').limit(12)
        return gameList.map(({id, title, desc, published, phaseConfigs, mode}) => ({
            id,
            title,
            desc,
            published,
            phaseConfigs,
            mode
        }))
    }

    static async saveGame(game: IBaseGame | IGame): Promise<string> {
        const {id} = await new GameModel(game).save()
        return id
    }

    static async getGame(gameId: string): Promise<IGameWithId> {
        const {id, title, desc, phaseConfigs, owner, published, mode} = await GameModel.findById(gameId)
        return {id, title, desc, phaseConfigs, owner, published, mode}
    }

    static async updateGame(gameId: string, toUpdate: IGameToUpdate): Promise<IGameWithId> {
        const game = await GameModel.findById(gameId)
        Object.entries(toUpdate).forEach(([key, val]) => game[key] = val)
        const updatedGame = await game.save()
        return {
            id: updatedGame.id,
            owner: updatedGame.owner,
            title: updatedGame.title,
            desc: updatedGame.desc,
            phaseConfigs: updatedGame.phaseConfigs,
            published: updatedGame.published,
            mode: updatedGame.mode
        }
    }
}