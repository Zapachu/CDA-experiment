import {phaseNames} from '../../config'
import {BasePhase} from './BasePhase'
import assignPosition from './assignPosition'
import mainGame from './mainGame'
import marketResult from './marketResult'

export const localePhaseNames = {
    [phaseNames.assignPosition]: ['玩家角色', 'Player Role'],
    [phaseNames.mainGame]: ['心理价格', 'Private Price']
}

export const phaseTemplates: Array<BasePhase.IPhaseTemplate> = [
    {...assignPosition, name: phaseNames.assignPosition},
    {...mainGame, name: phaseNames.mainGame},
    {...marketResult, name: phaseNames.marketResult}
].map(phaseTemplate => ({
    Create: BasePhase.Create,
    Info: BasePhase.Info,
    ...phaseTemplate
}))
