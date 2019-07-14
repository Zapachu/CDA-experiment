import * as React from 'react'

export namespace Template {

    export interface ICreateProps<ICreateParams> {
        params: Partial<ICreateParams>
        setParams: (newParams: Partial<ICreateParams>) => void
        submitable?: boolean
        setSubmitable?: (submitable: boolean) => void
    }

    export class Create<ICreateParams, S = {}> extends React.Component<ICreateProps<ICreateParams>, S> {
    }

    export type CreateSFC<ICreateParams> = React.FC<ICreateProps<ICreateParams>>

    export type CreateClass = (new(...args) => Create<{}, any>) | CreateSFC<{}>
}

export interface IGameTemplate {
    namespace?: string
    localeNames: Array<string>
    Create?: Template.CreateClass
}

export function registerOnElf(namespace: string, gameTemplate: IGameTemplate) {
    if (window['ElfLinker']) {
        window['ElfLinker'].registerOnElf(namespace, gameTemplate)
    }
}