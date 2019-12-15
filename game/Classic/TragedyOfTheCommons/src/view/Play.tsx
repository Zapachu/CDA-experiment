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
  PlayerRoundStatus,
  PushType,
  RoundMoveType
} from '../config'
import { Lang, MaskLoading } from '@elf/component'
import { GroupDecorator } from '@extend/share'

function RoundPlay({
  roundFrameEmitter,
  roundParams: { M },
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
    tips: ['本回合您从公共鱼塘捕鱼多少？'],
    submit: ['提交'],
    waiting: ['等待其它玩家提交...'],
    playerNo: ['玩家编号'],
    x: ['捕获量'],
    result: ['最终收益'],
    you: ['（你）'],
    toNextRound: ['等待进入下一轮...']
  })
  const [x, setX] = React.useState(null)
  const { timeLeft, reward, xArr } = roundGameState
  switch (roundPlayerState.status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <label className={style.timeLeft}>
            {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
          </label>
          <p className={style.playTips}>{lang.tips}</p>
          <InputNumber placeholder={`0≤x≤${M}`} value={x} onChange={v => setX(+v)} min={0} max={M} />
          <br />
          <Button type="primary" onClick={() => roundFrameEmitter.emit(RoundMoveType.submit, { x })}>
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
                title: lang.result,
                dataIndex: 'result',
                key: 'result'
              }
            ]}
            dataSource={roundGameState.xArr.map((x, i) => ({
              index: i,
              x,
              result: x + reward
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
      title: '捕获',
      dataIndex: 'x'
    },
    {
      title: '最终受益',
      dataIndex: 'result'
    }
  ]
  const dataSource = []
  groupGameState.rounds.forEach(({ xArr, reward }, r) => {
    for (let index = 0; index < groupSize; index++) {
      const x = xArr[index]
      if (showHistory === GroupDecorator.ShowHistory.selfOnly && index !== playerState.index) {
        continue
      }
      dataSource.push({
        rowSpan: showHistory === GroupDecorator.ShowHistory.selfOnly ? 1 : index === 0 ? groupSize : 0,
        round: r,
        playerIndex: index,
        x,
        result: reward ? x + reward : ''
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
      本实验共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员。每一轮每组成员共有一个鱼塘资源，每年可产鱼N*M单位，您可以选择现在就从公共鱼塘资源中捕鱼x单位（大于等于0小于等于M）。每轮结束时，鱼塘中剩余的鱼将在来年翻K倍，然后平均分给该组的N人。您的收益将等于您从您所在组的公共鱼塘中获得的回报加上您之前从公共鱼塘中捕捞的鱼产量.
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
