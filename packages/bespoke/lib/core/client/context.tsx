import {createContext} from 'react'
import * as React from 'react'
import {IGameTemplate} from 'client-vendor'

export const connCtx = <C extends {}>(Context: React.Context<C>) =>
    <P, S>(ComponentClass: React.ComponentClass<P & C, S>) => {
        const ConsumerWrapper: React.SFC = (props: P) =>
            <Context.Consumer>
                {
                    (context: C) =>
                        <ComponentClass {...context} {...props}/>
                }
            </Context.Consumer>
        return ConsumerWrapper as any
    }

//region root
export type TRootCtx = Partial<{
    gameTemplate: IGameTemplate
    switchGameTemplate: (namespace: string) => Promise<void>
}>
export const rootContext = createContext<TRootCtx>({})
//endregion