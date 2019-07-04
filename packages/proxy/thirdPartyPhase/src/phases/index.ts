import {registerPhaseCreate, IPhaseTemplate} from '@elf/register'

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    registerPhaseCreate(namespace, phaseTemplate)
}