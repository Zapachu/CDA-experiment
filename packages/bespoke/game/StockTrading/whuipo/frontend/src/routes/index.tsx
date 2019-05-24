import React from 'react'
import Hall3d from './components/Hall3d'

export default class Index extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        return <div>
            <Hall3d/>
        </div>
    }
}