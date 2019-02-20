import * as React from 'react'
import {IElfCreateProps, IPhaseTemplate, registerPhaseCreate} from 'elf-linker'

export {Lang} from './util'
export {CorePhaseNamespace} from '@core/common'

export class BaseCreate<ICreateParams> extends React.Component<IElfCreateProps<ICreateParams>> {

}

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplate.type = 'otree'
    registerPhaseCreate(namespace, phaseTemplate)
}