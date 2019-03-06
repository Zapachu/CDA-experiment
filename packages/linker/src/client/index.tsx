import {Lang} from '@client-util'

require('./initial.scss')
import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {IPhaseConfig} from '@common'

export {Lang} from '@client-util'
export {IPhaseConfig, CorePhaseNamespace} from '@common'

export interface IElfCreateProps<ICreateParam> {
    phases: Array<{
        label: string
        key: string
        namespace: string
    }>
    curPhase: IPhaseConfig<ICreateParam>
    updatePhase: (suffixPhaseKeys: Array<string>, param: Partial<ICreateParam>) => void
    highlightPhases: (phaseKeys: Array<string>) => void
}

export class BaseCreate<ICreateParam, State = ICreateParam> extends React.Component<IElfCreateProps<ICreateParam>, State> {
    render() {
        return null
    }
}

export interface IPhaseTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: typeof BaseCreate
    type: 'bespoke' | 'otree' | 'qualtrics' | 'survey' | 'temp'
    otreeName?: string
}

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplate.Create = phaseTemplate.Create || BaseCreate
    if (phaseTemplate.type === 'otree') {
        phaseTemplates[`otree_${phaseTemplate.otreeName}`] = phaseTemplate
    } else {
        phaseTemplates[namespace] = phaseTemplate
    }
}

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.languageName}/>, rootContainer)
})
