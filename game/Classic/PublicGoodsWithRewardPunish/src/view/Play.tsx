import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, InputNumber, Table } from 'antd'
import * as style from './style.scss'
import {
  GroupMoveType,
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  IRoundCreateParams,
  IRoundGameState,
  IRoundMoveParams,
  IRoundPlayerState,
  Mode,
  PlayerRoundStatus,
  PushType,
  RoundMoveType
} from '../config'
import { Lang, MaskLoading } from '@elf/component'
import { GroupDecorator } from '@extend/share'

function RoundPlay({
  roundFrameEmitter,
  roundParams: { M, P, mode, t, K },
  roundGameState,
  roundPlayerState,
  playerState
}: Round.Round.IPlayProps<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
>) {
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
  const { timeLeft, reward } = roundGameState
  switch (roundPlayerState.status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <label className={style.timeLeft}>
            {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
          </label>
          <p className={style.playTips}>{lang.tips}</p>
          <InputNumber placeholder={`0≤x≤${M}`} value={x} onChange={v => setX(+v)} min={0} max={M} />
          {mode === Mode.normal ? null : (
            <>
              <p className={style.playTips}>{mode === Mode.reward ? lang.tips2reward : lang.tips2punish}</p>
              <InputNumber placeholder={`0≤d≤${M - x}`} value={d} onChange={v => setD(+v)} min={0} max={M - x} />
            </>
          )}
          <br />
          <Button type="primary" onClick={() => roundFrameEmitter.emit(RoundMoveType.submit, { x, d })}>
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
                    {i === playerState.index ? lang.you : null}
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
            dataSource={roundGameState.players.map(({ x, d, extra }, i) => ({
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

function RoundHistory({
  game,
  playerState,
  groupGameState
}: Round.Round.IHistoryProps<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
>) {
  const { groupSize, showHistory } = game.params
  const columns = [
    {
      title: '轮次',
      dataIndex: 'round',
      render: (r, { rowSpan }) => ({
        children: r + 1,
        props: { rowSpan }
      })
    },
    {
      title: '编号',
      dataIndex: 'playerIndex',
      render: i => `${i + 1}${playerState.index === i ? '(你)' : ''}`
    },
    {
      title: '投入',
      dataIndex: 'x'
    },
    {
      title: '回报',
      dataIndex: 'reward'
    },
    {
      title: '奖惩成本',
      dataIndex: 'd'
    },
    {
      title: '奖/惩',
      dataIndex: 'extra'
    },
    {
      title: '最终收益',
      dataIndex: 'result'
    }
  ]
  const dataSource = []
  groupGameState.rounds.forEach(({ players, reward }, r) => {
    for (let index = 0; index < groupSize; index++) {
      const { x, d, extra } = players[index]
      if (showHistory === GroupDecorator.ShowHistory.selfOnly && index !== playerState.index) {
        continue
      }
      dataSource.push({
        rowSpan: showHistory === GroupDecorator.ShowHistory.selfOnly ? 1 : index === 0 ? groupSize : 0,
        round: r,
        playerIndex: index,
        x,
        d,
        extra,
        reward,
        result: reward ? x + reward - d + extra : ''
      })
    }
  })
  return <Table pagination={{ pageSize: groupSize * 2 }} size={'small'} columns={columns} dataSource={dataSource} />
}

class GroupPlay extends Round.Play<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  RoundPlay = RoundPlay

  RoundHistory = RoundHistory

  RoundGuide = () => (
    <p>
      本实验共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员。每名成员在实验开始时都有M实验币，您可以选择拿出一部分实验币出来作为公共资金投资。每组的公共资金总和将会翻K倍，然后平均返回给该组的N人。您的收益将等于您从您所在组的公共资金中获得的回报加上您未投入公共资金池的实验币。此外，可以选择花费一定的成本惩罚投资公共资金池最少的人，具体的惩罚机制为：花费惩罚成本的参与者在原来的基础上减少d，收到惩罚的参与者实验收益减少P*d，其中P为惩罚参数，大于0小于等于1。
    </p>
  )
}

export class Play extends Group.Play<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  GroupMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupPlay = GroupPlay
}
