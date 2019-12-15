import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, InputNumber, Table } from 'antd'
import { Lang, MaskLoading, Toast } from '@elf/component'
import { GroupDecorator } from '@extend/share'
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
  roundParams: { buyerAmount, buyPriceMatrix, sellPriceMatrix },
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
    timeLeft: ['剩余时间', 'Time Left'],
    shout: ['报价'],
    waiting: ['等待其它玩家提交...'],
    playerNo: ['玩家编号'],
    x: ['捕获量'],
    result: ['最终收益'],
    you: ['（你）'],
    toNextRound: ['等待进入下一轮...'],
    tips1: ['您的身份为'],
    tips2: ['您对本轮商品的心理价值为'],
    role: ['角色'],
    buyer: ['买家'],
    seller: ['卖家'],
    invalidSellPrice: ['卖出价格应不低于心理价格'],
    invalidBuyPrice: ['卖出价格应不高于心理价格'],
    roundOver: ['本轮实验结束'],
    noTrade: ['您的报价未成交'],
    tradeInfo1: ['您的报价为'],
    tradeInfo2: ['心理价格为'],
    tradeInfo3: ['利润为']
  })
  const [price, setPrice] = React.useState(null)
  const playerIndex = playerState.index,
    isBuyer = playerIndex < buyerAmount,
    [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][playerIndex]
  const { timeLeft } = roundGameState
  switch (roundPlayerState.status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <p className={style.playTips}>
            {lang.tips1}&nbsp;:&nbsp;{isBuyer ? lang.buyer : lang.seller}&nbsp;,&nbsp;{lang.tips2}
            &nbsp;:&nbsp;{privatePrice}
          </p>
          <label className={style.timeLeft}>
            {lang.timeLeft}&nbsp;:&nbsp;<em>{timeLeft}</em>s
          </label>
          <InputNumber value={price} onChange={v => setPrice(+v)} min={0} />
          <br />
          <Button
            type="primary"
            onClick={() => {
              if (isBuyer && price > privatePrice) {
                return Toast.warn(lang.invalidBuyPrice)
              }
              if (!isBuyer && price < privatePrice) {
                return Toast.warn(lang.invalidSellPrice)
              }
              roundFrameEmitter.emit(RoundMoveType.shout, { price: price })
            }}
          >
            {lang.shout}
          </Button>
        </section>
      )
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.waiting} />
    case PlayerRoundStatus.result:
      const traded = roundGameState.trades.some(
        ({ buy, sell }) => buy.player === playerIndex || sell.player === playerIndex
      )
      return (
        <section className={style.roundResult}>
          <p>
            {lang.roundOver}
            {traded ? (
              <>
                {lang.tradeInfo1}
                <em>{roundPlayerState.price}</em>&nbsp;,&nbsp;{lang.tradeInfo2}
                <em>{privatePrice}</em>&nbsp;,&nbsp;{lang.tradeInfo3}
                <em>{Math.abs(privatePrice - roundPlayerState.price)}</em>
              </>
            ) : (
              lang.noTrade
            )}
          </p>
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
      dataIndex: 'playerIndex'
    },
    {
      title: '角色',
      dataIndex: 'role'
    },
    {
      title: '心理价值',
      dataIndex: 'privatePrice'
    },
    {
      title: '报价',
      dataIndex: 'price'
    },
    {
      title: '交易成功',
      dataIndex: 'success'
    },
    {
      title: '交易对象编号',
      dataIndex: 'pairIndex'
    }
  ]
  const dataSource = []
  groupGameState.rounds.forEach(({ trades }, r) => {
    const { buyPriceMatrix, sellPriceMatrix, buyerAmount } = groupParams.roundsParams[r],
      { price } = playerState.rounds[r]
    for (let index = 0; index < groupSize; index++) {
      const [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][index],
        isBuyer = index < buyerAmount,
        trade = trades.find(({ buy, sell }) => (isBuyer ? buy : sell).player === index)
      if (showHistory === GroupDecorator.ShowHistory.selfOnly && index !== playerState.index) {
        continue
      }
      dataSource.push({
        rowSpan: showHistory === GroupDecorator.ShowHistory.selfOnly ? 1 : index === 0 ? groupSize : 0,
        round: r,
        playerIndex: index + 1,
        role: isBuyer ? '买家' : '卖家',
        privatePrice,
        price: price || '',
        success: trade ? 'Yes' : 'No',
        pairIndex: trade ? (isBuyer ? trade.sell : trade.buy).player + 1 : ''
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
      本实验是一个关于拍卖的实验，共R轮。在本次实验中，您将会被随机的分配到某个组中，每组有N名成员，您在实验中为买家或者卖家的身份由系统随机确定。在本次实验中，每位买家有M实验币的初始禀赋，商品对于每位买家而言心理价格不同，该价格都是V1到V2之间的随机数；对于每位卖家而言成本也不同，成本是从C1到C2之间的随机数。拍卖开始，每位参与者对拍卖品出一个报价，买家的报价是买家愿意购买该商品的最高出价，卖家的报价是卖家愿意出售该商品的最低售价，系统将自动撮合买方和卖方的报价，产生当期的市场成交价格，该价格使买卖双方的交易需求最大程度地得到满足。买家作为商品的需求方，报价大于等于市场成交价格者成交（报价高者有更大的可能性成交）；卖家作为商品的供给方，报价小于等于市场成交价格者成交（报价低者有更大的可能性成交）
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
