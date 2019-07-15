import {registerOnElf, IGameTemplate} from '@elf/register'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    registerOnElf(namespace, gameTemplate)
}