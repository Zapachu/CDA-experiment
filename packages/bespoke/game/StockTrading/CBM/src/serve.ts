import {resolve} from 'path'
import {namespace} from './config'
import {Server, RedisCall, gameId2PlayUrl} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {ICreateParams} from './config'
import {CreateGame, Phase} from '../../protocol'

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller, Robot}
)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>(namespace, {
        title: `${Phase.CBM}:${Math.random()}`,
        desc: '',
        params: {
            prepareTime: 15,
            tradeTime: 180
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(namespace, gameId, key))}
})