export enum Phase {
    IPO_Median = 'IPO_Median',
    IPO_TopK = 'IPO_TopK',
    IPO_FPSBA = 'IPO_FPSBA',
    OpenAuction = 'OpenAuction',
    TBM = 'TBM',
    CBM = 'CBM',
    CBM_L = 'CBM_L',
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

    export interface OpenAuction extends IBaseCreateParams {
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

    export const TBMDefaultParams: TBM = {
        groupSize: 12,
        buyerCapitalMin: 50000,
        buyerCapitalMax: 100000,
        buyerPrivateMin: 65,
        buyerPrivateMax: 80,
        sellerQuotaMin: 1000,
        sellerQuotaMax: 2000,
        sellerPrivateMin: 30,
        sellerPrivateMax: 45,
    };

    export interface CBM extends IBaseCreateParams {
        allowLeverage: boolean
        robotType: CBMRobotType
        robotCD: number
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
        multiPlayer: boolean
        phase: Phase
        force: boolean
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