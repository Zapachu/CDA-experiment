import {Lang} from '@client-util'

require('./initial.scss')
import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {IPhaseConfig, TPhaseType} from '@common'

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
    type: TPhaseType,
    icon?: string
}

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}


const defaultTemplateIcon = 'data:image/png;base64,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'
export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplate.Create = phaseTemplate.Create || BaseCreate
    phaseTemplate.icon =  phaseTemplate.icon||defaultTemplateIcon
    phaseTemplates[namespace] = phaseTemplate
}

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.languageName}/>, rootContainer)
})
