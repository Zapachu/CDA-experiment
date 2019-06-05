import {resolve} from 'path'
import {ICreateParams, namespace} from './config'
import {gameId2PlayUrl, RedisCall, Server} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {CreateGame, Phase} from 'bespoke-game-stock-trading-config'

Server.start(
    {namespace, staticPath: resolve(__dirname, '../dist')},
    {Controller, Robot}
)

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            allowLeverage: false
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})
RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM_Leverage), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            allowLeverage: true
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})