import * as React from "react"
import classNames from 'classnames'

export {Request as Api} from './request'
export {loadScript} from './fileLoader'
export {Lang, languageNames} from './language'

export function getCookie(key: string) {
    return getCookies().find(str => str.startsWith(`${key}=`)).substring(key.length + 1)
}

export function getCookies() {
    return decodeURIComponent(document.cookie).split('; ')
}

export function genePhaseKey(): string {
    let res = ''
    while (res.length<3){
        res+=String.fromCharCode(~~(Math.random() * 26) + 65)
    }
    return res
}

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

export function clsNames(...classes: Array<string>): string {
    return classNames(classes)
}