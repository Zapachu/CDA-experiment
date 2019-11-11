export interface ICreateParams {
    phases: CreateParams.IPhase[]
    nextPhaseKey: string
}

export namespace CreateParams {
    interface IPhase {
        templateName: string
        params: CreateParams.Phase.IParams
    }

    namespace Phase {
        interface IParams {
            participationFee: number
            positions: CreateParams.Phase.Params.IPosition[]
            practicePhase: boolean
            time2ReadInfo: number
            durationOfEachPeriod: number
            unitLists: string[]
            startTime: number[]
        }

        namespace Params {
            interface IPosition {
                role: number
                identity: number
                exchangeRate: number
                k: number
                interval: number
                reactionType: number
            }
        }
    }
}

export interface IGameState {
    gamePhaseIndex: number
    orders: GameState.IOrder[]
    phases: GameState.IGamePhaseState[]
    positionAssigned: boolean
}

export namespace GameState {
    interface IOrder {
        id: number
        positionIndex: number
        unitIndex: number
        price: number
    }

    interface IGamePhaseState {
        marketStage: number
        orderId: number
        buyOrderIds: number[]
        sellOrderIds: number[]
        trades: GameState.GamePhaseState.ITrade[]
        positionUnitIndex: number[]
    }

    namespace GamePhaseState {
        interface ITrade {
            reqId: number
            resId: number
        }
    }
}

export interface IPlayerState {
    token: string
    status: number
    positionIndex: number
    unitLists: string[]
    point: number
    phases: PlayerState.IPlayerPhaseState[]
    seatNumber: number
}

export namespace PlayerState {
    interface IPlayerPhaseState {
        periodProfit?: number
        tradedCount?: number
    }
}

export interface IMoveParams {
    price: number
    unitIndex: number
    gamePhaseIndex: number
    playerPhaseIndex: number
    seatNumber: number
}

export interface IPushParams {
    newOrderId: number
    resOrderId: number
    periodCountDown: number
}
