import * as React from 'react';

export namespace Template {
    export type TCreateParams<P> = P
    export type TSetCreateParams<P> = React.Dispatch<React.SetStateAction<Partial<P>>>

    export interface ICreateProps<P> {
        params: TCreateParams<P>
        setParams: TSetCreateParams<P>
        submitable?: boolean
        setSubmitable?: (submitable: boolean) => void
    }

    export class Create<P, S = {}> extends React.Component<ICreateProps<P>, S> {
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