export const namespace = 'ParallelApplicationV2'

export const CONFIG = {
  universities: [
    '北京大学',
    '清华大学',
    '中国人民大学',
    '复旦大学',
    '上海交通大学',
    '浙江大学',
    '南京大学',
    '武汉大学',
    '华中科技大学',
    '南开大学',
    '厦门大学',
    '中山大学'
  ]
}

export enum MoveType {}

export enum PushType {}

export interface ICreateParams {}

export interface IMoveParams {}

export interface IPushParams extends IMoveParams, IPlayerState {}

export interface IGameState {}

export enum PlayerStatus {}

export interface IPlayerState {}
