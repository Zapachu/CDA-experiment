import {registerPhaseCreate, IPhaseTemplate} from '@elf/client-sdk'

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    registerPhaseCreate(namespace, phaseTemplate)
}