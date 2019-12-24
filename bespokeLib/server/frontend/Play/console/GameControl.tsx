import * as React from 'react'
import * as style from './style.scss'
import {
  CoreMove,
  FrameEmitter,
  GameStatus,
  IGameWithId,
  ISimulatePlayer,
  TGameState,
  TPlayerState
} from '@bespoke/share'
import { Button, Col, Row } from 'antd'
import { Lang } from '@elf/component'
import { Api } from '../../util'

const { started, paused, over } = GameStatus

export function GameControl({
  game,
  gameState,
  playerStates,
  frameEmitter
}: {
  game: IGameWithId<{}>
  gameState: TGameState<{}>
  playerStates: { [key: string]: TPlayerState<{}> }
  frameEmitter: FrameEmitter<any, any, any, any>
  historyPush: (path: string) => void
}) {
  const lang = Lang.extractLang({
      gameStatus: ['实验状态', 'Game Status'],
      notStarted: ['未开始', 'Not Started'],
      started: ['进行中', 'Playing'],
      paused: ['已暂停', 'Paused'],
      over: ['已关闭', 'Closed'],
      start: ['开始', 'START'],
      pause: ['暂停', 'PAUSE'],
      resume: ['恢复', 'RESUME'],
      stop: ['关闭', 'CLOSE'],
      onlinePlayers: ['当前在线人数', 'Online Players'],
      players: ['实验成员', 'Players'],
      operate: ['手动操作', 'Operate'],
      simulatePlayers: ['模拟玩家', 'SimulatePlayers']
    }),
    gameStatusMachine = {
      [started]: [
        {
          status: over,
          label: lang.stop,
          type: 'danger'
        },
        {
          status: paused,
          label: lang.pause
        }
      ],
      [paused]: [
        {
          status: over,
          label: lang.stop,
          type: 'danger'
        },
        {
          status: started,
          label: lang.resume,
          type: 'primary'
        }
      ]
    }
  if (!gameState) {
    return null
  }
  return (
    <section className={style.gameControl}>
      <Row>
        <Col offset={1} span={2}>
          <div className={style.subTitle}>{lang.operate}</div>
        </Col>
        <Col span={18}>
          <div>
            {`${lang.gameStatus}: ${
              {
                [started]: lang.start,
                [paused]: lang.paused,
                [over]: lang.over
              }[gameState.status]
            }`}
          </div>
          <div className={style.switcherWrapper}>
            {(gameStatusMachine[gameState.status] || []).map(({ status, label, type }) => (
              <Button
                {...{
                  key: label,
                  type,
                  onClick: () => frameEmitter.emit(CoreMove.switchGameStatus, { status }),
                  style: { marginRight: '1rem' }
                }}
              >
                {label}
              </Button>
            ))}
          </div>
        </Col>
      </Row>
      <br />
      <Row>
        <Col offset={1} span={2}>
          <div className={style.subTitle}>{lang.simulatePlayers}</div>
        </Col>
        <Col span={18}>
          <div>{`${lang.onlinePlayers}: ${Object.values(playerStates).length}`}</div>
          <SimulatePlayer gameId={game.id} />
        </Col>
      </Row>
    </section>
  )
}

function SimulatePlayer({ gameId }: { gameId: string }) {
  const MAX_SIZE = 24,
    lang = Lang.extractLang({
      AddPlayer: ['添加玩家', 'Add Player'],
      StartAll: ['全部启动', 'Start All'],
      player: ['玩家', 'Player']
    })
  const [simulatePlayers, setSimulatePlayers] = React.useState([] as ISimulatePlayer[])
  React.useEffect(() => {
    Api.getSimulatePlayers(gameId).then(r => setSimulatePlayers(r.simulatePlayers))
  }, [])

  async function addSimulatePlayer() {
    if (simulatePlayers.length >= MAX_SIZE) {
      return
    }
    const name = lang.player + String.fromCharCode(65 + simulatePlayers.length)
    const { token } = await Api.newSimulatePlayer(gameId, name)
    setSimulatePlayers([...simulatePlayers, { gameId, token, name }])
  }

  return (
    <section className={style.simulatePlayer}>
      <div className={style.playerNames}>
        {simulatePlayers.map(({ token, name }) => (
          <a key={token} href={`${window.location.origin}${window.location.pathname}?token=${token}`} target="_blank">
            {name}
          </a>
        ))}
        <span>
          ({simulatePlayers.length}/{MAX_SIZE})
        </span>
      </div>
      <div>
        <Button type={'primary'} onClick={() => addSimulatePlayer()} style={{ marginRight: '1rem' }}>
          {lang.AddPlayer}
        </Button>
        <Button
          type={'primary'}
          onClick={() =>
            simulatePlayers.forEach(({ token }) =>
              window.open(`${window.location.origin}${window.location.pathname}?token=${token}`, '_blank')
            )
          }
        >
          {lang.StartAll}
        </Button>
      </div>
    </section>
  )
}
