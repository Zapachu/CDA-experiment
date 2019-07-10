export interface IGroupParams {
    roundParams: Array<{
        K: number
        playerInitialMoney: Array<number>
    }>
}

export interface ICreateParams {
    group: number;
    groupSize: number;
    round: number;
    groupParams?: Array<IGroupParams>
}

export interface IMoveParams {
    money: number;
}

export interface IPushParams {
    roundIndex: number;
    newRoundTimer: number;
}

export interface IGroupState {
    roundIndex: number;
    rounds?: Array<IGroupRoundState>
    playerNum: number;
}

export interface IGroupRoundState {
    playerStatus: number[]
    returnMoney?: number
}

export interface IGameState {
    groups: Array<IGroupState>
    logs: [number, number, number, number, number][]
}

export interface IPlayerState {
    groupIndex: number;
    positionIndex: number;
    rounds?: Array<{
        initialMoney: number;
        submitMoney?: number;
    }>
}