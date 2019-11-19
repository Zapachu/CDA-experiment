export const namespace = 'DelayedReceiveMatch'

export enum MoveType {
  enterMarket = 'enterMarket',
  getPosition = 'getPosition',
  submit = 'submit'
}

export enum PushType {
  newRoundTimer
}

export enum PlayerStatus {
  outside,
  prepared,
  submitted,
  matched
}

export const DEAL_TIMER = 5
export const NEW_ROUND_TIMER = 5
