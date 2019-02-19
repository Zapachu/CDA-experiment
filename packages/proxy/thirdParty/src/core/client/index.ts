import * as React from 'react'
import {IElfCreateProps} from 'elf-game'

export {Lang} from './util'
export {CorePhaseNamespace} from '@core/common'

export interface IPhaseTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: typeof BaseCreate
}

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export class BaseCreate<ICreateParams> extends React.Component<IElfCreateProps<ICreateParams>> {

}

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    window['elfCore'].registerPhaseCreate(namespace, phaseTemplate)
}