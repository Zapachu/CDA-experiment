export const namespace = 'PublicGoods'

export enum MoveType {
  getPosition = 'getPosition',
  submit = 'submit'
}

export enum PushType {
  newRoundTimer
}

export enum PlayerStatus {
  prepared,
  submitted,
  result
}

export const NEW_ROUND_TIMER = 5
