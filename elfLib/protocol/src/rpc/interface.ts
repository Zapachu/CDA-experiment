//region Elf
export namespace PhaseReg {
    export const intervalSeconds = 10
    export const key = namespace=>`Elf:PhaseReg:${namespace}`

    export interface IRegInfo {
        namespace: string
        jsUrl: string
    }
}

export namespace NewPhase {
    export const name = namespace => `Elf:NewPhase:${namespace}`

    export interface IReq {
        elfGameId: string
        namespace: string
        param: string//JSON string
        owner: string
    }

    export interface IRes {
        playUrl: string
    }
}

export namespace SetPlayerResult {
    export const name = 'Elf:SetPlayerResult'

    export interface IResult {
        uniKey?: string
        point?: number
        detailIframeUrl?: string
    }

    export interface IReq {
        elfGameId: string
        playUrl: string
        playerToken: string
        result?: IResult
    }

    export type IRes = null
}
//endregion

//region Trial
export namespace CreateGame {
    export const name = (namespace:string)=>`Trial:${namespace}:CreateGame`
    export const playerLimit = 12

    export interface IReq {
        keys: string[]
    }

    export interface IRes {
        playUrls: string[]
    }
}

export namespace GameOver{
    export const name = 'Trial:GameOver'

    export interface IReq {
        playUrl: string
        onceMore: boolean
        namespace: string
    }

    export interface IRes {
        lobbyUrl: string
    }
}
//endregion
