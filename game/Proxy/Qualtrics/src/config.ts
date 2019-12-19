export { namespace } from '../bespoke.json'

export enum MoveType {
  getIndex = 'getIndex'
}

export enum PushType {}

export interface IMoveParams {}

export interface IPushParams {}

export interface ICreateParams {
  surveyUrl: string
}

export interface IGameState {
  playerIndex: number
}

export interface IPlayerState {
  playerIndex: number
}

export function getAncademyId(token, index) {
  return `${token}_${index}`
}
