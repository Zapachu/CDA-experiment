import './initial.scss'
import * as React from 'react'
import {IGameTemplate} from '@bespoke/register'
import {Lang} from '@elf/component'
import {BrowserRouter, Redirect, Route as ReactRoute, RouteComponentProps, RouteProps, Switch} from 'react-router-dom'
import {config} from '@bespoke/share'
import {Login} from './Login'
import {Dashboard} from './Dashboard'
import {Create} from './Create'
import {Info} from './Info'
import {Share} from './Share'
import {Join} from './Join'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {render} from 'react-dom'
import {Api, TPageProps} from './util'

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

function emptyPage(label: string) {
    return ()=><div style={{
        fontSize:'2rem',
        margin:'2rem',
        textAlign:'center',
        color:'#999'
    }}>{label}</div>
}

export function registerOnBespoke(gameTemplate: IGameTemplate) {
    const template = {
        Create: emptyPage(Lang.extractLang({label: ['无可配置参数', 'No parameters to config']}).label),
        Info: emptyPage(Lang.extractLang({label: ['无配置', 'No Configuration']}).label),
        Play4Owner: emptyPage(Lang.extractLang({label: ['实验进行中', 'Playing...']}).label),
        Result: emptyPage(Lang.extractLang({label: ['实验已结束', 'GAME OVER']}).label),
        Result4Owner: emptyPage(Lang.extractLang({label: ['实验已结束', 'GAME OVER']}).label),
        ...gameTemplate
    }
    Api.getUser().then(({user}) => {
        const rootContainer = document.body.appendChild(document.createElement('div')),
            props = {gameTemplate: template, user}
        renderRoot(props, rootContainer)
        Lang.switchListeners.push(() => renderRoot(props, rootContainer))
    })
}
