import React, {useEffect, useState} from 'react'
import * as style from './initial.scss'
import {BrowserRouter, RouteComponentProps} from 'react-router-dom'
import {config, IUserWithId} from '@common'
import {rootContext} from '@client-context'
import {Loading} from '@client-component'
import {Api} from '@client-util'
import {Route, Switch} from 'react-router'
import {Play} from './Play'
import {Info} from './Info'
import {GameList} from './GameList'
import {PlayerResult} from './Result/Player'
import {Create} from './Create'

interface IToV5Props extends RouteComponentProps<{ gameId?: string }> {
}

function toV5(route: (gameId: string) => string): React.FunctionComponent<IToV5Props> {
    return ({history, match: {params: {gameId}}}) => {
        history.goBack()
        window.open(route(gameId), '_blank')
        return null
    }
}

export const Root: React.FunctionComponent = () => {
    const {academus: {route: academusRoute}} = config
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
                        <Route path={'/Create/:namespace'} component={Create}/>
                        <Route path={'/info/:gameId'} component={Info}/>
                        <Route path={'/play/:gameId'} component={Play}/>
                        <Route path={'/playerResult/:gameId/:playerId'} component={PlayerResult}/>
                        <Route path={'/share/:gameId'}
                               component={toV5(gameId => `${academusRoute.prefix}${academusRoute.share(gameId)}`)}/>
                        <Route path={'/join'}
                               component={toV5(() => `${academusRoute.prefix}${academusRoute.join}`)}/>
                        <Route path={'/player/:gameId'}
                               component={toV5(gameId => `${academusRoute.prefix}${academusRoute.member(user.orgCode, gameId)}`)}/>
                        <Route path={'/*'} component={(props: RouteComponentProps) =>
                            <GameList {...props} {...{user}}/>}/>
                    </Switch>
                </BrowserRouter>
            </rootContext.Provider>
        </section> : <Loading/>
}
