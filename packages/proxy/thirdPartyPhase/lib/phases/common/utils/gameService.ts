import setting from '../../../config/settings'
import {PhaseManager} from 'elf-proto'

export const gameService = PhaseManager.getGameService(setting.elfGameServiceUri)