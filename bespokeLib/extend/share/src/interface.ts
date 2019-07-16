export interface ICreateParams<IGroupParams> {
    group: number
    groupSize: number
    groupsParams: IGroupParams[]
}

export interface IGameState<IGameGroupState> {
    groups: Array<{
        playerNum: number
        state: IGameGroupState
    }>
}

export interface IPlayerState<IPlayerGroupState> {
    groupIndex: number
    state: IPlayerGroupState
}