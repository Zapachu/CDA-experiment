export const namespace = 'DoubleAuctionGraphical'

export enum MoveType {
  prepare = 'prepare',
  shout = 'shout',
  deal = 'deal',
  getPosition = 'getPosition'
}

export enum PushType {
  countdown,
  newRoundTimer
}

export enum PlayerStatus {
  outside,
  prepared,
  shouted,
  dealed,
  gameOver
}

export const NEW_ROUND_TIMER = 3
