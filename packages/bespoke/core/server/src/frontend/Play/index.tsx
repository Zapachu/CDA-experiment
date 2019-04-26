import * as React from 'react'
import {RouteComponentProps} from 'react-router-dom'
import {
    config,
    baseEnum,
    TGameState,
    TPlayerState,
    TSocket,
    FrameEmitter,
    IActor,
    IGameWithId
} from 'bespoke-common'
import {decode} from 'msgpack-lite'
import {MaskLoading, Lang, Api, Fetcher} from 'bespoke-client-util'
import {connCtx, rootContext, TRootCtx} from '../context'
import {connect} from 'socket.io-client'
import {applyChange, Diff} from 'deep-diff'
import * as queryString from 'query-string'
import cloneDeep = require('lodash/cloneDeep')
import {GameControl, GameControlHeight} from './console/GameControl'
import {GameResult} from './console/GameResult'

declare interface IPlayState {
    actor?: IActor
    game?: IGameWithId<{}>
    gameState?: TGameState<{}>
    playerState?: TPlayerState<{}>
    playerStates: { [token: string]: TPlayerState<{}> }
    fetcher?: Fetcher<any>
    socketClient?: TSocket
    frameEmitter?: FrameEmitter<any, any, any, any>
}

@connCtx(rootContext)
export class Play extends React.Component<TRootCtx & RouteComponentProps<{ gameId: string }>, IPlayState> {
    lang = Lang.extractLang({
        Mask_WaitForGameToStart: ['等待实验开始', 'Waiting for experiment to Start'],
        Mask_GamePaused: ['实验已暂停', 'Experiment Paused']
    })

    state: IPlayState = {
        playerStates: {}
    }

    async componentDidMount() {
        const {props: {history, match: {params: {gameId}}, location: {hash = '#', search}}} = this,
            {token = ''} = queryString.parse(search)
        const {game} = await Api.getGame(gameId),
            {actor} = await Api.getActor(gameId, hash.replace('#', ''), token as string)
        if (!token) {
            history.push(`${history.location.pathname}?${queryString.stringify({token: actor.token})}`)
        }
        const socketClient = connect('/', {
            path: config.socketPath(game.namespace),
            query: `gameId=${gameId}&token=${actor.token}&type=${actor.type}`
        })
        this.registerStateReducer(socketClient)
        this.setState(() => ({
            game,
            actor,
            fetcher: new Fetcher<any>(game.namespace, game.id),
            socketClient,
            frameEmitter: new FrameEmitter(socketClient as any)
        }), () => socketClient.emit(baseEnum.SocketEvent.online))
    }

    componentWillUnmount(): void {
        this.state.socketClient.close()
    }

    private registerStateReducer(socketClient: TSocket) {
        socketClient.on(baseEnum.SocketEvent.syncGameState_json, (gameState: TGameState<{}>) => {
            this.setState({gameState})
        })
        socketClient.on(baseEnum.SocketEvent.changeGameState_diff, (stateChanges: Array<Diff<any>>) => {
            let gameState = cloneDeep(this.state.gameState) || {} as any
            stateChanges.forEach(change => applyChange(gameState, null, change))
            this.setState({gameState})
        })
        socketClient.on(baseEnum.SocketEvent.syncPlayerState_json,
            (playerState: TPlayerState<{}>, token?: string) => this.applyPlayerState(playerState, token))
        socketClient.on(baseEnum.SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<any>>, token?: string) => {
            const {state: {playerStates}} = this
            let playerState: TPlayerState<{}> = cloneDeep(token ? playerStates[token] : this.state.playerState) || {} as any
            stateChanges.forEach(change => applyChange(playerState, null, change))
            token ? this.setState({
                playerStates: {
                    ...playerStates,
                    [token]: playerState
                }
            }) : this.setState({playerState})
        })
        socketClient.on(baseEnum.SocketEvent.syncGameState_msgpack, (gameStateBuffer: Array<number>) => {
            console.log(gameStateBuffer.length / JSON.stringify(decode(gameStateBuffer)).length)
            this.setState({gameState: decode(gameStateBuffer)})
        })
        socketClient.on(baseEnum.SocketEvent.syncPlayerState_msgpack,
            (playerStateBuffer: Array<number>, token?: string) => this.applyPlayerState(decode(playerStateBuffer), token))
        socketClient.on(baseEnum.SocketEvent.sendBack, (sendBackUrl: string) => {
            setTimeout(() => {
                location.href = sendBackUrl
            }, 1000)
        })
    }

    applyPlayerState(playerState: TPlayerState<{}>, token?: string) {
        const {state: {playerStates}} = this
        token ? this.setState({
            playerStates: {
                ...playerStates,
                [token]: playerState
            }
        }) : this.setState({playerState})
    }

    render(): React.ReactNode {
        const {
            lang,
            props: {history, gameTemplate},
            state: {game, actor, gameState, playerState, playerStates, fetcher, frameEmitter}
        } = this
        if (!gameTemplate || !gameState) {
            return <MaskLoading/>
        }
        const {Play4Owner, Result4Owner, Play, Result} = gameTemplate
        if (actor.type === baseEnum.Actor.owner) {
            console.log(gameState, playerStates)
            return <div style={{marginBottom: GameControlHeight}}>
                <GameControl {...{game, gameState, frameEmitter, historyPush: path => history.push(path)}}/>
                {
                    gameState.status === baseEnum.GameStatus.over ?
                        <GameResult {...{game, fetcher, Result4Owner}}/> :
                        gameState.status === baseEnum.GameStatus.notStarted ?
                            <MaskLoading label={lang.Mask_WaitForGameToStart}/> :
                            <Play4Owner {...{
                                game,
                                fetcher,
                                frameEmitter,
                                gameState,
                                playerStates
                            }}/>
                }
            </div>
        }
        if (!playerState) {
            return <MaskLoading/>
        }
        switch (gameState.status) {
            case baseEnum.GameStatus.notStarted:
                return <MaskLoading label={lang.Mask_WaitForGameToStart}/>
            case baseEnum.GameStatus.paused:
                return <MaskLoading label={lang.Mask_GamePaused}/>
            case baseEnum.GameStatus.started:
                return <Play {...{game, fetcher, gameState, playerState, frameEmitter}}/>
            case baseEnum.GameStatus.over:
                return <Result {...{game, fetcher, gameState, playerState}}/>
        }
    }
}
