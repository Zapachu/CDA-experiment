import * as React from 'react';
import { IGameWithId } from '@bespoke/share';
import { Core } from '@bespoke/client';
declare type TTravelState = Core.ITravelState<any, any, any, any>;
declare interface IGameResultProps {
    game: IGameWithId<{}>;
    Result4Owner: React.ComponentType<Core.IResult4OwnerProps<any, any, any, any, any>>;
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
