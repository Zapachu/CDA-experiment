import {PhaseStatus, PlayerStatus, Actor, AcademusRole} from './baseEnum'
import {Socket} from 'socket.io-client'
import {PhaseManager} from 'elf-protocol'
import {baseEnum} from '@common'

export type TPhaseType = 'bespoke' | 'otree' | 'qualtrics' | 'survey'

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

export interface IActor {
    userId: string
    userName: string
    token: string
    type: Actor
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
    actor: IActor
    status: PlayerStatus
    phasePlayer?: PhaseManager.TPhasePlayer
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
    published?: boolean
    mode: baseEnum.GameMode
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

export interface IGameToUpdate {
    // title?: string
    // desc?: string
    phaseConfigs?: Array<IPhaseConfig<{}>>
    published?: boolean
}

export interface IPlayer {
    gameId: string
    userId: string
    reward: string
}

export interface IPlayerWithId {
    id: string
}

export interface IGroupState {
    groupId: string,
    phaseStates: Array<IPhaseState>
}

export namespace NFrame {
    export enum UpFrame {
        joinRoom = 'joinRoom',
        leaveRoom = 'leaveRoom'
    }

    export enum DownFrame {
        syncGroupState = 'joinRoom'
    }

    export interface BaseUpFrame {
        userId: string
        groupId: string
    }

    export interface JoinRoom extends BaseUpFrame {
    }

    export interface JoinFirstPhase extends BaseUpFrame {
    }

    export interface SyncGroupState {
        groupState: IGroupState
    }
}

//region Api
export type TApiGroupPlayers = Array<{
    playerId: string,
    userId: string,
    name: string
}>
//endregion
