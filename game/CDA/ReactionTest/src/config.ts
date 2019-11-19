export const namespace = 'ReactionTest'

export enum MoveType {
  //player
  submitSeatNumber = 'submitSeatNumber',
  countReaction = 'countReaction',
  sendBackPlayer = 'sendBackPlayer',
  //owner
  startMainTest = 'startMainTest'
}

export enum PushType {}

export enum GameStage {
  seatNumber,
  mainTest,
  result
}

export enum FetchRoute {
  exportXls = '/exportXls/:gameId'
}

export enum SheetType {
  result = 'result'
}

export interface IResult {
  seatNumber: number
  correctNumber: number
  point: number
}
