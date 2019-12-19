export { namespace } from '../bespoke.json'

export enum MoveType {
  join = 'join',
  shout = 'shout',
  result = 'result',
  back = 'back',
  checkVersion = 'checkVersion'
}

export enum PushType {
  robotShout,
  shoutTimer
}

export interface ICreateParams {
  groupSize: number
}

export interface IMoveParams {
  schools: Array<SCHOOL>
  onceMore: boolean
}

export interface IPushParams {
  shoutTime: number
}

export interface IGameState {
  sortedPlayers: Array<{
    token: string
    schools: Array<SCHOOL>
    score: number
    admission: SCHOOL
  }>
}

export interface IPlayerState {
  score: number
  scores: Array<number>
  schools: Array<SCHOOL>
  admission: SCHOOL
  userId: string
}

export const SHOUT_TIMER = 60
export const APPLICATION_NUM = 3

export enum SCHOOL {
  none = 0,
  beijingUni,
  qinghuaUni,
  renminUni,
  fudanUni,
  shangjiaoUni,
  zhejiangUni,
  nanjingUni,
  wuhanUni,
  huakeUni,
  nankaiUni,
  xiamenUni,
  zhongshanUni
}

export const SCHOOL_NAME = {
  [SCHOOL.beijingUni]: '北京大学',
  [SCHOOL.qinghuaUni]: '清华大学',
  [SCHOOL.renminUni]: '中国人民大学',
  [SCHOOL.fudanUni]: '复旦大学',
  [SCHOOL.shangjiaoUni]: '上海交通大学',
  [SCHOOL.zhejiangUni]: '浙江大学',
  [SCHOOL.nanjingUni]: '南京大学',
  [SCHOOL.wuhanUni]: '武汉大学',
  [SCHOOL.huakeUni]: '华中科技大学',
  [SCHOOL.nankaiUni]: '南开大学',
  [SCHOOL.xiamenUni]: '厦门大学',
  [SCHOOL.zhongshanUni]: '中山大学'
}

export const QUOTA = {
  [SCHOOL.beijingUni]: 1,
  [SCHOOL.qinghuaUni]: 1,
  [SCHOOL.renminUni]: 2,
  [SCHOOL.fudanUni]: 2,
  [SCHOOL.shangjiaoUni]: 2,
  [SCHOOL.zhejiangUni]: 2,
  [SCHOOL.nanjingUni]: 2,
  [SCHOOL.wuhanUni]: 2,
  [SCHOOL.huakeUni]: 2,
  [SCHOOL.nankaiUni]: 2,
  [SCHOOL.xiamenUni]: 3,
  [SCHOOL.zhongshanUni]: 3
}
