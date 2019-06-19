import {IGameTemplate, TRegisterGame} from './interface'
import {IPhaseTemplate} from 'elf-linker'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    if (window['BespokeServer']) {
        const _registerGame = window['BespokeServer'].registerGame as TRegisterGame
        _registerGame(gameTemplate)
    }
    if (window['ElfLinker']) {
        const phaseTemplate: IPhaseTemplate = {
            localeNames: gameTemplate.localeNames,
            Create: gameTemplate.CreateOnElf,
        }
        window['ElfLinker'].registerPhaseCreate(namespace, phaseTemplate)
    }
}
