import * as React from 'react';
import { FrameEmitter, GameStatus, IGameWithId, TGameState, TPlayerState } from '@bespoke/share';
import { ButtonProps } from '@elf/component';
declare interface IGameControlProps {
    game: IGameWithId<{}>;
    gameState: TGameState<{}>;
    playerStates: {
        [key: string]: TPlayerState<{}>;
    };
    frameEmitter: FrameEmitter<any, any, any, any>;
    historyPush: (path: string) => void;
}
export declare class GameControl extends React.Component<IGameControlProps> {
    lang: {
        gameStatus: string & ((...args: any[]) => string);
        notStarted: string & ((...args: any[]) => string);
        started: string & ((...args: any[]) => string);
        paused: string & ((...args: any[]) => string);
        over: string & ((...args: any[]) => string);
        start: string & ((...args: any[]) => string);
        pause: string & ((...args: any[]) => string);
        resume: string & ((...args: any[]) => string);
        stop: string & ((...args: any[]) => string);
        onlinePlayers: string & ((...args: any[]) => string);
        players: string & ((...args: any[]) => string);
    };
    gameStatusMachine: {
        0: ({
            status: GameStatus;
            label: string & ((...args: any[]) => string);
            color: ButtonProps.Color;
            width: ButtonProps.Width;
        } | {
            status: GameStatus;
            label: string & ((...args: any[]) => string);
            color?: undefined;
            width?: undefined;
        })[];
        1: ({
            status: GameStatus;
            label: string & ((...args: any[]) => string);
            color: ButtonProps.Color;
            width: ButtonProps.Width;
        } | {
            status: GameStatus;
            label: string & ((...args: any[]) => string);
            color?: undefined;
            width?: undefined;
        })[];
    };
    render(): JSX.Element;
}
export {};
