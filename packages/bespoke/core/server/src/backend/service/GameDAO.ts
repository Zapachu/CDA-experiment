import {
    TGameState,
    IGameWithId,
    TPlayerState
} from 'bespoke-common'
import {elfSetting} from 'elf-setting'
import {cacheResult, Log, redisClient, RedisKey} from '../util'
import {GameModel, GameDoc} from '../model'

export default class GameDAO {

    @cacheResult
    static async getGame<ICreateParams>(gameId: string): Promise<IGameWithId<ICreateParams>> {
        const {id, owner, namespace, title, desc, params, elfGameId} = <GameDoc<ICreateParams>>await GameModel.findById(gameId)
        return {
            id,
            owner: owner.toString(),
            namespace,
            title,
            desc,
            params,
            elfGameId
        }
    }

    //region persist state
    static saveGameState(gameId: string, gameState: TGameState<any>) {
        elfSetting.inProductEnv && redisClient.set(RedisKey.gameState(gameId), JSON.stringify(gameState)).catch(reason => Log.e(reason))
    }

    static savePlayerState(gameId: string, token: string, playerState: TPlayerState<any>) {
        elfSetting.inProductEnv && redisClient.set(RedisKey.playerState(gameId, token), JSON.stringify(playerState)).catch(reason => Log.e(reason))
    }

    static async queryGameState<IGameState>(gameId: string): Promise<TGameState<IGameState>> {
        return JSON.parse(await redisClient.get(RedisKey.gameState(gameId)))
    }

    static async queryPlayerState<IPlayerState>(gameId: string, token: string): Promise<TPlayerState<IPlayerState>> {
        return JSON.parse(await redisClient.get(RedisKey.playerState(gameId, token)))
    }

    static async getPlayerTokens(gameId: string): Promise<Array<string>> {
        const key = RedisKey.playerStates(gameId)
        const tokens = await redisClient.keys(key)
        return tokens.map(token => token.slice(key.length - 1))
    }

    //endregion
}
