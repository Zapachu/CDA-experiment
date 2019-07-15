import {Lang} from '@client-util'
import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {IPhaseTemplate} from '@elf/register'

require('./initial.scss')

export {Lang} from '@client-util'

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export function registerOnElf(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplates[namespace] = {namespace, Create: () => null, ...phaseTemplate}
}

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.activeLanguage}/>, rootContainer)
})
