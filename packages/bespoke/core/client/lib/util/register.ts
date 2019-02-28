import {IGameTemplate, TRegisterGame} from './interface'
import {IPhaseTemplate} from 'elf-linker'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    if (window['clientCore']) {
        const _registerGame = window['clientCore'].registerGame as TRegisterGame
        _registerGame(namespace, gameTemplate)
    }
    if (window['ElfLinker']) {
        const phaseTemplate: IPhaseTemplate = {
            type: 'bespoke',
            localeNames: gameTemplate.localeNames,
            Create: gameTemplate.CreateOnElf
        }
        window['ElfLinker'].registerPhaseCreate(namespace, phaseTemplate)
    }
}