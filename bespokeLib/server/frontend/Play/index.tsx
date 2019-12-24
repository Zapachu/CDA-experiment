import * as React from 'react'
import {
  Actor,
  config,
  FrameEmitter,
  GameStatus,
  IActor,
  IGameWithId,
  ResponseCode,
  SocketEvent,
  TGameState,
  TPlayerState,
  TSocket
} from '@bespoke/share'
import { Lang, MaskLoading } from '@elf/component'
import { Api, TPageProps } from '../util'
import { connect } from 'socket.io-client'
import { applyChange, Diff } from 'deep-diff'
import * as queryString from 'query-string'
import { GameControl } from './console/GameControl'
import { GameResult } from './console/GameResult'
import { Card, Layout } from 'antd'
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
    control: ['实验操作', 'Status Control'],
    playerState: ['玩家状态', 'Player State'],
    gameResult: ['实验结果', 'Game Result'],
    Mask_GamePaused: ['实验已暂停', 'Experiment Paused']
  })

  state: IPlayState = {
    playerStates: {}
  }

  async componentDidMount() {
    const {
      token,
      props: {
        history,
        match: {
          params: { gameId }
        }
      }
    } = this
    const { code, game } = await Api.getGame(gameId)
    if (code !== ResponseCode.success) {
      history.push('/404')
      return
    }
    const socketClient = connect('/', {
      path: config.socketPath(NAMESPACE),
      query: `gameId=${gameId}&token=${token}`
    })
    this.setState(
      {
        game,
        socketClient,
        frameEmitter: new FrameEmitter(socketClient as any)
      },
      () => this.registerStateReducer()
    )
  }

  componentWillUnmount(): void {
    if (this.state.socketClient) {
      this.state.socketClient.close()
    }
  }

  applyPlayerState(playerState: TPlayerState<{}>, token?: string) {
    const {
      state: { playerStates }
    } = this
    token
      ? this.setState({
          playerStates: {
            ...playerStates,
            [token]: playerState
          }
        })
      : this.setState({ playerState })
  }

  render(): React.ReactNode {
    const {
      lang,
      props: { history, gameTemplate },
      state: { game, actor, gameState, playerState, playerStates, frameEmitter }
    } = this
    if (!gameTemplate || !gameState) {
      return <MaskLoading />
    }
    const { Play4Owner, Result4Owner, Play, Result } = gameTemplate
    if (!PRODUCT_ENV) {
      console.log(gameState, playerState || playerStates)
    }
    const CardStyle: React.CSSProperties = {
      margin: '1rem'
    }
    if (actor.type === Actor.owner) {
      return (
        <Layout>
          <Card title={lang.control} style={CardStyle}>
            <GameControl
              {...{
                game,
                gameState,
                playerStates,
                frameEmitter,
                historyPush: path => history.push(path)
              }}
            />
          </Card>
          {gameState.status === GameStatus.over ? (
            <Card title={lang.gameResult} style={CardStyle}>
              <GameResult {...{ game, Result4Owner }} />
            </Card>
          ) : (
            <Card title={lang.playerState} style={CardStyle}>
              <Play4Owner
                {...{
                  game,
                  frameEmitter,
                  gameState,
                  playerStates
                }}
              />
            </Card>
          )}
        </Layout>
      )
    }
    if (!playerState) {
      return <MaskLoading />
    }
    switch (gameState.status) {
      case GameStatus.paused:
        return <MaskLoading label={lang.Mask_GamePaused} />
      case GameStatus.started:
        return <Play {...{ game, gameState, playerState, frameEmitter }} />
      case GameStatus.over:
        return <Result {...{ game, gameState, playerState }} />
    }
  }

  private registerStateReducer() {
    const {
      token,
      props: { history },
      state: { socketClient }
    } = this
    socketClient.on(SocketEvent.connection, (actor: IActor) => {
      if (!actor) {
        return history.push('/404')
      }
      if (token && actor.token !== token) {
        location.href = `${location.origin}${location.pathname}`
      } else {
        this.setState({ actor })
      }
      socketClient.emit(SocketEvent.online)
    })
    socketClient.on(SocketEvent.syncGameState_json, (gameState: TGameState<{}>) => {
      this.setState({ gameState })
    })
    socketClient.on(SocketEvent.changeGameState_diff, (stateChanges: Array<Diff<any>>) => {
      let gameState = cloneDeep(this.state.gameState) || ({} as any)
      stateChanges.forEach(change => applyChange(gameState, null, change))
      this.setState({ gameState })
    })
    socketClient.on(SocketEvent.syncPlayerState_json, (playerState: TPlayerState<{}>, token?: string) =>
      this.applyPlayerState(playerState, token)
    )
    socketClient.on(SocketEvent.changePlayerState_diff, (stateChanges: Array<Diff<any>>, token?: string) => {
      const {
        state: { playerStates }
      } = this
      let playerState: TPlayerState<{}> = cloneDeep(token ? playerStates[token] : this.state.playerState) || ({} as any)
      stateChanges.forEach(change => applyChange(playerState, null, change))
      token
        ? this.setState({
            playerStates: {
              ...playerStates,
              [token]: playerState
            }
          })
        : this.setState({ playerState })
    })
  }
}
