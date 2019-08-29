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

export namespace NCreateParams{
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

export enum UserGameStatus {
    matching,
    started,
    notStarted
}

export enum ResCode {
    success = 0,
    unexpectError = -1
}

export enum SocketEvent {
    reqStartGame='reqStartGame',
    leaveMatchRoom = 'leaveMatchRoom',
    startMatch = 'startMatch',
    startGame = 'startGame',
    continueGame = 'continueGame',
    handleError = 'handleError'
}

export interface UserDoc {
    updateAt: number;
    createAt: number;
    unionId: string,
    phaseScore: Array<number>
}

export namespace NSocketParam{
    export interface StartGame {
        multiPlayer:boolean,
        phase:Phase,
        params
    }
}