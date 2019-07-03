import {Lang} from '@client-util'
import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {IPhaseTemplate} from '@elf/client-sdk'

require('./initial.scss')

export {Lang} from '@client-util'
export {IPhaseConfig, CorePhaseNamespace} from '@common'

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplates[namespace] = phaseTemplate
}

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.languageName}/>, rootContainer)
})
