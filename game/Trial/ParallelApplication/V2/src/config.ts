export { namespace } from '../bespoke.json'

export enum SceneName {
  boot = 'boot',
  start = 'start',
  chose = 'chose',
  confirm = 'confirm',
  match = 'match',
  result = 'result'
}

export const CONFIG = {
  groupSize: 10,
  universities: [
    { name: '北京大学', quota: 9 },
    { name: '清华大学', quota: 10 },
    { name: '中国人民大学', quota: 11 },
    { name: '复旦大学', quota: 12 },
    { name: '上海交通大学', quota: 13 },
    { name: '浙江大学', quota: 14 },
    { name: '南京大学', quota: 15 },
    { name: '武汉大学', quota: 16 },
    { name: '华中科技大学', quota: 17 },
    { name: '南开大学', quota: 18 },
    { name: '厦门大学', quota: 19 },
    { name: '中山大学', quota: 20 }
  ]
}

export enum MoveType {
  init,
  toChose,
  toConfirm,
  reChose,
  toMatch
}

export enum PushType {
  match,
  apply
}

export interface ICreateParams {}

export interface IMoveParams {
  applications: number[]
}

export interface IPushParams extends IMoveParams, IPlayerState {
  universityIndex: number
  applicationIndex: number
}

export interface IGameState {
  playerNum: number
  playerSubmit: boolean[]
  quota: number[]
}

export enum PlayerStatus {}

export interface IPlayerState {
  rank: number
  scene: SceneName
  score: number[]
  candidateNumber: string
  applications: number[]
  offer: number
}
