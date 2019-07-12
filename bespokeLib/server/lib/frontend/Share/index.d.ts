import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
declare interface IShareState {
    shareCode: string;
    title: string;
}
export declare class Share extends React.Component<RouteComponentProps<{
    gameId: string;
}>, IShareState> {
    state: IShareState;
    lang: {
        shareCode: string & ((...args: any[]) => string);
        failed2GeneShareCode: string & ((...args: any[]) => string);
    };
    componentDidMount(): Promise<void>;
    render(): React.ReactNode;
}
export {};
