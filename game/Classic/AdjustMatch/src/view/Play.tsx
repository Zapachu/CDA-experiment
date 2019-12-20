import * as React from 'react'
import { Component, Group, Round } from '@extend/client'
import { Button, Table, Tag } from 'antd'
import * as style from './style.scss'
import {
  GoodStatus,
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
    yourSeq: ['您的优先序为'],
    dragPlease: ['，请拖拽下方物品列表进行偏好表达'],
    goodNo: ['物品', 'Good'],
    privateValue: ['心理价值', 'Private Value'],
    goodStatus: ['物品状态', 'Good Status'],
    leftMarket: ['已离开市场', 'Left market'],
    beingOwned: ['被持有', 'Being owned'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    wait4OldPlayers: ['等待旧租户决定是否参与交换......'],
    wait4Others: ['等待其它玩家提交......'],
    join: ['参与'],
    leave: ['不参与'],
    submit: ['提交', 'Submit'],
    roundOver1: ['您已完成本轮实验'],
    roundOver2: ['初始分配到的物品为'],
    roundOver3: ['其价值为'],
    roundOver4: ['最终分配到的物品为'],
    toNextRound: ['等待进入下一轮...'],
    preference: ['偏好'],
    preferNo: [n => `第${n}喜欢`],
    yourRole: ['您本轮的身份为'],
    oldPlayer: ['旧租户'],
    newPlayer: ['新租户']
  })
  const indexInGroup = playerState.index,
    { goodStatus, initAllocation, allocation } = roundGameState,
    { status, index: indexInRound } = roundPlayerState,
    privatePrices = roundParams.privatePriceMatrix[indexInGroup]
  const colStyle: React.CSSProperties = {
    minWidth: '6rem',
    maxWidth: '12rem'
  }
  switch (status) {
    case PlayerRoundStatus.prePlay:
    case PlayerRoundStatus.wait4Play:
      return <PrePlay status={status} />
    case PlayerRoundStatus.play:
      return <Play />
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.wait4Others} />
    case PlayerRoundStatus.result:
      const good = allocation[indexInRound],
        initGood = initAllocation[indexInRound]
      return (
        <div className={style.roundResult}>
          <p>
            {lang.roundOver1}&nbsp;,&nbsp;
            {initGood === null ? null : (
              <>
                {lang.roundOver2}
                <em>{String.fromCharCode(65 + initGood)}</em>&nbsp;,&nbsp;{lang.roundOver3}
                <em>{privatePrices[initGood]}</em>&nbsp;,&nbsp;
              </>
            )}
            {lang.roundOver4}
            <em>{String.fromCharCode(65 + good)}</em> &nbsp;,&nbsp;
            {lang.roundOver3}
            <em>{privatePrices[good]}</em>
          </p>
          <label className={style.toNextRound}>{lang.toNextRound}</label>
        </div>
      )
  }

  function PrePlay({ status }: { status: PlayerRoundStatus }) {
    return (
      <section className={style.roundPlay}>
        <label style={{ marginBottom: '1rem' }}>
          {lang.yourRole}
          <em style={{ padding: '.5rem', fontSize: '1.5rem' }}>
            {initAllocation[indexInRound] === null ? lang.newPlayer : lang.oldPlayer}
          </em>
        </label>
        <Table
          size="middle"
          pagination={false}
          columns={[
            {
              title: lang.goodNo,
              dataIndex: 'key',
              key: 'key',
              render: v => <div style={colStyle}>{String.fromCharCode(65 + v)}</div>
            },
            {
              title: lang.privateValue,
              dataIndex: 'price',
              key: 'price',
              render: v => <div style={colStyle}>{v}</div>
            },
            {
              title: lang.goodStatus,
              dataIndex: 'goodStatus',
              key: 'goodStatus',
              render: (goodStatus, { isYou }) => (
                <div style={colStyle}>
                  {goodStatus === GoodStatus.old || goodStatus === GoodStatus.left ? (
                    isYou ? (
                      <Tag color="green">{lang.beingOwnedByYou}</Tag>
                    ) : (
                      <Tag color="blue">{lang.beingOwned}</Tag>
                    )
                  ) : null}
                </div>
              )
            }
          ]}
          dataSource={goodStatus.map((_, i) => ({
            key: i,
            price: privatePrices[i],
            goodStatus: goodStatus[i],
            isYou: i === initAllocation[indexInRound]
          }))}
        />
        <div className={style.btnsWrapper}>
          {status === PlayerRoundStatus.wait4Play ? (
            lang.wait4OldPlayers
          ) : (
            <>
              <Button onClick={() => roundFrameEmitter.emit(RoundMoveType.overPrePlay, { join: false })}>
                {lang.leave}
              </Button>
              <Button
                onClick={() => roundFrameEmitter.emit(RoundMoveType.overPrePlay, { join: true })}
                type={'primary'}
              >
                {lang.join}
              </Button>
            </>
          )}
        </div>
      </section>
    )
  }

  function Play() {
    const sortableGoods = [],
      leftGoods = []
    goodStatus.forEach((s, i) => (s === GoodStatus.left ? leftGoods : sortableGoods).push(i))
    const [sort, setSort] = React.useState(sortableGoods)
    return (
      <section className={style.roundPlay}>
        <label style={{ marginBottom: '1rem' }}>
          {lang.yourSeq}
          <em
            style={{
              padding: '.5rem',
              fontSize: '1.5rem'
            }}
          >
            {indexInRound + 1 - allocation.filter((s, i) => s !== null && i < indexInRound).length}
          </em>
          {lang.dragPlease}
        </label>{' '}
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
              key: 'key',
              render: v => <div style={colStyle}>{String.fromCharCode(65 + v)}</div>
            },
            {
              title: lang.privateValue,
              dataIndex: 'price',
              key: 'price',
              render: v => <div style={colStyle}>{v}</div>
            },
            {
              title: lang.goodStatus,
              dataIndex: 'goodStatus',
              key: 'goodStatus',
              render: (goodStatus, { isYou }) => (
                <div style={colStyle}>
                  {goodStatus === GoodStatus.left ? (
                    <Tag color="gray">{lang.leftMarket}</Tag>
                  ) : goodStatus === GoodStatus.old ? (
                    isYou ? (
                      <Tag color="green">{lang.beingOwnedByYou}</Tag>
                    ) : (
                      <Tag color="blue">{lang.beingOwned}</Tag>
                    )
                  ) : null}
                </div>
              )
            }
          ]}
          data={sort.map((i, j) => ({
            key: i,
            price: privatePrices[i],
            goodStatus: goodStatus[i],
            isYou: i === initAllocation[indexInRound],
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
      title: '编号',
      dataIndex: 'indexInGroup',
      render: i => `${i + 1}${playerState.index === i ? '(你)' : ''}`
    },
    {
      title: '优先序',
      dataIndex: 'indexInRound',
      render: i => i + 1
    },
    {
      title: '心理价值',
      dataIndex: 'privatePrices'
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role'
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
  groupGameState.rounds.slice(0, groupGameState.round).forEach(({ indices, initAllocation, allocation }, r) =>
    indices.forEach((indexInRound, indexInGroup) => {
      const good = allocation[indexInRound]
      const privatePrices = groupParams.roundsParams[r].privatePriceMatrix[indexInGroup]
      if (showHistory === GroupDecorator.ShowHistory.selfOnly && indexInGroup !== playerState.index) {
        return
      }
      const roundPlayerState = playerState.rounds[r]
      dataSource.push({
        rowSpan: showHistory === GroupDecorator.ShowHistory.selfOnly ? 1 : indexInGroup === 0 ? groupSize : 0,
        round: r,
        indexInGroup,
        indexInRound,
        privatePrices: privatePrices.join(' , '),
        role: initAllocation[indexInGroup] === null ? '新租户' : '旧租户',
        sort:
          playerState.index === indexInRound
            ? roundPlayerState.sort.map(v => String.fromCharCode(65 + v)).join('>')
            : null,
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
      本实验是关于调整匹配机制的实验，实验分为G组，每组N人，共进行R回合，每位参与者将会被随机的分配到某个组中。实验中，系统随机生成您和物品对应的编号，每件物品对于您的私有价值不同（每件物品拥有不同的编号且私有价值不同即偏好是严格的，不能出现并列排序），该私有价值是系统在V1—V2之间产生的随机数。参与者对于物品的偏好按系统随机生产的私有价值由高到低排序即参与者依据系统生成的私有价值对物品进行偏好表达，依次输入偏好以后每位参与者会随机分配到一件物品即初始匹配（Mi-
      Nj），该物品对于参与者有一个特定的价值即私有价值。您需依据初次分配得到的物品以及其他物品对于自身的私有价值进行交换。请您阅读材料并按相关提示进行操作。您的收益将依交换的最终结果为计算依据，即参与者匹配到第一喜欢、第二喜欢、第三喜欢等的收益依次为E1、E2、E3…..（E1>E2>E3）（实验者自行设置）
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
