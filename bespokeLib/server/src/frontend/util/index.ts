import {RouteComponentProps} from 'react-router-dom'
import {IGameTemplate} from '@bespoke/register'
import {IUserWithId} from '@bespoke/share'

export * from './Api'

export type TPageProps = Partial<{
    gameTemplate: IGameTemplate
    user: IUserWithId
} & RouteComponentProps<{ gameId?: string }>>