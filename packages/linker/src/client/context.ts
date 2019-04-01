import {createContext} from 'react'
import {IUserWithId, IGameState, IGameWithId, TSocket, IActor} from "@common"

export type TRootContext = Partial<{
    user:IUserWithId
}>

export const rootContext = createContext<TRootContext>({})

export type TPlayContext = Partial<{
    game: IGameWithId
    actor: IActor
    gameState: IGameState
    socketClient: TSocket
}>

export const playContext = createContext<TPlayContext>({})
