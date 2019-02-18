import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {config} from '@common'
import {TRootContext, rootContext} from '@client-context'
import {Group} from './Group'
import {Game} from './Game'
import {Api} from '@client-util'
import {LanguageSwitcher} from '@client-component'
import * as style from './initial.scss'

declare interface IRootState extends TRootContext {
}

export class Root extends React.Component<{}, IRootState> {
    componentWillMount(): void {
        // registerCorePhases()
    }

    state: IRootState = {}

    async componentDidMount() {
        const {user} = await Api.getUser()
        this.setState({
            user
        })
    }

    render(): React.ReactNode {
        const {state: {user}} = this
        return <rootContext.Provider value={{user}}>
            <div className={style.languageSwitcherWrapper}>
                <LanguageSwitcher/>
            </div>
            <BrowserRouter basename={`${config.rootName}/${config.appPrefix}`}>
                <Switch>
                    <Route path="/game" component={Game}/>
                    <Route path="/group" component={Group}/>
                </Switch>
            </BrowserRouter>
        </rootContext.Provider>
    }
}