import { Api, GameTemplate, TPageProps } from './util'
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
import * as style from './style.scss'
import { Dropdown, Icon, Layout, Menu, Spin } from 'antd'

const { Header, Sider, Content } = Layout

export function registerOnElf(namespace: string, template: IGameTemplate) {
  GameTemplate.setTemplate({
    namespace,
    Create: () => null,
    ...template
  })
}

function Root() {
  const lang = Lang.extractLang({
    home: ['主页', 'Home'],
    class: ['课堂', 'Class'],
    convene: ['招募', 'Convene'],
    survey: ['问卷', 'Survey'],
    game: ['实验', 'Game'],
    ancademy: ['微课研', 'Ancademy']
  })
  const MENU = {
    home: {
      label: lang.home,
      icon: 'home',
      href: '/home'
    },
    class: {
      label: lang.class,
      icon: 'book',
      href: '/task/course'
    },
    convene: {
      label: lang.convene,
      icon: 'flag',
      href: '/task/recruit'
    },
    survey: {
      label: lang.survey,
      icon: 'file-text',
      href: '/task/survey'
    },
    experiment: {
      label: lang.game,
      icon: 'experiment',
      href: '/task/game'
    }
  }
  const [user, setUser] = React.useState(null as IUserWithId),
    [collapsed, setCollapsed] = React.useState(false)
  React.useEffect(() => {
    Api.getUser().then(({ user }) => setUser(user))
  }, [])
  if (!user) {
    return <Spin />
  }
  const pageProps: TPageProps = { user }
  return (
    <Layout>
      <Sider
        trigger={null}
        theme={'light'}
        style={{
          height: '100vh',
          borderRight: '1px solid #e8e8e8'
        }}
        collapsible
        collapsed={collapsed}
      >
        <a href={'https://www.ancademy.org/'} className={style.logo}>
          <img
            src={
              'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMy4wLjIsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0i5Zu+5bGCXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMzIgMzIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDMyIDMyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPg0KCS5zdDB7ZmlsbDojMDA4Q0Q3O30NCgkuc3Qxe2ZpbGw6I0ZGRkZGRjt9DQo8L3N0eWxlPg0KPHJlY3QgeD0iMCIgY2xhc3M9InN0MCIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIi8+DQo8Zz4NCgk8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAuMjIsMjIuNzZDMjAuMjIsMjIuNzYsMjAuMjIsMjIuNzYsMjAuMjIsMjIuNzZDMjAuMjEsMjIuNzYsMjAuMjEsMjIuNzYsMjAuMjIsMjIuNzZ6Ii8+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTMwLjgsMjYuNThIMC44N2MtMC4xMSwwLTAuMiwwLjQzLTAuMiwwLjk1YzAsMC41MiwwLjA5LDAuOTUsMC4yLDAuOTVIMzAuOGMwLjExLDAsMC4yLTAuNDMsMC4yLTAuOTUNCgkJQzMxLDI3LDMwLjkxLDI2LjU4LDMwLjgsMjYuNTh6Ii8+DQoJPGc+DQoJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yOC4zMywyMS40MUgzLjM0Yy0wLjcxLDAtMS4yOCwwLjU3LTEuMjgsMS4yOHYzLjA4YzAsMC43MSwwLjU3LDEuMjgsMS4yOCwxLjI4aDI0Ljk5DQoJCQljMC43MSwwLDEuMjgtMC41NywxLjI4LTEuMjh2LTMuMDhDMjkuNjEsMjEuOTgsMjkuMDQsMjEuNDEsMjguMzMsMjEuNDF6IE00LjU2LDI2LjUyYy0xLjA5LTAuMDMtMS42NC0wLjc4LTEuNjUtMi4yNw0KCQkJYzAuMDYtMS40MywwLjYyLTIuMTksMS42OS0yLjMxYzAuNzksMC4wMSwxLjI5LDAuNDYsMS41LDEuMzNsLTAuNzIsMC4yNWMtMC4xNC0wLjU4LTAuNDEtMC44Ny0wLjgtMC44Nw0KCQkJYy0wLjU5LDAuMDYtMC45LDAuNTktMC45MywxLjU5YzAuMDEsMS4wNCwwLjMyLDEuNTgsMC45MSwxLjYxYzAuNDcsMCwwLjc2LTAuMzUsMC44Ny0xLjA2bDAuNzQsMC4yMQ0KCQkJQzUuOTQsMjYuMDQsNS40MSwyNi41NCw0LjU2LDI2LjUyeiBNOS45MSwyNi40M2wtMC4zNC0xLjA0SDhsLTAuMzYsMS4wNEg2LjlsMS41Ny00LjM4SDkuMWwxLjU3LDQuMzhIOS45MXogTTEyLjk3LDI2LjQzaC0xLjMzDQoJCQl2LTQuMzhoMS4zMWMxLjMzLDAuMDMsMiwwLjc2LDIuMDMsMi4yQzE0Ljk5LDI1LjczLDE0LjMyLDI2LjQ2LDEyLjk3LDI2LjQzeiBNMTguOCwyNi40M2gtMi43M3YtNC4zOGgyLjYzdjAuN2gtMS44OHYxLjA2aDEuNzQNCgkJCXYwLjcyaC0xLjc0djEuMjVoMS45OVYyNi40M3ogTTI0LjMyLDI2LjQzaC0wLjc0di0yLjU2bDAuMDQtMC42NGwtMS4yMywzLjJoLTAuNTVsLTEuMjMtMy4xNmwwLjA0LDAuNjF2Mi41NGgtMC43NHYtNC4zOGgwLjkzDQoJCQlsMS4yNywzLjI4bDEuMjktMy4yOGgwLjkxVjI2LjQzeiBNMjcuMzgsMjQuNTV2MS44OGgtMC43NHYtMS44NmwtMS4zOC0yLjUyaDAuNzZMMjcsMjMuOTVsMC45Ny0xLjkxaDAuNzhMMjcuMzgsMjQuNTV6Ii8+DQoJCTxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iOC4yMywyNC42NyA5LjM0LDI0LjY3IDguNzksMjMuMDYgCQkiLz4NCgkJPHBhdGggY2xhc3M9InN0MSIgZD0iTTEyLjk5LDIyLjc1aC0wLjYxdjMuMDNoMC42NGMwLjg1LDAuMDMsMS4yNi0wLjQ4LDEuMjUtMS41MkMxNC4yNiwyMy4yNSwxMy44NCwyMi43NSwxMi45OSwyMi43NXoiLz4NCgk8L2c+DQoJPHBhdGggY2xhc3M9InN0MSIgZD0iTTE0LjkxLDQuNzhMMy40OSw3LjM5Yy0wLjk1LDAuNDgtMC42LDEuOTEsMC40NiwxLjkxaDIzLjc2YzEuMDYsMCwxLjQxLTEuNDMsMC40Ni0xLjkxTDE2Ljc1LDQuNzgNCgkJQzE2LjE4LDQuNDgsMTUuNDksNC40OCwxNC45MSw0Ljc4eiIvPg0KCTxnPg0KCQk8Zz4NCgkJCTxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMy43MSwxNy43N1Y5Ljg4aDEuODl2MTEuMThoLTEuODlsLTUuMTgtNy44OHY3Ljg4aC0xLjg5VjkuODhoMS45NEwyMy43MSwxNy43N3oiLz4NCgkJPC9nPg0KCQk8Zz4NCgkJCTxyZWN0IHg9IjUuMjUiIHk9IjkuOSIgY2xhc3M9InN0MSIgd2lkdGg9IjEuODgiIGhlaWdodD0iMTEuMDciLz4NCgkJCQ0KCQkJCTxyZWN0IHg9IjcuNTciIHk9IjE0LjAxIiB0cmFuc2Zvcm09Im1hdHJpeCg0LjQ5MTA4MGUtMTEgLTEgMSA0LjQ5MTA4MGUtMTEgLTguMzUwNSAyNS4zODI5KSIgY2xhc3M9InN0MSIgd2lkdGg9IjEuODgiIGhlaWdodD0iNS43MiIvPg0KCQkJPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxNC45OSwyMC45NyAxMi43MiwyMC45NyA1LjI1LDkuOSA3LjUyLDkuOSAJCQkiLz4NCgkJPC9nPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg0K'
            }
            alt={lang.ancademy}
          />
          <h1 className={style.title}>{lang.ancademy}</h1>
        </a>
        <Menu mode="inline" defaultSelectedKeys={[MENU.experiment.href]}>
          {Object.values(MENU).map(({ label, icon, href }) => (
            <Menu.Item key={href}>
              <a href={`https://www.ancademy.org/org/${user.orgCode}${href}`}>
                <Icon type={icon} theme={'filled'} />
                <span>{label}</span>
              </a>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className={style.header}>
          <Icon
            className="trigger"
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown
            placement="bottomLeft"
            overlay={
              <Menu mode="inline" defaultSelectedKeys={[Lang.activeLanguage]}>
                {Object.values([
                  { label: '🇨🇳 简体中文', lang: Lang.Language.zh },
                  { label: '🇬🇧 English', lang: Lang.Language.en }
                ]).map(({ label, lang }) => (
                  <Menu.Item key={lang} onClick={() => Lang.switchLang(lang)}>
                    <span>{label}</span>
                  </Menu.Item>
                ))}
              </Menu>
            }
          >
            <Icon type="global" />
          </Dropdown>
        </Header>
        <Content>
          <BrowserRouter basename={config.rootName}>
            <Switch>
              <Route path={'/create/:namespace'} render={routeProps => <Create {...routeProps} {...pageProps} />} />
              <Route path={'/play/:gameId'} render={routeProps => <Play {...routeProps} {...pageProps} />} />
              <Route path={'/info/:gameId'} render={routeProps => <Info {...routeProps} {...pageProps} />} />
              <Route path={'/view/:gameId'} render={routeProps => <View {...routeProps} {...pageProps} />} />
            </Switch>
          </BrowserRouter>
        </Content>
      </Layout>
    </Layout>
  )
}

const rootContainer = document.body.appendChild(document.createElement('div'))
Lang.listenLang(() => render(<Root key={Lang.activeLanguage} />, rootContainer))
