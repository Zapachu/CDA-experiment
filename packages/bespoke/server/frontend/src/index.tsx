import * as React from 'react'
import * as style from './initial.scss'
import {Lang, LanguageSwitcher} from 'bespoke-client'
import {BrowserRouter, Switch, Route, RouteComponentProps} from 'react-router-dom'
import {config} from 'bespoke-common'
import {rootContext, TRootCtx} from './context'
import {IGameTemplate, TRegisterGame} from 'bespoke-client'
import {Login} from './Login'
import {Dashboard} from './Dashboard'
import {Create} from './Create'
import {Info} from './Info'
import {Share} from './Share'
import {Join} from './Join'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {render} from 'react-dom'

const Root: React.FunctionComponent<TRootCtx> = props =>
    <rootContext.Provider value={props}>
        <div className={style.languageSwitcherWrapper}>
            <LanguageSwitcher/>
        </div>
        <BrowserRouter basename={config.rootName}>
            <Switch>
                <Route path={`/${props.gameTemplate.namespace}`} component={NamespaceRoute}/>
                <Route path='/login' component={Login}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/info/:gameId' component={Info}/>
                <Route path='/share/:gameId' component={Share}/>
                <Route path='/join' component={Join}/>
            </Switch>
        </BrowserRouter>
    </rootContext.Provider>

const NamespaceRoute: React.FunctionComponent<RouteComponentProps> = ({match}) =>
    <Switch>
        <Route path={`${match.url}/create`} component={Create}/>
        <Route path={`${match.url}/play/:gameId`} component={Play}/>
        <Route path={`${match.url}/configuration/:gameId`} component={Configuration}/>
    </Switch>

export const registerGame: TRegisterGame = (namespace: string, gameTemplate: IGameTemplate) => {
    const Empty = () => null
    const template = {
        namespace,
        Create: Empty,
        Info: Empty,
        Play4Owner: Empty,
        Result: Empty,
        Result4Owner: Empty,
        ...gameTemplate
    }
    const rootContainer = document.body.appendChild(document.createElement('div'))
    render(<Root gameTemplate={template}/>, rootContainer)
    Lang.switchListeners.push(() => {
        render(<Root key={Lang.activeLanguage} gameTemplate={template}/>, rootContainer)
    })
}