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
    const gameId = await Server.newGame<ICreateParams>(namespace, {
        title: `${Phase.CBM}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            allowLeverage: true
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(namespace, gameId, key))}
})