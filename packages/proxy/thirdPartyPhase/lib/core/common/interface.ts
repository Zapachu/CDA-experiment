import {Socket} from 'socket.io-client'

export type TSocket = typeof Socket

export interface IPhase<CP> {
    groupId: string
    namespace: string
    param: CP
}

export interface IPhaseWithId<CP> extends IPhase<CP> {
    id: string
}

export interface IPhaseConfig<ICreateParam> {
    namespace: string
    key: string
    param: ICreateParam
    suffixPhaseKeys: Array<string>
}

export namespace NSocket {
    export interface OnlineRes {
        id: string
        groupId: string
        namespace: string
        jsUrl: string
    }
}
