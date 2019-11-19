export const namespace = 'TrustGame'

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
  gameOver,
  memberFull
}

export const NEW_ROUND_TIMER = 3
