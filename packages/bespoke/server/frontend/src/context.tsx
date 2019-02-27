import {createContext} from 'react'
import * as React from 'react'
import {IGameTemplate} from 'bespoke-client'

export const connCtx = <C extends {}>(Context: React.Context<C>) =>
    <P, S>(ComponentClass: React.ComponentClass<any, S>) => {
        const ConsumerWrapper: React.FunctionComponent = (props: P) =>
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
}>
export const rootContext = createContext<TRootCtx>({})
//endregion