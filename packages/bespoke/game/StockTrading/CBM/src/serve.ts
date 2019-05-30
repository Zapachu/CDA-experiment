import {resolve} from 'path'
import {namespace} from './config'
import {Server, RedisCall, gameId2PlayUrl} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {ICreateParams, CONFIG} from './config'
import {CreateGame, Phase} from 'bespoke-game-stock-trading-config'

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller, Robot}
)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>(namespace, {
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            prepareTime: CONFIG.prepareTime,
            tradeTime: CONFIG.tradeTime
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(namespace, gameId, key))}
})