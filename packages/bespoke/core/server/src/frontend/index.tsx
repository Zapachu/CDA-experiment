import './initial.scss'
import * as React from 'react'
import {IGameTemplate, Lang, MaskLoading, TPageProps, TRegisterGame} from 'elf-component'
import {BrowserRouter, Redirect, Route as ReactRoute, RouteComponentProps, RouteProps, Switch} from 'react-router-dom'
import {config} from 'bespoke-common'
import {Login} from './Login'
import {Dashboard} from './Dashboard'
import {Create} from './Create'
import {Info} from './Info'
import {Share} from './Share'
import {Join} from './Join'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {render} from 'react-dom'
import {Api} from './util'

function renderRoot(pageProps: TPageProps, rootContainer: HTMLElement) {
    const Route = ({component: Component, ...routeProps}: RouteProps) =>
        <ReactRoute {...routeProps} render={(props: RouteComponentProps<{ gameId?: string }>) =>
            <Component {...pageProps} {...props}/>
        }/>

    render(<BrowserRouter key={Lang.activeLanguage} basename={`${config.rootName}/${NAMESPACE}`}>
        <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route path='/create' component={Create}/>
            <Route path='/play/:gameId' component={Play}/>
            <Route path='/configuration/:gameId' component={Configuration}/>
            <Route path='/login' component={Login}/>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/info/:gameId' component={Info}/>
            <Route path='/share/:gameId' component={Share}/>
            <Route path='/join' component={Join}/>
            <Route path='/*'>
                <Redirect to='/'/>
            </Route>
        </Switch>
    </BrowserRouter>, rootContainer)
}

export const registerGame: TRegisterGame = (gameTemplate: IGameTemplate) => {
    const Empty = () => null
    const template = {
        Create: Empty,
        Info: Empty,
        Play4Owner: () => <MaskLoading label={Lang.extractLang({label: ['实验进行中', 'Playing...']}).label}/>,
        Result: Empty,
        Result4Owner: Empty,
        ...gameTemplate
    }
    Api.getUser().then(({user}) => {
        const rootContainer = document.body.appendChild(document.createElement('div')),
            props = {gameTemplate: template, user}
        renderRoot(props, rootContainer)
        Lang.switchListeners.push(() => renderRoot(props, rootContainer))
    })
}
