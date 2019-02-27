import {Component} from 'react'
import {IPhaseConfig} from '../common'

declare class BaseCreate<ICreateParam, State = ICreateParam> extends Component<IElfCreateProps<ICreateParam>, State> {
}

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

export interface IPhaseTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: typeof BaseCreate
    type: 'bespoke' | 'otree' | 'qualtrics' | 'survey'
    otreeName?: string
}

export function registerPhaseCreate(namespace: string, phaseTemplate: IPhaseTemplate):void