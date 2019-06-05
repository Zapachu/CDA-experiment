import {resolve} from 'path'
import {Server, RedisCall, gameId2PlayUrl} from 'bespoke-server'
import Controller from './Controller'
import Robot from './Robot'
import {namespace} from './config'
import {CreateGame, Phase} from 'bespoke-game-stock-trading-config'
import {ICreateParams} from "./interface";

Server.start({
    namespace,
    staticPath: resolve(__dirname, '../dist'),
}, {Controller, Robot})

const genRan = () => ~~(Math.random() * (100000 - 1000)) + 2000

RedisCall.handle<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.TBM), async ({keys}) => {
    const gameId = await Server.newGame<ICreateParams>({
        title: `${Phase.TBM}:${new Date().toUTCString()}`,
        desc: '',
        params: {
            groupSize: 6,
            waitingSeconds: 1,
            positions: [
                {role: 0, privatePrice: genRan()},
                {role: 1, privatePrice: genRan()},
                {role: 0, privatePrice: genRan()},
                {role: 1, privatePrice: genRan()},
                {role: 0, privatePrice: genRan()},
                {role: 1, privatePrice: genRan()},
            ],
            InitMoney: 100000,
            buyerPriceStart: 0,
            buyerPriceEnd: 100000,
            sellerPriceStart: 0,
            sellerPriceEnd: 100000,
        }
    })
    return {playUrls: keys.map(key => gameId2PlayUrl(gameId, key))}
})
