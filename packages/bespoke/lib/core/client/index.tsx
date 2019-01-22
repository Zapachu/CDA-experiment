import * as React from 'react'
import {render} from 'react-dom'
import {gameTemplates, Root} from './view'
import {IGameTemplate, Lang} from 'client-vendor'

export type TregisterGame = typeof registerGame

export function registerGame(namespace: string, gameTemplate: IGameTemplate) {
    const Empty = () => null
    gameTemplates[namespace] = {
        namespace,
        Create: Empty,
        Info: Empty,
        Play4Owner: Empty,
        Result: Empty,
        Result4Owner: Empty,
        ...gameTemplate
    }
}

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.activeLanguage}/>, rootContainer)
})