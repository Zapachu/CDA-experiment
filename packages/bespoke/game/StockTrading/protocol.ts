import {Server, Log, RedisCall, gameId2PlayUrl} from 'bespoke-server'
import {ICreateParams, namespace} from './CBM/src/config'

export enum Phase {
    IPO_Median,
    IPO_TopK,
    TBM,
    CBM
}

export namespace CreateGame {
    export const name = (phase:Phase)=>`StockTrade:${phase}:CreateGame`
    export const playerLimit = 12

    export interface IReq {
        keys: string[]
    }

    export interface IRes {
        playUrls: string[]
    }
}

export namespace PhaseDone{
    export const name = 'StockTrade:PhaseDone'

    export interface IReq {
        playUrl: string
        onceMore: boolean
    }

    export interface IRes {
        lobbyUrl: string
    }
}

export namespace Example{
    export function handle(){
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
    }

    export function call(){
        RedisCall.call<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM), {
            keys: ['playerA', 'playerB']
        }).then(({playUrls}) => {
            Log.d(playUrls)
        })
    }
}

export function reqPlayerUrl (keys){
    return RedisCall.call<CreateGame.IReq, CreateGame.IRes>(CreateGame.name(Phase.CBM), {
        keys
    }).then(({playUrls}) => {
        Log.d(playUrls)
        return playUrls
    })
}