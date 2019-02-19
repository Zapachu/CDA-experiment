import * as React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {config, baseEnum} from '@core/common'
import {TRootContext, rootContext} from '../context'
import * as Phase from './Phase'
import {render} from 'react-dom'

const LANGUAGE_KEY = 'language'

declare interface IRootState extends TRootContext {
}

export class Root extends React.Component<{}, IRootState> {
    state: IRootState = {
        language: +(localStorage.getItem(LANGUAGE_KEY) || baseEnum.Language.chinese) as baseEnum.Language
    }

    render(): React.ReactNode {
        const {language} = this.state
        return <rootContext.Provider value={{language}}>
            <BrowserRouter basename={`${config.rootName}/${config.appPrefix}`}>
                <Switch>
                    <Route path="/phase" render={({match}) =>
                        <Switch>
                            <Route path={`${match.url}/play/:phaseId`} component={Phase.Play}/>
                        </Switch>
                    }/>
                </Switch>
            </BrowserRouter>
        </rootContext.Provider>
    }
}

render(<Root/>, document.body.appendChild(document.createElement('div')))
