export enum Phase {
    IPO_Median,
    IPO_TopK,
    TBM,
    CBM,
    CBM_Leverage
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
        phase: Phase
    }

    export interface IRes {
        lobbyUrl: string
    }
}