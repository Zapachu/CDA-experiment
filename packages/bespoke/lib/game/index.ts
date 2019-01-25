import {IGameTemplate} from 'client-vendor'
import {TregisterGame} from '../core/client'
import {TregisterPhaseCreate} from 'elf-game'

export function registerOnFramework(namespace: string, gameTemplate: IGameTemplate) {
    gameTemplate.namespace = namespace
    if (window['clientCore']) {
        const _registerGame = window['clientCore'].registerGame as TregisterGame
        _registerGame(namespace, gameTemplate)
    }
    if (window['elfCore']) {
        const {localeNames, CreateOnElf} = gameTemplate
        const _registerPhaseCreate = window['elfCore'].registerPhaseCreate as TregisterPhaseCreate
        _registerPhaseCreate(namespace, {
            localeNames, Create: CreateOnElf, type: 'bespoke'
        })
    }
}