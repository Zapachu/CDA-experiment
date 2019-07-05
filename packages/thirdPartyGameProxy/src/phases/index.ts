import {registerOnElf, IPhaseTemplate} from '@elf/register'

export function registerOnFramework(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    registerOnElf(namespace, phaseTemplate)
}