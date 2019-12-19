import { Api, GameTemplate, TPageProps } from './util'
import { Lang } from '@elf/component'
import { IGameTemplate } from '@elf/client'
import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route as ReactRoute, RouteComponentProps, RouteProps, Switch } from 'react-router-dom'
import { config } from 'linker-share'
import { Play } from './Play'
import { Create } from './Create'

export function registerOnElf(namespace: string, template: IGameTemplate) {
  GameTemplate.setTemplate({
    namespace,
    Create: () => null,
    ...template
  })
}

Api.getUser().then(({ user }) => {
  const rootContainer = document.body.appendChild(document.createElement('div'))
  renderRoot({ user }, rootContainer)
  Lang.switchListeners.push(() => renderRoot({ user }, rootContainer))
})

function renderRoot(pageProps: TPageProps, rootContainer: HTMLElement) {
  const Route = ({ component: Component, ...routeProps }: RouteProps) => (
    <ReactRoute
      {...routeProps}
      render={(props: RouteComponentProps<{ gameId?: string }>) => <Component {...pageProps} {...props} />}
    />
  )

  render(
    <BrowserRouter basename={config.rootName}>
      <Switch>
        <Route path={'/create/:namespace'} component={Create} />
        <Route path={'/play/:gameId'} component={Play} />
      </Switch>
    </BrowserRouter>,
    rootContainer
  )
}
