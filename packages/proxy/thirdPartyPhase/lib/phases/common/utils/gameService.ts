import setting from '../../../config/settings'
import {PhaseManager} from 'elf-protocol'

export const gameService = PhaseManager.getGameService(setting.elfGameServiceUri)