import * as React from 'react'
import {Route, RouteComponentProps} from 'react-router'
import {Switch} from 'react-router-dom'
import {GameList} from './List'
import {Info} from './Info'

type IGameProps = RouteComponentProps<{}>

export const Game: React.SFC<IGameProps> = ({match}) =>
    <Switch>
        <Route path={`${match.url}/info/:gameId`} component={Info}/>
        <Route path={match.url} component={GameList}/>
    </Switch>
