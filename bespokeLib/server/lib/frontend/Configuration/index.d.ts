import * as React from 'react';
import { IGameWithId } from '@bespoke/share';
import { TPageProps } from '../util';
declare type IConfigurationState = {
    loading: boolean;
    game?: IGameWithId<any>;
};
export declare class Configuration extends React.Component<TPageProps, IConfigurationState> {
    lang: {
        playRoom: string & ((...args: any[]) => string);
    };
    state: IConfigurationState;
    componentDidMount(): Promise<void>;
    render(): JSX.Element;
}
export {};
