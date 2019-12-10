import * as React from 'react'
import { Group } from '@extend/client'
import { Button, InputNumber, Table } from 'antd'
import * as style from './style.scss'
import {
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  Mode,
  MoveType,
  PlayerRoundStatus,
  PlayerStatus,
  PushType
} from '../config'
import { Lang, MaskLoading } from '@elf/component'
import { FrameEmitter } from '@bespoke/share'

function RoundPlay({
  playerRoundState,
  gameRoundState,
  groupParams,
  frameEmitter,
  playerIndex
}: {
  groupParams: ICreateParams
  playerRoundState: IPlayerRoundState
  gameRoundState: IGameRoundState
  frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
  playerIndex: number
}) {
  const lang = Lang.extractLang({
    timeLeft: ['剩余时间', 'Time Left'],
    yourNo: [],
    tips: ['本回合您拿出多少实验币投入公共资金池？'],
    tips2reward: ['您将拿出多少用于奖励投入最多的人？'],
    tips2punish: ['您将拿出多少用于惩罚投入最少的人？'],
    submit: ['提交'],
    waiting: ['等待其它玩家提交...'],
    playerNo: ['玩家编号'],
    x: ['投入'],
    d: ['奖惩成本'],
    extra: ['奖/惩'],
    result: ['最终收益'],
    you: ['（你）'],
    toNextRound: ['等待进入下一轮...']
  })
  const [x, setX] = React.useState(null)
  const [d, setD] = React.useState(null)
  const { timeLeft, reward } = gameRoundState
  switch (playerRoundState.status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <label className={style.timeLeft}>
            {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
          </label>
          <p className={style.playTips}>{lang.tips}</p>
          <InputNumber
            placeholder={`0≤x≤${groupParams.M}`}
            value={x}
            onChange={v => setX(+v)}
            min={0}
            max={groupParams.M}
          />
          {groupParams.mode === Mode.normal ? null : (
            <>
              <p className={style.playTips}>{groupParams.mode === Mode.reward ? lang.tips2reward : lang.tips2punish}</p>
              <InputNumber
                placeholder={`0≤d≤${groupParams.M - x}`}
                value={d}
                onChange={v => setD(+v)}
                min={0}
                max={groupParams.M - x}
              />
            </>
          )}
          <br />
          <Button type="primary" onClick={() => frameEmitter.emit(MoveType.submit, { x, d })}>
            {lang.submit}
          </Button>
        </section>
      )
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.waiting} />
    case PlayerRoundStatus.result:
      return (
        <section className={style.roundResult}>
          <Table
            pagination={false}
            columns={[
              {
                title: lang.playerNo,
                dataIndex: 'index',
                key: 'index',
                render: i => (
                  <div>
                    {i + 1}
                    {i === playerIndex ? lang.you : null}
                  </div>
                )
              },
              {
                title: lang.x,
                dataIndex: 'x',
                key: 'x'
              },
              {
                title: lang.d,
                dataIndex: 'd',
                key: 'd'
              },
              {
                title: lang.extra,
                dataIndex: 'extra',
                key: 'extra'
              },
              {
                title: lang.result,
                dataIndex: 'result',
                key: 'result'
              }
            ]}
            dataSource={gameRoundState.players.map(({ x, d, extra }, i) => ({
              index: i,
              x,
              d,
              extra,
              result: x + reward - d + extra
            }))}
          />
          <label className={style.toNextRound}>{lang.toNextRound}</label>
        </section>
      )
  }
}

class GroupPlay extends Group.Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    round1: ['第', 'Round'],
    round2: ['轮', ''],
    wait4OtherPlayers: ['等待其它玩家加入......'],
    gameOver: ['所有轮次结束，等待老师关闭实验']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { playerState, groupGameState, groupFrameEmitter, groupParams }
    } = this
    if (playerState.status === PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
          <p>
            本实验共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员。每名成员在实验开始时都有M实验币，您可以选择拿出一部分实验币出来作为公共资金投资。每组的公共资金总和将会翻K倍，然后平均返回给该组的N人。您的收益将等于您从您所在组的公共资金中获得的回报加上您未投入公共资金池的实验币。此外，可以选择花费一定的成本惩罚投资公共资金池最少的人，具体的惩罚机制为：花费惩罚成本的参与者在原来的基础上减少d，收到惩罚的参与者实验收益减少P*d，其中P为惩罚参数，大于0小于等于1。
          </p>
          <Button type="primary" onClick={() => groupFrameEmitter.emit(MoveType.guideDone)}>
            Start
          </Button>
        </section>
      )
    }
    if (playerState.status === PlayerStatus.result) {
      return <section className={style.groupResult}>{lang.gameOver}</section>
    }
    const playerRoundState = playerState.rounds[groupGameState.round],
      gameRoundState = groupGameState.rounds[groupGameState.round]
    if (!playerRoundState) {
      return <MaskLoading label={lang.wait4OtherPlayers} />
    }
    return (
      <section className={style.groupPlay}>
        <h2 className={style.title}>
          {lang.round1}
          {groupGameState.round + 1}
          {lang.round2}
        </h2>
        <RoundPlay
          {...{
            groupParams,
            playerRoundState,
            gameRoundState,
            frameEmitter: groupFrameEmitter,
            playerIndex: playerState.index
          }}
        />
      </section>
    )
  }
}

export class Play extends Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupPlay = GroupPlay
}
