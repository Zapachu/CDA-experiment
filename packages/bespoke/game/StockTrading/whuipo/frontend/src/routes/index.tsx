import React from 'react'
import Hall3d from './components/Hall3d'
export default class Index extends React.Component {
    constructor (props) {
        super(props)
    }
    componentDidMount () {

        // reqInitInfo().then(res => {
        //     console.log(res)
        // })
        // const io = socket.connect('/')
        // io.on('connect', function () {
        //     console.log('inner')
        //     io.emit(serverSocketListenEvents.reqStartGame, {
        //         isGroupMode: false
        //     })
        // })
        // io.on(serverSocketListenEvents.reqStartGame, function (data) {
        //     console.log('recive data', data)
        // })       
        // io.on('test', function (data) {
        //     console.log('recive data2:', data)
        // })  
        // const socket = socket
    }
    render () {
        return <div>
            <Hall3d/>
        </div>
    }
}