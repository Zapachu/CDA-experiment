import {Lang} from '@client-util'

require('./initial.scss')
import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {IElfCreateProps} from './vendor'

export {Lang} from '@client-util'
export {IPhaseConfig, CorePhaseNamespace} from '@common'

export class BaseCreate<ICreateParam, State = ICreateParam> extends React.Component<IElfCreateProps<ICreateParam>, State> {
    render() {
        return null
    }
}

export interface IPhaseTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: typeof BaseCreate
    type: string
    otreeName?: string
}

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplate.Create = phaseTemplate.Create || BaseCreate
    if(phaseTemplate.type === 'otree') {
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