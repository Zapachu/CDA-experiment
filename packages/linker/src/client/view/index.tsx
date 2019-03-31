import React, {useEffect, useState} from 'react'
import {BrowserRouter, RouteComponentProps} from 'react-router-dom'
import {config, IUserWithId} from '@common'
import {rootContext} from '@client-context'
import {Loading} from '@client-component'
import {Api} from '@client-util'
import {Route, Switch} from 'react-router'
import {withSideNav, NAV} from './SideNav'
import {Phase} from './Phase'
import {Play} from './Play'
import {Configuration} from './Configuration'
import {Share} from './Share'
import {Info} from './Info'
import {Join} from './Join'
import {PlayerList} from './PlayerList'
import {GameList} from './GameList'
import {BaseInfo} from './BaseInfo'
import {CreateInFrame} from './CreateInFrame'
import {PlayerResult} from './Result/Player'
import * as style from './initial.scss'

export const Root: React.FunctionComponent = () => {
    const [user, setUser] = useState<IUserWithId>()

    useEffect(() => {
        Api.getUser().then(({user}) => setUser(user))
    }, [])
    return user ?
        <section className={style.rootView}>
            <rootContext.Provider value={{user}}>
                <div className={style.languageSwitcherWrapper}>
                    {/*<LanguageSwitcher/>*/}
                </div>
                <BrowserRouter basename={config.rootName}>
                    <Switch>
                        <Route path={'/createInFrame'} component={CreateInFrame}/>
                        <Route path={'/baseInfo/:gameId'} component={withSideNav(BaseInfo, NAV.basic)}/>
                        <Route path={'/baseInfo'} component={withSideNav(BaseInfo, NAV.basic)}/>
                        <Route path={'/phase/:gameId'} component={withSideNav(Phase, NAV.group)}/>
                        <Route path={'/share/:gameId'} component={Share}/>
                        <Route path={'/join'} component={Join}/>
                        <Route path={'/info/:gameId'} component={Info}/>
                        <Route path={'/configuration/:gameId'} component={Configuration}/>
                        <Route path={'/play/:gameId'} component={Play}/>
                        <Route path={'/player/:gameId'} component={PlayerList}/>
                        <Route path={'/playerResult/:gameId/:playerId'} component={PlayerResult}/>
                        <Route path={'/*'} component={(props: RouteComponentProps) =>
                            <GameList {...props} {...{user}}/>}/>
                    </Switch>
                </BrowserRouter>
            </rootContext.Provider>
        </section> : <Loading/>
}
