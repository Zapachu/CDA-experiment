export enum Phase {
    IPO,
    OpenAuction,
    TBM,
    CBM
}

const NAMESPACE_PREFIX = 'stockTrade:'

export function phaseToNamespace(phase: Phase) {
    return `${NAMESPACE_PREFIX}${phase}`
}

export function namespaceToPhase(namespace: string): Phase {
    return +namespace.replace(NAMESPACE_PREFIX, '')
}

export namespace NspCreateParams{
    export enum IPOType {
        Median,
        TopK,
        FPSBA
    }
    export interface IPO {
        type: IPOType
    }
    export interface TBM {

    }

    export enum CBMRobotType {
        random,
        zip
    }
    export interface CBM {
        allowLeverage: boolean
        robotType: CBMRobotType
        robotCD:number
    }

    export interface OpenAuction {

    }
}