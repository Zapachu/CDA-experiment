export enum Phase {
    IPO = 'IPO',
    OpenAuction = 'OpenAuction',
    TBM = 'TBM',
    CBM = 'CBM'
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
        normal,
        zip,
        gd,
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

export namespace iLabX{
    export enum ResCode{
        success = 0,
        invalidInput = 3,
        errorPwd = 4,
        errorUserName = 5
    }
}