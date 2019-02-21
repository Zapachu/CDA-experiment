import {IPhaseTemplate, registerPhaseCreate} from 'elf-linker'

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    registerPhaseCreate(namespace, phaseTemplate)
}