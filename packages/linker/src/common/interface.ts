import {PhaseStatus, PlayerStatus} from './baseEnum'
import {Socket} from 'socket.io-client'
import {Linker} from '@elf/protocol'
import {AcademusRole, Actor, IActor} from '@elf/share'

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
    status: PlayerStatus
    result?: Linker.Result.IResult
}

export interface IBaseGame {
    title: string
    desc: string
    owner?: string
    orgCode?: string
}

export interface IBaseGameWithId extends IBaseGame {
    id: string
}

export interface IGame<ICreateParam = {}> extends IBaseGame {
    namespace: string
    param: ICreateParam
}

export interface IGameWithId extends IGame {
    id: string
}

export interface IPlayer {
    gameId: string
    userId: string
    reward: string
    result?: Linker.Result.IResult
}

export interface IPlayerWithId {
    id: string
}

export interface IGameState{
    gameId: string,
    status: PhaseStatus
    playUrl?: string
    playerState: {
        [playerToken: string]: IPlayerState
    }
}

export namespace NFrame {
    export enum UpFrame {
        joinRoom = 'joinRoom',
        leaveRoom = 'leaveRoom'
    }

    export enum DownFrame {
        syncGameState = 'joinRoom'
    }

    export interface BaseUpFrame {
        userId: string
        gameId: string
    }

    export interface JoinRoom extends BaseUpFrame {
    }

    export interface JoinFirstPhase extends BaseUpFrame {
    }

    export interface SyncGameState {
        gameState: IGameState
    }
}

//region Api
export type TApiPlayers = Array<{
    playerId: string,
    userId: string,
    name: string
}>
//endregion
