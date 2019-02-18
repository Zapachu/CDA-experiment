import {
    TGameState,
    IGameWithId,
    TPlayerState
} from '@dev/common'
import {cacheResult, Log, inProductEnv, redisClient, RedisKey} from '../util'
import {GameModel, GameDoc} from '../model'

export default class GameDAO {

    @cacheResult
    static async getGame<ICreateParams>(gameId: string): Promise<IGameWithId<ICreateParams>> {
        const {id, owner, namespace, title, desc, params, groupId} = <GameDoc<ICreateParams>>await GameModel.findById(gameId)
        return {
            id,
            owner: owner.toString(),
            namespace,
            title,
            desc,
            params,
            groupId
        }
    }

    //region persist state
    static saveGameState(gameId: string, gameState: TGameState<any>) {
        inProductEnv && redisClient.set(RedisKey.gameState(gameId), JSON.stringify(gameState)).catch(reason => Log.e(reason))
    }

    static savePlayerState(gameId: string, token: string, playerState: TPlayerState<any>) {
        inProductEnv && redisClient.set(RedisKey.playerState(gameId, token), JSON.stringify(playerState)).catch(reason => Log.e(reason))
    }

    static async queryGameState<IGameState>(gameId: string): Promise<TGameState<IGameState>> {
        return JSON.parse(await redisClient.get(RedisKey.gameState(gameId)))
    }

    static async queryPlayerState<IPlayerState>(gameId: string, token: string): Promise<TPlayerState<IPlayerState>> {
        return JSON.parse(await redisClient.get(RedisKey.playerState(gameId, token)))
    }

    //endregion
}