import {PhaseStatus, PlayerStatus, Actor, AcademusRole} from './baseEnum'
import {Socket} from 'socket.io-client'

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
    token: string
    type: Actor
}


export interface IPhaseConfig<ICreateParam = {}> {
    namespace: string
    key: string
    title: string
    param: ICreateParam
    suffixPhaseKeys: Array<string>
}

export interface IPhaseState {
    key: string
    status: PhaseStatus
    playUrl?: string
    playerStatus: {
        [code: string]: PlayerStatus
    }
}

export interface IBaseGroup {
    gameId: string
    title: string
    desc: string
    owner?: string
}

export interface IBaseGroupWithId extends IBaseGroup {
    id: string
}

export interface IGroup extends IBaseGroup {
    phaseConfigs: Array<IPhaseConfig<{}>>,
}

export interface IGroupWithId extends IGroup {
    id: string
}

export interface IGame {
    owner?: string
    title: string
    desc: string
}

export interface IPlayer {
    groupId: string
    userId: string
}

export interface IPlayerWithId {
    id: string
}

export interface IGameWithId extends IGame {
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
    playerId:string,
    userId:string,
    name:string
}>
//endregion