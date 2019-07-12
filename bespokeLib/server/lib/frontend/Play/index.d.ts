import * as React from 'react';
import { FrameEmitter, IActor, IGameWithId, TGameState, TPlayerState, TSocket } from '@bespoke/share';
import { TPageProps } from '../util';
declare interface IPlayState {
    actor?: IActor;
    game?: IGameWithId<{}>;
    gameState?: TGameState<{}>;
    playerState?: TPlayerState<{}>;
    playerStates: {
        [token: string]: TPlayerState<{}>;
    };
    socketClient?: TSocket;
    frameEmitter?: FrameEmitter<any, any, any, any>;
}
export declare class Play extends React.Component<TPageProps, IPlayState> {
    token: string;
    lang: {
        Mask_GamePaused: string & ((...args: any[]) => string);
    };
    state: IPlayState;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    private registerStateReducer;
    applyPlayerState(playerState: TPlayerState<{}>, token?: string): void;
    render(): React.ReactNode;
}
export {};
