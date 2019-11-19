import { phaseNames } from '../../config'
import { BasePhase } from './BasePhase'
import assignPosition from './assignPosition'
import mainGame from './mainGame'
import marketResult from './marketResult'

export const localePhaseNames = {
  [phaseNames.assignPosition]: ['分发角色', 'Assign Role'],
  [phaseNames.mainGame]: ['主实验', 'Main Game'],
  [phaseNames.marketResult]: ['市场结果', 'Market Result']
}

export const phaseTemplates: Array<BasePhase.IPhaseTemplate> = [
  { ...assignPosition, name: phaseNames.assignPosition },
  { ...mainGame, name: phaseNames.mainGame },
  { ...marketResult, name: phaseNames.marketResult }
].map(phaseTemplate => ({
  Create: BasePhase.Create,
  Info: BasePhase.Info,
  ...phaseTemplate
}))
