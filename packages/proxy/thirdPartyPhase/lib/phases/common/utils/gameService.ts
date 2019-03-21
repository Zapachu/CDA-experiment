import {elfSetting as setting} from 'elf-setting'
import {PhaseManager} from 'elf-protocol'

export const gameService = PhaseManager.getGameService(setting.linkerServiceUri)
