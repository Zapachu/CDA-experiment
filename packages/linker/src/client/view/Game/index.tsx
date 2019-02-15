import * as React from 'react'
import {Route, RouteComponentProps} from 'react-router'
import {Switch} from 'react-router-dom'
import {GameList} from './List'
import {Info} from './Info'
import {withTab, NAV} from '../WithTab'

type IGameProps = RouteComponentProps<{}>

export const Game: React.SFC<IGameProps> = ({match}) =>
    <Switch>
        <Route path={`${match.url}/info/:gameId`} component={withTab(Info, NAV.basic)}/>
        <Route path={`${match.url}/create`} component={withTab(Info, NAV.basic)}/>
        {/* <Route path={`${match.url}/publish/:gameId`} component={withTab(Publish, NAV.publish)}/> */}
        <Route path={match.url} component={GameList}/>
    </Switch>
