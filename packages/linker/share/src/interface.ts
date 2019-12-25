import { AcademusRole } from '@elf/share'

export interface IUser {
  orgCode: string
  password: string
  role: AcademusRole
  name: string
  mobile: number
}

export interface IUserWithId extends IUser {
  id: string
}

export interface IBaseGame {
  title: string
  desc: string
  playUrl?: string
  owner?: string
  orgCode?: string
  createAt?: string
}

export interface IBaseGameWithId extends IBaseGame {
  id: string
}

export interface IGame<ICreateParam = {}> extends IBaseGame {
  namespace: string
  params: ICreateParam
}

export interface IGameWithId extends IGame {
  id: string
}

export interface IPlayer {
  gameId: string
  userId: string
  token: string
  reward: string
}

export interface IPlayerWithId extends IPlayer {
  id: string
}
