export const namespace = 'FirstPriceSealed'

export enum MoveType {
  shout = 'shout',
  getPosition = 'getPosition'
}

export enum PushType {
  newRoundTimer
}

export enum PlayerStatus {
  prepared,
  shouted,
  gameOver
}

export const NEW_ROUND_TIMER = 3
