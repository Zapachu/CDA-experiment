import * as React from "react"
export {loadScript} from './fileLoader'
export {FrameEmitter} from './FrameEmitter'
export {Lang} from './language'

export const connCtx = <C extends {}>(Context: React.Context<C>) =>
    <P, S>(ComponentClass: React.ComponentClass<any, S>) => {
        const ConsumerWrapper: React.SFC = (props: P) =>
            <Context.Consumer>
                {
                    (context: C) =>
                        <ComponentClass {...context} {...props}/>
                }
            </Context.Consumer>
        return ConsumerWrapper as any
    }