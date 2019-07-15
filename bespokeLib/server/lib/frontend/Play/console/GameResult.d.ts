import * as React from 'react';
import { IGameWithId } from '@bespoke/share';
import { Core } from '@bespoke/register';
declare type TTravelState = Core.ITravelState<any, any, any, any>;
declare interface IGameResultProps {
    game: IGameWithId<{}>;
    Result4Owner: Core.Result4OwnerClass;
}
declare interface IGameResultState {
    loading: boolean;
    travelStates: Array<TTravelState>;
}
export declare class GameResult extends React.Component<IGameResultProps, IGameResultState> {
    state: IGameResultState;
    componentDidMount(): void;
    render(): React.ReactNode;
}
export {};
