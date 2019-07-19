import { RouteComponentProps } from 'react-router-dom';
import { IGameTemplate } from '@bespoke/client';
import { IUserWithId } from '@bespoke/share';
export * from './Api';
export * from './Antd';
export declare type TPageProps = Partial<{
    gameTemplate: IGameTemplate;
    user: IUserWithId;
} & RouteComponentProps<{
    gameId?: string;
}>>;
