import * as React from 'react'
import {FrameEmitter} from '@client-lib'
import {IElfCreateProps} from 'elf-game'

export {Lang} from '@client-lib'
export {CorePhaseNamespace} from '@common'

export interface IPhaseTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: typeof BaseCreate
    Play?: typeof BasePlay
}

export const phaseTemplates: {
    [phase: string]: IPhaseTemplate
} = {}

export type TregisterPhasePlay = typeof registerPhasePlay

export function registerPhasePlay(namespace: string, phaseTemplate: IPhaseTemplate) {
    phaseTemplate.namespace = namespace
    phaseTemplate.Play = phaseTemplate.Play || BasePlay
    phaseTemplates[namespace] = phaseTemplate
}

export class BaseCreate<ICreateParams> extends React.Component<IElfCreateProps<ICreateParams>>{

}

export abstract class BasePlay<UpFrame extends number, DownFrame extends number, State = {}> extends React.Component<{
    frameEmitter: FrameEmitter<UpFrame, DownFrame>
}, State> {
}