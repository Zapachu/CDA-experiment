import * as React from 'react'
import * as style from './initial.scss'
import {LanguageSwitcher, Api, loadScript} from 'client-vendor'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import {config, baseEnum} from '@common'
import {rootContext, TRootCtx} from '../context'
import {IGameTemplate, TRegisterGame} from 'client-vendor'
import {Login} from './Login'
import {Dashboard} from './Dashboard'
import {Create} from './Create'
import {Info} from './Info'
import {Share} from './Share'
import {Join} from './Join'
import {Play} from './Play'
import {Configuration} from './Configuration'

export const gameTemplates: {
    [namespace: string]: IGameTemplate
} = {}

export class Root extends React.Component<{}, TRootCtx> {
    state: TRootCtx = {
        gameTemplate: null
    }

    act = {
        switchGameTemplate: async (namespace: string): Promise<void> => {
            const {code, jsUrl} = await Api.getGameTemplateUrl()
            if (code !== baseEnum.ResponseCode.success) {
                return
            }
            return new Promise<void>((resolve => loadScript([jsUrl], () => {
                this.setState(() => ({
                    gameTemplate: gameTemplates[namespace]
                }), () => resolve())
            })))
        }
    }

    render(): React.ReactNode {
        return <rootContext.Provider value={{
            gameTemplate: this.state.gameTemplate,
            ...this.act
        }}>
            <div className={style.languageSwitcherWrapper}>
                <LanguageSwitcher/>
            </div>
            <BrowserRouter basename={config.rootName}>
                <Switch>
                    <Route path='/login' component={Login}/>
                    <Route path='/dashboard' component={Dashboard}/>
                    <Route path='/create/:namespace' component={Create}/>
                    <Route path='/info/:gameId' component={Info}/>
                    <Route path='/share/:gameId' component={Share}/>
                    <Route path='/join' component={Join}/>
                    <Route path='/play/:gameId' component={Play}/>
                    <Route path='/configuration/:gameId' component={Configuration}/>
                </Switch>
            </BrowserRouter>
        </rootContext.Provider>
    }
}

export const registerGame: TRegisterGame = (namespace: string, gameTemplate: IGameTemplate) => {
    const Empty = () => null
    gameTemplates[namespace] = {
        namespace,
        Create: Empty,
        Info: Empty,
        Play4Owner: Empty,
        Result: Empty,
        Result4Owner: Empty,
        ...gameTemplate
    }
}