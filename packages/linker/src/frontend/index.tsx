import {Api, GameTemplate, TPageProps} from './util'
import {Lang, Language} from '@elf/component'
import {IGameTemplate} from '@elf/register'
import * as React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Route as ReactRoute, RouteComponentProps, RouteProps, Switch} from 'react-router-dom'
import {config} from 'linker-share'
import {Play} from './Play'
import {Info} from './Info'
import {Dashboard} from './Dashboard'
import {Create} from './Create'
import {Button} from 'antd'

require('./initial.scss')

export function registerOnElf(namespace: string, template: IGameTemplate) {
    template.namespace = namespace
    GameTemplate.setTemplate(template)
}

Api.getUser().then(({user}) => {
    const rootContainer = document.body.appendChild(document.createElement('div'))
    renderRoot({user}, rootContainer)
    Lang.switchListeners.push(() => renderRoot({user}, rootContainer))
})

function renderRoot(pageProps: TPageProps, rootContainer: HTMLElement) {
    const Route = ({component: Component, ...routeProps}: RouteProps) =>
        <ReactRoute {...routeProps} render={(props: RouteComponentProps<{ gameId?: string }>) =>
            <Component {...pageProps} {...props}/>
        }/>

    render(<BrowserRouter basename={config.rootName}>
        <div style={{position: 'absolute', right: 32, top: 16, zIndex: 1000}}>
            <Button size='small'
                    onClick={() => Lang.switchLang(Lang.activeLanguage === Language.en ? Language.zh : Language.en)}>
                {Lang.activeLanguage === Language.en ? '中文' : 'English'}</Button>
        </div>
        <Switch>
            <Route path={'/Create/:namespace'} component={Create}/>
            <Route path={'/info/:gameId'} component={Info}/>
            <Route path={'/play/:gameId'} component={Play}/>
            <Route component={Dashboard}/>
        </Switch>
    </BrowserRouter>, rootContainer)
}