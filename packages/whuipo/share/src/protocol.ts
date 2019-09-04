export enum Phase {
    IPO = 'IPO',
    OpenAuction = 'OpenAuction',
    TBM = 'TBM',
    CBM = 'CBM'
}

export namespace NCreateParams {
    export enum IPOType {
        Median,
        TopK,
        FPSBA
    }

    export enum CBMRobotType {
        normal,
        zip,
        gd,
    }

    interface IBaseCreateParams {
        onceMoreSuffix?: string
    }

    export interface IPO extends IBaseCreateParams {
        type: IPOType
    }

    export interface TBM extends IBaseCreateParams {
        groupSize: number;
        buyerCapitalMin: number;
        buyerCapitalMax: number;
        buyerPrivateMin: number;
        buyerPrivateMax: number;
        sellerQuotaMin: number;
        sellerQuotaMax: number;
        sellerPrivateMin: number;
        sellerPrivateMax: number;
    }

    export interface CBM extends IBaseCreateParams {
        allowLeverage: boolean
        robotType: CBMRobotType
        robotCD: number
    }

    export interface OpenAuction extends IBaseCreateParams {

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
    reqStartGame = 'reqStartGame',
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
    score: number
}

export namespace NSocketParam {
    export interface StartGame {
        multiPlayer: boolean,
        phase: Phase,
        params
    }
}

export namespace iLabX {
    export enum ResCode {
        success = 0,
        invalidInput = 3,
        errorPwd = 4,
        errorUserName = 5
    }
}