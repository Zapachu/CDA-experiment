import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, Table, Tag } from 'antd'
import * as style from './style.scss'
import { GroupDecorator } from '@extend/share'
import { Lang } from '@elf/component'
import {
  ExchangeStatus,
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
  PushType,
  RoundMoveType
} from '../config'

function RoundPlay({
  roundParams,
  roundGameState,
  roundFrameEmitter,
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
    goodNo: ['物品', 'Good'],
    privateValue: ['心理价值', 'Private Value'],
    goodStatus: ['物品状态', 'Good Status'],
    operate: ['操作', 'Operate'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    reqExchange: ['请求交换', 'Exchange'],
    resExchange: ['同意交换', 'Agree'],
    exchanged: ['已交换', 'Exchanged'],
    waitRes: ['等待响应...', 'Waiting for response...'],
    exchanging: ['交换中...', 'Exchanging...'],
    timeLeft: ['剩余时间', 'Time Left'],
    resultInfo1: ['您已完成本轮交换，您的初始物品为'],
    resultInfo2: ['其价格为'],
    resultInfo3: ['最终所得物品编号为'],
    resultInfo4: ['其价格为'],
    toNextRound: ['等待进入下一轮...']
  })
  const colStyle: React.CSSProperties = {
    height: '2.5rem',
    minWidth: '6rem',
    maxWidth: '12rem',
    display: 'flex',
    alignItems: 'center'
  }
  const playerIndex = roundPlayerState.index,
    { allocation, exchangeMatrix, timeLeft } = roundGameState,
    privatePrices = roundParams.privatePriceMatrix[playerIndex]
  return (
    <>
      <div className={style.roundPlay}>
        <label className={style.timeLeft}>
          {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
        </label>
        <Table
          pagination={false}
          columns={[
            {
              title: lang.goodNo,
              dataIndex: 'good',
              key: 'good',
              render: v => <div style={colStyle}>{String.fromCharCode(65 + v)}</div>
            },
            {
              title: lang.privateValue,
              dataIndex: 'price',
              key: 'price',
              render: v => <div style={colStyle}>{v}</div>
            },
            {
              title: lang.operate,
              dataIndex: 'good',
              key: 'good',
              render: good => (
                <div style={colStyle}>
                  {(() => {
                    if (good === playerIndex) {
                      return <Tag color="green">{lang.beingOwnedByYou}</Tag>
                    }
                    if (allocation.includes(good)) {
                      return <Tag color="gray">{lang.exchanged}</Tag>
                    }
                    if (allocation.includes(playerIndex)) {
                      return <span>{lang.exchanging}</span>
                    }
                    if (exchangeMatrix[playerIndex][good] === ExchangeStatus.waiting) {
                      return <span>{lang.waitRes}</span>
                    }
                    const btnProps: any = {
                      onClick: () => roundFrameEmitter.emit(RoundMoveType.exchange, { good })
                    }
                    if (exchangeMatrix[good][playerIndex] === ExchangeStatus.waiting) {
                      return <Button {...btnProps}>{lang.resExchange}</Button>
                    } else {
                      return (
                        <Button {...btnProps} type={'primary'}>
                          {lang.reqExchange}
                        </Button>
                      )
                    }
                  })()}
                </div>
              )
            }
          ]}
          dataSource={privatePrices.map((_, i) => ({
            good: i,
            price: privatePrices[i]
          }))}
        />
      </div>
      <div className={style.roundResult}>
        {allocation[playerIndex] === null ? null : (
          <>
            <p className={style.resultInfo}>
              {lang.resultInfo1}
              <em>{String.fromCharCode(65 + playerIndex)}</em>&nbsp;,&nbsp;
              {lang.resultInfo2}
              <em>{privatePrices[playerIndex]}</em>&nbsp;,&nbsp;
              {lang.resultInfo3}
              <em>{String.fromCharCode(65 + allocation[playerIndex])}</em>&nbsp;,&nbsp;
              {lang.resultInfo4}
              <em>{privatePrices[allocation[playerIndex]]}</em>
            </p>
            <label className={style.toNextRound}>{lang.toNextRound}</label>
          </>
        )}
      </div>
    </>
  )
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
      dataIndex: 'playerIndex',
      render: i => `${i + 1}${playerState.index === i ? '(你)' : ''}`
    },
    {
      title: '心理价值',
      dataIndex: 'privatePrices'
    },
    {
      title: '初始物品',
      dataIndex: 'initGood',
      key: 'initGood'
    },
    {
      title: '初始物品价格',
      dataIndex: 'initGoodPrice',
      key: 'initGoodPrice'
    },
    {
      title: '最终物品编号',
      dataIndex: 'good',
      key: 'good'
    },
    {
      title: '最终物品价格',
      dataIndex: 'goodPrice',
      key: 'goodPrice'
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
        initGood: String.fromCharCode(65 + i),
        initGoodPrice: privatePrices[i],
        good: good === null ? null : String.fromCharCode(65 + good),
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
      本实验是一个关于物品交换的实验，实验分为G组，每组N人，每人一件物品记M1-n（系统随机分配），共进行R轮，您将会被随机分配到某组中。实验中，系统随机生成您和物品对应的编号，每件物品对于您的私有价值不同（每件物品拥有不同的编号且私有价值不同即偏好是严格的，不能出现并列排序），该私有价值是系统在V1—V2之间产生的随机数。参与者对于物品的偏好按系统随机生产的私有价值由高到低排序即参与者依据系统生成的私有价值对物品进行偏好表达，依次输入偏好以后每位参与者会随机分配到一件物品即初始匹配（Mi-
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
