import * as React from 'react'
import {baseEnum, config, FrameEmitter, IActor, IGameWithId, TGameState, TPlayerState, TSocket} from 'bespoke-common'
import * as style from './style.scss'
import {decode} from 'msgpack-lite'
import {Lang, MaskLoading, TPageProps} from 'elf-component'
import {Api} from '../util'
import {connect} from 'socket.io-client'
import {applyChange, Diff} from 'deep-diff'
import * as queryString from 'query-string'
import {GameControl} from './console/GameControl'
import {GameResult} from './console/GameResult'
import cloneDeep = require('lodash/cloneDeep')

declare interface IPlayState {
    actor?: IActor
    game?: IGameWithId<{}>
    gameState?: TGameState<{}>
    playerState?: TPlayerState<{}>
    playerStates: { [token: string]: TPlayerState<{}> }
    socketClient?: TSocket
    frameEmitter?: FrameEmitter<any, any, any, any>
}

export class Play extends React.Component<TPageProps, IPlayState> {
    token = queryString.parse(location.search).token as string
    lang = Lang.extractLang({
        Mask_GamePaused: ['实验已暂停', 'Experiment Paused']
    })

    state: IPlayState = {
        playerStates: {}
    }

    async componentDidMount() {
        const {token, props: {match: {params: {gameId}}}} = this
        const {game} = await Api.getGame(gameId)
        const socketClient = connect('/', {
            path: config.socketPath(NAMESPACE),
            query: `gameId=${gameId}&token=${token}`
        })
        this.registerStateReducer(socketClient)
        this.setState(() => ({
            game,
            socketClient,
            frameEmitter: new FrameEmitter(socketClient as any)
        }), () =>
            socketClient.emit(baseEnum.SocketEvent.online, (actor: IActor) => {
                if (token && (actor.token !== token)) {
                    location.href = `${location.origin}${location.pathname}?token=${actor.token}`
                } else {
                    this.setState({actor})
                }
            }))
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
            state: {game, actor, gameState, playerState, playerStates, frameEmitter}
        } = this
        if (!gameTemplate || !gameState) {
            return <MaskLoading/>
        }
        const {Play4Owner, Result4Owner, Play, Result} = gameTemplate
        if (!PRODUCT_ENV) {
            console.log(gameState, playerState || playerStates)
        }
        if (actor.type === baseEnum.Actor.owner) {
            return <section className={style.play4owner}>
                <GameControl {...{
                    game,
                    gameState,
                    playerStates,
                    frameEmitter,
                    historyPush: path => history.push(path)
                }}/>
                {
                    gameState.status === baseEnum.GameStatus.over ?
                        <GameResult {...{game, Result4Owner}}/> :
                        <Play4Owner {...{
                            game,
                            frameEmitter,
                            gameState,
                            playerStates
                        }}/>
                }
            </section>
        }
        if (!playerState) {
            return <MaskLoading/>
        }
        switch (gameState.status) {
            case baseEnum.GameStatus.paused:
                return <MaskLoading label={lang.Mask_GamePaused}/>
            case baseEnum.GameStatus.started:
                return <Play {...{game, gameState, playerState, frameEmitter}}/>
            case baseEnum.GameStatus.over:
                return <Result {...{game, gameState, playerState}}/>
        }
    }
}
