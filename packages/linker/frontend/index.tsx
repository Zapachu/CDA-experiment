import { Api, GameTemplate } from './util'
import { Lang } from '@elf/component'
import { IGameTemplate } from '@elf/client'
import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { config, IUserWithId } from 'linker-share'
import { Play } from './Play'
import { Create } from './Create'
import { Info } from './Info'
import { View } from './View'
import { Spin } from 'antd'

export function registerOnElf(namespace: string, template: IGameTemplate) {
  GameTemplate.setTemplate({
    namespace,
    Create: () => null,
    ...template
  })
}

function Root() {
  const [user, setUser] = React.useState(null as IUserWithId)
  React.useEffect(() => {
    Api.getUser().then(({ user }) => setUser(user))
  }, [])
  if (!user) {
    return <Spin />
  }

  function pageRender(Component: React.ComponentType<any>) {
    return routeProps => <Component {...routeProps} user={user} />
  }

  return (
    <BrowserRouter basename={config.rootName}>
      <Switch>
        <Route path={'/create/:namespace'} render={pageRender(Create)} />
        <Route path={'/play/:gameId'} render={pageRender(Play)} />
        <Route path={'/info/:gameId'} render={pageRender(Info)} />
        <Route path={'/view/:gameId'} render={pageRender(View)} />
      </Switch>
    </BrowserRouter>
  )
}

const rootContainer = document.body.appendChild(document.createElement('div'))
Lang.listenLang(() => render(<Root key={Lang.activeLanguage} />, rootContainer))
