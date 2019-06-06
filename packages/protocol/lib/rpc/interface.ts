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

export namespace SetPhaseResult {
    export const name = 'Elf:SetPhaseResult'

    export interface IPhaseResult {
        uniKey?: string
        point?: string
        detailIframeUrl?: string
    }

    export interface IReq {
        elfGameId: string
        playUrl: string
        playerToken: string
        phaseResult?: IPhaseResult
    }

    export type IRes = null
}

export namespace SendBackPlayer {
    export const name = 'Elf:SendBackPlayer'

    export interface IReq extends SetPhaseResult.IReq {
        nextPhaseKey?: string
    }

    export interface IRes {
        sendBackUrl: string
    }
}
