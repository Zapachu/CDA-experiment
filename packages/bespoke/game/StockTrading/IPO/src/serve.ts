import {resolve} from 'path'
import {Server, RedisCall, gameId2PlayUrl} from 'bespoke-server'
import Controller from './Controller'
import {namespace, IPOType} from './config'
import {ICreateParams} from './interface'
import Robot from './Robot'
import {CreateGame, Phase, PhaseDone} from '../../protocol'

Server.start({
    namespace,
    staticPath: resolve(__dirname, '../dist')
}, {Controller, Robot})

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.IPO_TopK), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>(namespace, {
        title: `${Phase.IPO_TopK}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.TopK
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(namespace, gameId, key))}
})
RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.IPO_Median), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>(namespace, {
        title: `${Phase.IPO_Median}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            groupSize: 6,
            total: 10000,
            type: IPOType.Median
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(namespace, gameId, key))}
})