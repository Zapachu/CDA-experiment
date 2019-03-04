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
        [playerToken: string]: PlayerStatus
    },
    playerPoint:{
        [playerToken:string]:number
    }
}

export interface IBaseGame {
    title: string
    desc: string
    owner?: string
    published?: boolean
    mode: string
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
    playerId:string,
    userId:string,
    name:string
}>
//endregion