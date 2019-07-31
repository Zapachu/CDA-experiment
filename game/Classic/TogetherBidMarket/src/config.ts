export const namespace = "TogetherBidMarket";

export enum MoveType {
  shout = "shout",
  getPosition = "getPosition",
  nextRound = "nextRound"
}

export enum PushType {
  dealTimer,
  newRoundTimer
}

export enum PlayerStatus {
  prepared,
  shouted,
  result
}

export const NEW_ROUND_TIMER = 3;

export interface ICreateParams {
  groupSize: number;
  rounds: number;
  positions: Array<{
    role: number;
    privateValues: Array<number>;
    startingPrices: Array<number>;
    startingQuotas: Array<number>;
  }>;
}

export interface IMoveParams {
  roundIndex: number;
  price: number;
  num: number;
  nextRoundIndex: number;
}

export interface IPushParams {
  shoutTime: number;
  newRoundTimer: number;
  roundIndex: number;
}

export interface IGroupState {
  roundIndex: number;
  rounds: Array<IGameRoundState>;
  playerNum: number;
}

export interface IGameRoundState {
  strikePrice: number;
  strikeNum: number;
}

export interface IGameState {
  groups: Array<IGroupState>;
}

export interface IPlayerRoundState {
  status: number;
  startingPrice: number;
  startingQuota: number;
  privateValue: number;
  price: number;
  bidNum: number;
  actualNum: number;
  profit: number;
}

export interface IPlayerState {
  groupIndex: number;
  positionIndex: number;
  role: number;
  rounds: Array<IPlayerRoundState>;
}
