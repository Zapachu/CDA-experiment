export const namespace = 'ParallelApplicationV2'

export enum SceneName {
  boot = 'boot',
  chose = 'chose',
  confirm = 'confirm',
  match = 'match',
  result = 'result'
}

export const CONFIG = {
  universities: [
    { name: '北京大学', quota: 10 },
    { name: '清华大学', quota: 10 },
    { name: '中国人民大学', quota: 10 },
    { name: '复旦大学', quota: 10 },
    { name: '上海交通大学', quota: 10 },
    { name: '浙江大学', quota: 10 },
    { name: '南京大学', quota: 10 },
    { name: '武汉大学', quota: 10 },
    { name: '华中科技大学', quota: 10 },
    { name: '南开大学', quota: 10 },
    { name: '厦门大学', quota: 10 },
    { name: '中山大学', quota: 10 }
  ]
}

export enum MoveType {
  toChose,
  toConfirm,
  reChose,
  toMatch
}

export enum PushType {}

export interface ICreateParams {}

export interface IMoveParams {
  applications: number[]
}

export interface IPushParams extends IMoveParams, IPlayerState {}

export interface IGameState {}

export enum PlayerStatus {}

export interface IPlayerState {
  scene: SceneName
  score: number[]
  candidateNumber: string
  applications: number[]
  offer: number
}
