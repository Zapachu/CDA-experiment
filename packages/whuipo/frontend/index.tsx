import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {Hall3D} from './view/Hall3d'
import {Login} from './view/Login'
import './index.less'

render(<BrowserRouter>
    <Switch>
        <Route exact path='/' component={Hall3D}/>
        <Route path='/login' component={Login}/>
        <Route component={Hall3D}/>
    </Switch>
</BrowserRouter>, document.getElementById('root'))