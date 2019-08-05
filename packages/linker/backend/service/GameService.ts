import {IBaseGame, IGame, IGameWithId} from 'linker-share'
import {GameModel} from '../model'
import {Log} from '@elf/util'
import {elfSetting} from '@elf/setting'
import {getAdminService} from '../rpc'
import {Linker, redisClient} from '@elf/protocol'
import HeartBeat = Linker.HeartBeat

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
            getAdminService().getAuthorizedTemplates({userId}, (err, response) => {
                if (err) {
                    Log.e(err)
                    return resolve([])
                }
                resolve(heartBeats.filter(({namespace}) =>
                    response.namespaces.includes(namespace)
                ))
            })
        })
    }
}
