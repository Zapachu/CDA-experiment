import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { GroupDecorator } from '@extend/share'
import { Button, Table } from 'antd'
import { Lang, MaskLoading } from '@elf/component'
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

function RoundPlay({
  roundParams,
  roundPlayerState,
  roundGameState,
  roundFrameEmitter,
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
    yourSeq: ['您的优先序为'],
    dragPlease: ['，请拖拽下方物品列表进行偏好表达'],
    goodNo: ['物品', 'Good'],
    privateValue: ['心理价值', 'Private Value'],
    leftMarket: ['已离开市场', 'Left market'],
    beingOwned: ['被持有', 'Being owned'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    wait4Others: ['等待其它玩家提交......'],
    submit: ['提交', 'Submit'],
    roundOver1: ['您已完成本轮实验'],
    roundOver3: ['其价值为'],
    roundOver4: ['最终分配到的物品为'],
    toNextRound: ['等待进入下一轮...'],
    preference: ['偏好'],
    preferNo: [n => `第${n}喜欢`]
  })
  const playerIndex = playerState.index,
    { allocation } = roundGameState,
    { status } = roundPlayerState,
    privatePrices = roundParams.privatePriceMatrix[playerIndex]
  const [sort, setSort] = React.useState(privatePrices.map((_, i) => i))
  switch (status) {
    case PlayerRoundStatus.play:
      return <Play />
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.wait4Others} />
    case PlayerRoundStatus.result:
      const good = allocation[playerIndex]
      return (
        <div className={style.roundResult}>
          <p>
            {lang.roundOver1}&nbsp;,&nbsp;
            {lang.roundOver4}
            <em>{String.fromCharCode(65 + good)}</em> &nbsp;,&nbsp;
            {lang.roundOver3}
            <em>{privatePrices[good]}</em>
          </p>
          <label className={style.toNextRound}>{lang.toNextRound}</label>
        </div>
      )
  }

  function Play() {
    const colStyle: React.CSSProperties = {
      minWidth: '6rem',
      maxWidth: '12rem'
    }
    return (
      <section className={style.roundPlay}>
        <label style={{ marginBottom: '1rem' }}>
          {lang.yourSeq}
          <em style={{ padding: '.5rem', fontSize: '1.5rem' }}>{playerIndex + 1}</em>
          {lang.dragPlease}
        </label>
        <Component.DragTable
          columns={[
            {
              title: lang.preference,
              dataIndex: 'preferNo',
              render: v => <div style={colStyle}>{lang.preferNo(v + 1)}</div>
            },
            {
              title: lang.goodNo,
              dataIndex: 'key',
              render: v => <div style={colStyle}>{String.fromCharCode(65 + v)}</div>
            },
            {
              title: lang.privateValue,
              dataIndex: 'price',
              render: v => <div style={colStyle}>{v}</div>
            }
          ]}
          data={sort.map((i, j) => ({
            key: i,
            price: privatePrices[i],
            isYou: i === playerIndex,
            preferNo: j
          }))}
          setData={data => setSort(data.map(({ key }) => key))}
        />
        <div className={style.btnsWrapper}>
          <Button type={'primary'} onClick={() => roundFrameEmitter.emit(RoundMoveType.submit, { sort })}>
            {lang.submit}
          </Button>
        </div>
      </section>
    )
  }
}

export function RoundHistory({
  game,
  playerState,
  groupParams,
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
      title: '优先序',
      dataIndex: 'playerIndex',
      render: i => `${i + 1}${playerState.index === i ? '(你)' : ''}`
    },
    {
      title: '心理价值',
      dataIndex: 'privatePrices'
    },
    {
      title: '偏好表达',
      dataIndex: 'sort'
    },
    {
      title: '最终物品',
      dataIndex: 'good'
    },
    {
      title: '最终物品价格',
      dataIndex: 'goodPrice'
    }
  ]
  const dataSource = []
  groupGameState.rounds.forEach((roundGameState, r) =>
    roundGameState.allocation.forEach((good, i) => {
      const privatePrices = groupParams.roundsParams[r].privatePriceMatrix[i]
      if (showHistory === GroupDecorator.ShowHistory.selfOnly && i !== playerState.index) {
        return
      }
      dataSource.push({
        rowSpan: showHistory === GroupDecorator.ShowHistory.selfOnly ? 1 : i === 0 ? groupSize : 0,
        round: r,
        playerIndex: i,
        privatePrices: privatePrices.join(' , '),
        sort:
          playerState.index === i ? playerState.rounds[r].sort.map(v => String.fromCharCode(65 + v)).join('>') : null,
        good: String.fromCharCode(65 + good),
        goodPrice: privatePrices[good]
      })
    })
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
      本实验是一个关于稳定配置的实验，运用延迟接受算法（简称G-S机制），对N个物品与N个参与者进行配对，每位参与者至多匹配一件物品，
      实验分为G组，每组N人，共进行R轮，每位参与者将会被随机的分配到某组中。实验中，系统先随机生成参与者和物品编号，参与者的编号代表不同的优先序（1-N号，数字越小越优先）。每件物品对于每位参与者的心理价值是系统在[V1,V2]之间产生的随机数（每轮随机或相同可选），参与者依据自己对于物品的心理价值表达对于物品进行偏好表达。参与者按相关提示操作后，系统自动匹配。
      匹配成功参与者收益=匹配到物品对应的心理价值 未匹配成功参与者的收益=0
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
