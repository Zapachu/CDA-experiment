import { Api, GameTemplate, TPageProps } from './util'
import { Lang } from '@elf/component'
import { IGameTemplate } from '@elf/client'
import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { config, IUserWithId } from 'linker-share'
import { Play } from './Play'
import { Create } from './Create'
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
          <img src={'http://org.modao.cc/uploads4/images/4154/41544426/v2_q0ybhh.svg'} alt={lang.ancademy} />
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
              <Menu key={Lang.activeLanguage} mode="inline" defaultSelectedKeys={[Lang.activeLanguage]}>
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
            </Switch>
          </BrowserRouter>
        </Content>
      </Layout>
    </Layout>
  )
}

const rootContainer = document.body.appendChild(document.createElement('div'))
Lang.listenLang(() => render(<Root />, rootContainer))
