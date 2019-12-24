import { Socket } from 'socket.io-client'
import { AcademusRole, Actor, IActor } from '@elf/share'

export type TSocket = typeof Socket

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

export interface ILinkerActor extends IActor {
  token: string
  type: Actor
  userId: string
  userName: string
  playerId: string
}

export interface IPlayerState {
  actor: ILinkerActor
}

export interface IBaseGame {
  title: string
  desc: string
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
  reward: string
}

export interface IGameState {
  gameId: string
  playUrl?: string
  playerState: {
    [playerToken: string]: IPlayerState
  }
}

export type TApiPlayers = Array<{
  playerId: string
  userId: string
  name: string
}>
