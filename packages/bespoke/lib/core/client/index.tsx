import * as React from 'react'
import {render} from 'react-dom'
import {Root} from './view'
import {Lang} from 'client-vendor'

export {registerGame} from './view'

const rootContainer = document.body.appendChild(document.createElement('div'))
render(<Root/>, rootContainer)
Lang.switchListeners.push(() => {
    render(<Root key={Lang.activeLanguage}/>, rootContainer)
})