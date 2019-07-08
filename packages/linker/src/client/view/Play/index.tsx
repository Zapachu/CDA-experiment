import * as React from "react";
import {RouteComponentProps} from "react-router";
import {config, IGameState, IGameWithId, TSocket, NFrame, IActor, SocketEvent} from "@common";
import {Api, connCtx} from "@client-util";
import {connect} from "socket.io-client"
import {rootContext, TRootContext, playContext} from "@client-context";
import {Play4Owner} from './Owner'
import {Play4Player} from './Player'
import * as queryString from 'query-string'
import {Loading} from '@client-component'
import {Actor} from '@elf/share'

declare interface IPlayState {
    game?: IGameWithId,
    actor?: IActor,
    socketClient?: TSocket,
    gameState?: IGameState
}

@connCtx(rootContext)
export class Play extends React.Component<TRootContext & RouteComponentProps<{ gameId: string }>, IPlayState> {
    state: IPlayState = {}

    async componentDidMount() {
        const {props: {match: {params: {gameId}}, location: {search}, user}} = this,
            {token = ''} = queryString.parse(search)
        const {game} = await Api.getGame(gameId),
            {actor} = await Api.getActor(gameId, token as string)
        if (!actor) {
            this.props.history.push('/join')
        }
        const socketClient = connect('/', {
            path: config.socketPath,
            query: `gameId=${gameId}&userId=${user.id}&token=${actor.token}&type=${actor.type}&playerId=${actor.playerId}`
        })
        this.registerStateReducer(socketClient)
        this.setState({
            game,
            actor,
            socketClient
        }, () => socketClient.emit(SocketEvent.upFrame, NFrame.UpFrame.joinRoom))
    }

    private registerStateReducer(socketClient: TSocket) {
        socketClient.on(SocketEvent.downFrame, (frame: NFrame.DownFrame, data: {}) => {
            switch (frame) {
                case NFrame.DownFrame.syncGameState: {
                    this.setState({
                        gameState: data as IGameState
                    })
                }
            }
        })
    }

    render(): React.ReactNode {
        const {props:{history}, state: {game, actor, socketClient, gameState}} = this
        if (!gameState) {
            return <Loading/>
        }
        return <playContext.Provider value={{gameState, socketClient, game, actor}}>
            {
                actor.type === Actor.owner ?
                    <Play4Owner history={history}/> :
                    <Play4Player/>
            }
        </playContext.Provider>
    }
}
