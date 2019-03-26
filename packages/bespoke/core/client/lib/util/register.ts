import {IGameTemplate, TRegisterGame} from './interface'
import {IPhaseTemplate} from 'elf-linker'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    if (window['BespokeServer']) {
        const _registerGame = window['BespokeServer'].registerGame as TRegisterGame
        _registerGame(namespace, gameTemplate)
    }
    if (window['ElfLinker']) {
        const phaseTemplate: IPhaseTemplate = {
            type: 'bespoke',
            localeNames: gameTemplate.localeNames,
            Create: gameTemplate.CreateOnElf,
            icon: gameTemplate.icon
        }
        window['ElfLinker'].registerPhaseCreate(namespace, phaseTemplate)
    }
}