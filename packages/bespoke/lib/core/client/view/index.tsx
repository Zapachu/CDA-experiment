import * as React from 'react'
import * as style from './initial.scss'
import {Lang, LanguageSwitcher} from 'client-vendor'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {config} from '@common'
import {rootContext, TRootCtx} from '../context'
import {IGameTemplate, TRegisterGame} from 'client-vendor'
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
                <Route path='/login' component={Login}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/create/:namespace' component={Create}/>
                <Route path='/info/:gameId' component={Info}/>
                <Route path='/share/:gameId' component={Share}/>
                <Route path='/join' component={Join}/>
                <Route path='/play/:gameId' component={Play}/>
                <Route path='/configuration/:gameId' component={Configuration}/>
            </Switch>
        </BrowserRouter>
    </rootContext.Provider>

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