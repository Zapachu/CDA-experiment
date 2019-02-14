import {IPhaseConfig} from '@common'
import {registerPhaseCreate} from './index'

export interface IElfCreateProps<ICreateParam> {
    phases: Array<{
        label: string
        key: string
        namespace: string
    }>
    curPhase: IPhaseConfig<ICreateParam>
    updatePhase: (suffixPhaseKeys: Array<string>, param: Partial<ICreateParam>) => void
    highlightPhases: (phaseKeys: Array<string>) => void
}

export type TregisterPhaseCreate = typeof registerPhaseCreate