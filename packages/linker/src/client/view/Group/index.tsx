import * as React from 'react'
import {Route, RouteComponentProps, Switch} from 'react-router'
import {Create} from './Create'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {Share} from './Share'
import {Info} from './Info'
import {Join} from './Join'
import {PlayerList} from './PlayerList'

type IGroupProps = RouteComponentProps<{}>

export const Group: React.SFC<IGroupProps> = ({match}) =>
    <Switch>
        <Route path={`${match.url}/create/:gameId`} component={Create}/>
        <Route path={`${match.url}/share/:groupId`} component={Share}/>
        <Route path={`${match.url}/join/:groupId`} component={Join}/>
        <Route path={`${match.url}/info/:groupId`} component={Info}/>
        <Route path={`${match.url}/configuration/:groupId`} component={Configuration}/>
        <Route path={`${match.url}/play/:groupId`} component={Play}/>
        <Route path={`${match.url}/player/:groupId`} component={PlayerList}/>
    </Switch>

export {registerCorePhases} from './CorePhase'