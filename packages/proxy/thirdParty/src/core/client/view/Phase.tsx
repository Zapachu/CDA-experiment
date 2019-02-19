import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {connect as socketConnect} from 'socket.io-client'
import {baseEnum, config, NSocket, TSocket} from '@core/common'
import {loadScript, connCtx, FrameEmitter} from '../util'
import {rootContext, TRootContext} from '../context'
import {IPhaseTemplate, phaseTemplates} from '@core/client'

declare interface IPlayState {
    groupId?: string
    frameEmitter?: FrameEmitter<any, any>
    phaseTemplate?: IPhaseTemplate
}

@connCtx(rootContext)
export class Play extends React.Component<TRootContext & RouteComponentProps<{ phaseId: string }>, IPlayState> {
    state: IPlayState = {}

    componentDidMount(): void {
        this.initSocketClient()
    }

    initSocketClient() {
        const {location: {hash}, match: {params: {phaseId}}} = this.props
        const socketClient = socketConnect('/', {path: config.socketPath}) as TSocket
        const playerToken = +hash.slice(1)
        socketClient.emit(baseEnum.SocketEvent.online, phaseId, playerToken, ({namespace, groupId, jsUrl}: NSocket.OnlineRes) => {
            loadScript([jsUrl], () => {
                const phaseTemplate = phaseTemplates[namespace]
                this.setState({
                    groupId,
                    frameEmitter: new FrameEmitter<any, any>(phaseId, playerToken, socketClient),
                    phaseTemplate
                })
            })
        })
        socketClient.on(baseEnum.SocketEvent.sendBack, (sendBackUrl: string) => {
            setTimeout(() => {
                location.href = sendBackUrl
            }, 1000)
        })
    }

    render(): React.ReactNode {
        const {language} = this.props
        const {frameEmitter, phaseTemplate} = this.state
        if (!phaseTemplate) {
            return null
        }
        const {Play} = phaseTemplate
        return <Play {...{
            language,
            frameEmitter
        }}/>
    }
}