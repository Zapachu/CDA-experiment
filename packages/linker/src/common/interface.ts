import {PhaseStatus, PlayerStatus} from './baseEnum'
import {Socket} from 'socket.io-client'
import {SetPhaseResult} from '@elf/protocol'
import {GameMode} from '@common'
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

export interface IPhaseConfig<ICreateParam = {}> {
    namespace: string
    key: string
    title: string
    param: ICreateParam
    suffixPhaseKeys: Array<string>
}

export interface IPlayerState {
    actor: ILinkerActor
    status: PlayerStatus
    phaseResult?: SetPhaseResult.IPhaseResult
}

export interface IPhaseState {
    key: string
    status: PhaseStatus
    playUrl?: string
    playerState: {
        [playerToken: string]: IPlayerState
    }
}

export interface IBaseGame {
    title: string
    desc: string
    owner?: string
    orgCode?: string
    published?: boolean
    mode: GameMode
}

export interface IBaseGameWithId extends IBaseGame {
    id: string
}

export interface IGame extends IBaseGame {
    phaseConfigs: Array<IPhaseConfig<{}>>,
}

export interface IGameWithId extends IGame {
    id: string
}

export interface IPlayer {
    gameId: string
    userId: string
    reward: string
    result?: SetPhaseResult.IPhaseResult
}

export interface IPlayerWithId {
    id: string
}

export interface IGameState {
    gameId: string,
    phaseStates: Array<IPhaseState>
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
