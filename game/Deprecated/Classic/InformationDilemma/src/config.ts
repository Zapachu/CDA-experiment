export const namespace = 'InformationDilemma'

export enum MoveType {
  shout = 'shout',
  getPosition = 'getPosition'
}

export enum PushType {
  newRoundTimer
}

export enum PlayerStatus {
  prepared,
  timeToShout,
  shouted,
  gameOver
}

export enum Balls {
  red,
  blue
}

export const NEW_ROUND_TIMER = 3
