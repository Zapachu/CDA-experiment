
export interface UserDoc {
    updateAt: number;
    createAt: number;
    unionId: string,
    status: UserGameStatus,
    nowJoinedGame?: GameTypes,
    playerUrl?: string,
}

export enum UserGameStatus {
    beforeStart,
    waittingMatch,
    started,
    end
}

export enum GameTypes {
    tbm,
    cbm,
    ipo
}

export enum ResCode {
    success = 0,
    unexpectError = -1
}

export enum serverSocketListenEvents {
    reqStartGame = 'reqStartGame'
}

export enum clientSocketListenEvnets {
    startGame = 'startGame'
}