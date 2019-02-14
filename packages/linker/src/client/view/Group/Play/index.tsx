import * as React from "react";
import {RouteComponentProps} from "react-router";
import {config, baseEnum, IGroupState, IGroupWithId, TSocket, NFrame, IActor} from "@common";
import {Api, connCtx} from "@client-util";
import {connect} from "socket.io-client"
import {rootContext, TRootContext, playContext} from "@client-context";
import {Play4Owner} from './Owner'
import {Play4Player} from './Player'
import * as queryString from 'query-string'
import {Loading} from '@client-component'

declare interface IPlayState {
    group?: IGroupWithId,
    actor?: IActor,
    socketClient?: TSocket,
    groupState?: IGroupState
}

@connCtx(rootContext)
export class Play extends React.Component<TRootContext & RouteComponentProps<{ groupId: string }>, IPlayState> {
    state: IPlayState = {}

    async componentDidMount() {
        const {props: {match: {params: {groupId}}, location: {search}}} = this,
            {token = ''} = queryString.parse(search)
        const {group} = await Api.getGroup(groupId),
            {actor} = await Api.getActor(groupId, token as string)
        if (!actor) {
            this.props.history.push('/join')
        }
        const socketClient = connect('/', {
            path: config.socketPath,
            query: `groupId=${groupId}&token=${actor.token}&type=${actor.type}`
        })
        this.registerStateReducer(socketClient)
        this.setState({
            group,
            actor,
            socketClient
        }, () => socketClient.emit(baseEnum.SocketEvent.upFrame, NFrame.UpFrame.joinRoom))
    }

    private registerStateReducer(socketClient: TSocket) {
        socketClient.on(baseEnum.SocketEvent.downFrame, (frame: NFrame.DownFrame, data: {}) => {
            switch (frame) {
                case NFrame.DownFrame.syncGroupState: {
                    this.setState({
                        groupState: data as IGroupState
                    })
                }
            }
        })
    }

    render(): React.ReactNode {
        const {props:{history}, state: {group, actor, socketClient, groupState}} = this
        if (!groupState) {
            return <Loading/>
        }
        return <playContext.Provider value={{groupState, socketClient, group, actor}}>
            {
                actor.type === baseEnum.Actor.owner ?
                    <Play4Owner history={history}/> :
                    <Play4Player/>
            }
        </playContext.Provider>
    }
}