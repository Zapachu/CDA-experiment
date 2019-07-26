import {registerOnElf, IGameTemplate} from '@elf/client'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    registerOnElf(namespace, gameTemplate)
}