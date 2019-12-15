import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, Radio, Table } from 'antd'
import * as style from './style.scss'
import {
  awardLimit,
  Choice,
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

function RoundPlay({
  roundFrameEmitter,
  roundParams: { awardA, awardB },
  roundGameState,
  roundPlayerState
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
    tips: ['请您作出下列情况下您的选择 : '],
    submit: ['提交'],
    waiting: ['等待其它玩家提交...'],
    playerNo: ['玩家编号'],
    result: ['最终收益'],
    you: ['（你）'],
    toNextRound: ['等待进入下一轮...'],
    roundOver1: ['您已完成本轮实验'],
    roundOver2: ['您抽中第'],
    roundOver3: ['组彩票，您的选择是'],
    roundOver4: [success => `${success ? '中奖了' : '未中奖'},收益为`]
  })
  const [preference, setPreference] = React.useState([])
  const { timeLeft } = roundGameState
  switch (roundPlayerState.status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <label className={style.timeLeft}>
            {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
          </label>
          <p className={style.playTips}>{lang.tips}</p>
          <br />
          {Array(roundPlayerState.T)
            .fill(null)
            .map((_, i) => {
              const p1 = (i / roundPlayerState.T).toFixed(1),
                p2 = (1 - +p1).toFixed(1)
              return (
                <Radio.Group
                  key={i}
                  value={preference[i]}
                  onChange={({ target: { value } }) => {
                    const p = preference.slice()
                    p[i] = value
                    let switchCount = 0
                    for (let j = 1; j < p.length; j++) {
                      const cur = p[j],
                        pre = p[j - 1]
                      if (cur !== undefined && pre !== undefined && cur !== pre) {
                        switchCount++
                      }
                    }
                    if (switchCount <= 1) {
                      setPreference(p)
                    }
                  }}
                >
                  <Radio value={Choice.A}>
                    以<em>{p1}</em>的概率获得<em>{awardA}</em>,<em>{p2}</em>
                    的概率获得<em>{awardLimit - awardA}</em>
                  </Radio>
                  <Radio value={Choice.B}>
                    以<em>{p1}</em>的概率获得<em>{awardB}</em>,<em>{p2}</em>
                    的概率获得<em>{awardLimit - awardB}</em>
                  </Radio>
                </Radio.Group>
              )
            })}
          <br />
          <Button type="primary" onClick={() => roundFrameEmitter.emit(RoundMoveType.submit, { preference })}>
            {lang.submit}
          </Button>
        </section>
      )
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.waiting} />
    case PlayerRoundStatus.result: {
      const {
        result: { caseIndex, award, success },
        preference
      } = roundPlayerState
      return (
        <section className={style.roundResult}>
          <p>
            {lang.roundOver1}&nbsp;,&nbsp;
            {lang.roundOver2}
            <em>{caseIndex + 1}</em>
            {lang.roundOver3}
            <em>{preference[caseIndex] === Choice.A ? 'A' : 'B'}</em>
            &nbsp;,&nbsp;
            {lang.roundOver4(success)}
            <em>{award}</em>
          </p>
          <label className={style.toNextRound}>{lang.toNextRound}</label>
        </section>
      )
    }
  }
}

export function RoundHistory({
  game,
  playerState
}: Round.Round.IHistoryProps<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
>) {
  const { groupSize } = game.params
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
      key: 'playerIndex'
    },
    {
      title: '题目数量',
      dataIndex: 'T',
      key: 'T'
    },
    {
      title: '偏好选择',
      dataIndex: 'preference',
      key: 'preference'
    },
    {
      title: '结果题号',
      dataIndex: 'caseIndex',
      key: 'caseIndex'
    },
    {
      title: '是否选中',
      dataIndex: 'success',
      key: 'success'
    },
    {
      title: '收益',
      dataIndex: 'award',
      key: 'award'
    }
  ]
  const dataSource = []
  playerState.rounds.forEach(
    (
      {
        T,
        preference,
        result = {
          caseIndex: undefined,
          success: false,
          award: 0
        }
      },
      r
    ) => {
      const { caseIndex, success, award } = result
      dataSource.push({
        round: r,
        playerIndex: playerState.index + 1,
        T,
        preference: (preference ? preference.map(c => (c === Choice.A ? 'A' : 'B')) : []).join('>'),
        caseIndex: caseIndex === undefined ? '' : +caseIndex + 1,
        success: success.toString(),
        award
      })
    }
  )
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
      本实验要求您在以下T个成对彩票中选择，即需要做T次选择。彩票A为：以P1的概率获得S1单位实验币，以1-P1的概率获得S2实验币；彩票B为：以P2的概率获得S3单位实验币，以1-P2的概率获得S4实验币。
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
