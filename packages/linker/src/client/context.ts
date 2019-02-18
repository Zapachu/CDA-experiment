import {createContext} from 'react'
import {IUserWithId, IGroupState, IGameWithId, TSocket, IActor} from "@common"

export type TRootContext = Partial<{
    user:IUserWithId
}>

export const rootContext = createContext<TRootContext>({})

export type TPlayContext = Partial<{
    game: IGameWithId
    actor: IActor
    groupState: IGroupState
    socketClient: TSocket
}>

export const playContext = createContext<TPlayContext>({})