import * as React from 'react'
import {Route, RouteComponentProps, Switch} from 'react-router'
import {Create} from './Create'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {Share} from './Share'
import {Info} from './Info'
import {Join} from './Join'
import {PlayerList} from './PlayerList'
import {withTab, NAV} from '../WithTab'

type IGroupProps = RouteComponentProps<{}>

export const Group: React.SFC<IGroupProps> = ({match}) =>
    <Switch>
        <Route path={`${match.url}/create/:gameId`} component={withTab(Create, NAV.group)}/>
        <Route path={`${match.url}/share/:gameId`} component={Share}/>
        <Route path={`${match.url}/join/:gameId`} component={Join}/>
        <Route path={`${match.url}/info/:gameId`} component={Info}/>
        <Route path={`${match.url}/configuration/:gameId`} component={Configuration}/>
        <Route path={`${match.url}/play/:gameId`} component={Play}/>
        <Route path={`${match.url}/player/:gameId`} component={PlayerList}/>
    </Switch>

export {registerCorePhases} from './CorePhase'