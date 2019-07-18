import * as React from 'react'

export namespace Template {

    export interface ICreateProps<ICreateParams> {
        params: Partial<ICreateParams>
        setParams: (params: Partial<ICreateParams> | ((prevParams: ICreateParams) => Partial<ICreateParams>)) => void
        submitable?: boolean
        setSubmitable?: (submitable: boolean) => void
    }

    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }
}

export interface IGameTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: React.ComponentType<Template.ICreateProps<any>>
}

export function registerOnElf(namespace: string, gameTemplate: IGameTemplate) {
    if (window['ElfLinker']) {
        window['ElfLinker'].registerOnElf(namespace, gameTemplate)
    }
}