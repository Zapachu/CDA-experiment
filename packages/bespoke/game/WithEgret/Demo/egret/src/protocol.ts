//region
const ROUND = 3,
    PREPARE_TIME = 5,
    TRADE_TIME = 20,
    RESULT_TIME = 5

enum GameScene {
    prepare,
    trade,
    result
}

enum Role {
    seller,
    buyer
}

enum MoveType {
    getIndex = 'getIndex'
}

enum PushType {
}

interface ICreateParams {
}

interface IMoveParams {
    price: number
}

interface IPushParams {
}

interface IGameState {
    prepareTime: number
    roundIndex: number
    rounds: IGameRoundState[]
    playerIndex: number
    scene: GameScene
}

interface IGameRoundState {
    time:number
    prices: []
}

interface IPlayerState {
    role: Role
    privatePrices: number[]
    index: number
    profits: number[]
}

//endregion