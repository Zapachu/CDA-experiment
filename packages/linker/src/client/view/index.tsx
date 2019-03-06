import * as React from 'react'
import {BrowserRouter} from 'react-router-dom'
import {config} from '@common'
import {TRootContext, rootContext} from '@client-context'
import {Loading} from '@client-component'
import {Api} from '@client-util'
import {Route, Switch} from 'react-router'
import {withSideNav, NAV} from './SideNav'
import {Create} from './Create'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {Share} from './Share'
import {Info} from './Info'
import {Join} from './Join'
import {PlayerList} from './PlayerList'
import {GameList} from './GameList'
import {BaseInfo} from './BaseInfo'
import * as style from './initial.scss'

declare interface IRootState extends TRootContext {
}

export class Root extends React.Component<{}, IRootState> {
    state: IRootState = {}

    async componentDidMount() {
        const {user} = await Api.getUser()
        this.setState({
            user
        })
    }

    render(): React.ReactNode {
        const {state: {user}} = this
        return user ? <section className={style.rootView}>
            <rootContext.Provider value={{user}}>
                <div className={style.languageSwitcherWrapper}>
                    {/*<LanguageSwitcher/>*/}
                </div>
                <BrowserRouter basename={`${config.rootName}/${config.appPrefix}`}>
                    <Switch>
                        <Route path={'/create'} component={withSideNav(BaseInfo, NAV.basic)}/>
                        <Route path={'/baseInfo/:gameId'} component={withSideNav(BaseInfo, NAV.basic)}/>
                        <Route path={'/phase/:gameId'} component={withSideNav(Create, NAV.group)}/>
                        <Route path={'/share/:gameId'} component={Share}/>
                        <Route path={'/join/:gameId'} component={Join}/>
                        <Route path={'/info/:gameId'} component={Info}/>
                        <Route path={'/configuration/:gameId'} component={Configuration}/>
                        <Route path={'/play/:gameId'} component={Play}/>
                        <Route path={'/player/:gameId'} component={PlayerList}/>
                        <Route path={'/*'} component={GameList}/>
                    </Switch>
                </BrowserRouter>
            </rootContext.Provider>
        </section> : <Loading/>
    }
}