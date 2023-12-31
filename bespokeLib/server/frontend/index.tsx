import './initial.scss'
import * as React from 'react'
import { Core, IGameTemplate } from '@bespoke/client'
import { Lang } from '@elf/component'
import { BrowserRouter, Route as ReactRoute, RouteComponentProps, RouteProps, Switch } from 'react-router-dom'
import { config } from '@bespoke/share'
import { Login } from './Login'
import { Dashboard } from './Dashboard'
import { Create } from './Create'
import { Info } from './Info'
import { Share } from './Share'
import { Join } from './Join'
import { Play } from './Play'
import { Configuration } from './Configuration'
import { NotFound } from './NotFound'
import { render } from 'react-dom'
import { Api, TPageProps } from './util'

function renderRoot(pageProps: TPageProps, rootContainer: HTMLElement) {
  const Route = ({ component: Component, ...routeProps }: RouteProps) => (
    <ReactRoute
      {...routeProps}
      render={(props: RouteComponentProps<{ gameId?: string }>) => <Component {...pageProps} {...props} />}
    />
  )

  render(
    <section>
      <BrowserRouter key={Lang.activeLanguage} basename={`${config.rootName}/${NAMESPACE}`}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/create" component={Create} />
          <Route path="/play/:gameId" component={Play} />
          <Route path="/configuration/:gameId" component={Configuration} />
          <Route path="/login" component={Login} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/info/:gameId" component={Info} />
          <Route path="/share/:gameId" component={Share} />
          <Route path="/join" component={Join} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    </section>,
    rootContainer
  )
}

export function registerOnBespoke(gameTemplate: IGameTemplate) {
  const template = {
    Create: Core.Create,
    Play4Owner: Core.Play4Owner,
    Result: Core.Result,
    Result4Owner: Core.Result4Owner,
    ...gameTemplate
  }
  Api.getUser().then(({ user }) => {
    const rootContainer = document.body.appendChild(document.createElement('div')),
      props = { gameTemplate: template, user }
    Lang.listenLang(() => renderRoot(props, rootContainer))
  })
}
