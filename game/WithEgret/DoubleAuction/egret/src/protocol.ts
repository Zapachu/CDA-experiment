const namespace = 'EgretDoubleAuction'

const Config = {
  ROUND: 3,
  PREPARE_TIME: 5,
  TRADE_TIME: 120,
  RESULT_TIME: 10,
  PLAYER_NUM: 6
}

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
  getIndex = 'getIndex',
  shout = 'shout',
  onceMore = 'onceMore'
}

enum PushType {
  beginRound
}

interface ICreateParams {}

interface IMoveParams {
  price: number
}

interface IPushParams {
  round: number
}

interface IGameState {
  prepareTime: number
  roundIndex: number
  rounds: IGameRoundState[]
  playerIndex: number
  scene: GameScene
}

interface IShout {
  role: Role
  price: number
  traded?: boolean
}

interface ITrade {
  reqIndex: number
  resIndex: number
  price: number
}

interface IGameRoundState {
  time: number
  shouts: IShout[]
  trades: ITrade[]
}

interface IPlayerState {
  role: Role
  privatePrices: number[]
  index: number
  profits: number[]
}
