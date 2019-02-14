import {createContext} from 'react'
import {IUserWithId, IGroupState, IGroupWithId, TSocket, IActor} from "@common"

export type TRootContext = Partial<{
    user:IUserWithId
}>

export const rootContext = createContext<TRootContext>({})

export type TPlayContext = Partial<{
    group: IGroupWithId
    actor: IActor
    groupState: IGroupState
    socketClient: TSocket
}>

export const playContext = createContext<TPlayContext>({})