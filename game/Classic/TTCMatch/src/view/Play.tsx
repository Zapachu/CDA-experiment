import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { Button, Table, Tag } from 'antd'
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
    dragPlease: ['请拖拽下方物品列表进行偏好表达'],
    goodNo: ['物品', 'Good'],
    privateValue: ['心理价值', 'Private Value'],
    goodStatus: ['物品状态', 'Good Status'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    wait4Others: ['等待其它玩家提交......'],
    submit: ['提交', 'Submit'],
    roundOver1: ['您已完成本轮实验'],
    roundOver2: ['初始分配到的物品为'],
    roundOver3: ['其价值为'],
    roundOver4: ['最终分配到的物品为'],
    toNextRound: ['等待进入下一轮...'],
    preference: ['偏好'],
    preferNo: [n => `第${n}喜欢`]
  })
  const playerIndex = playerState.index,
    { initAllocation, allocation } = roundGameState,
    { status } = roundPlayerState,
    privatePrices = roundParams.privatePriceMatrix[playerIndex]
  const [sort, setSort] = React.useState(privatePrices.map((_, i) => i))
  switch (status) {
    case PlayerRoundStatus.play:
      return <Play />
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.wait4Others} />
    case PlayerRoundStatus.result:
      const good = allocation[playerIndex],
        initGood = initAllocation[playerIndex]
      return (
        <div className={style.roundResult}>
          <p>
            {lang.roundOver1}&nbsp;,&nbsp;
            {initGood === null ? null : (
              <>
                {lang.roundOver2}
                <em>{initGood + 1}</em>&nbsp;,&nbsp;{lang.roundOver3}
                <em>{privatePrices[initGood]}</em>&nbsp;,&nbsp;
              </>
            )}
            {lang.roundOver4}
            <em>{good + 1}</em> &nbsp;,&nbsp;
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
        <label style={{ marginBottom: '1rem' }}>{lang.dragPlease}</label>
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
            },
            {
              title: lang.goodStatus,
              dataIndex: 'isYou',
              render: isYou => (
                <div style={colStyle}>{isYou ? <Tag color="green">{lang.beingOwnedByYou}</Tag> : null}</div>
              )
            }
          ]}
          data={sort.map((i, j) => ({
            key: i,
            price: privatePrices[i],
            isYou: i === initAllocation[playerIndex],
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
  const { groupSize } = game.params
  const showHistory = 2
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
      title: '心理价值',
      dataIndex: 'privatePrices'
    },
    {
      title: '偏好表达',
      dataIndex: 'sort'
    },
    {
      title: '分得物品编号',
      dataIndex: 'good'
    },
    {
      title: '分得物品价格',
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
        sort: playerState.index === i ? playerState.rounds[r].sort.join('>') : null,
        good: good + 1,
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
      本实验是一个关于物品交换的实验，运用顶层交易循环（简称TTC机制），让拥有与N个参与者（每人拥有一个物品）进行交换。实验分为G组，每组N人，共进行R轮，每位参与者将会随机分配到某组中。实验中，系统先随机生成参与者拥有的物品编号，每件物品对于每位参与者的心理价值不同（每件物品心理价值即真实偏好是严格的，即不会出现并列排序），该心理价值是系统在[V1,V2]间产生的随机数（每轮随机或相同可选）。实验开始时系统将随机分给每位参与者一个物品
      。实验开始后，参与者需要依据系统随机分配的初始物品和该物品对应的心理价值，按相关提示输入你需要交换的物品列表，操作完成后，系统按TTC机制自动匹配。
      交换成功参与者的收益=最终物品对应的心理价值 未交换成功参与者的收益=初始物品对应的心理价值
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
