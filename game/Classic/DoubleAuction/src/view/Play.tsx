import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, InputNumber, Table } from 'antd'
import { GroupDecorator } from '@extend/share'
import { Lang, MaskLoading, Toast } from '@elf/component'
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
              roundFrameEmitter.emit(RoundMoveType.shout, { price })
            }}
          >
            {lang.shout}
          </Button>
        </section>
      )
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.waiting} />
    case PlayerRoundStatus.result:
      const { shouts } = roundGameState,
        myShout = shouts[playerIndex]
      const traded = myShout && myShout.tradePair !== null
      return (
        <section className={style.roundResult}>
          <p>
            {lang.roundOver}
            {traded ? (
              <>
                {lang.tradeInfo1}
                <em>{shouts[playerIndex].price}</em>&nbsp;,&nbsp;
                {lang.tradeInfo2}
                <em>{privatePrice}</em>&nbsp;,&nbsp;{lang.tradeInfo3}
                <em>{roundPlayerState.profit}</em>
              </>
            ) : (
              lang.noTrade
            )}
          </p>
        </section>
      )
  }
}

function RoundHistory({
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
    },
    {
      title: '利润',
      dataIndex: 'profit'
    }
  ]
  const dataSource = []
  groupGameState.rounds.slice(0, groupGameState.round).forEach(({ trades }, r) => {
    const { buyPriceMatrix, sellPriceMatrix, buyerAmount } = groupParams.roundsParams[r],
      { price, profit } = playerState.rounds[r]
    for (let index = 0; index < groupSize; index++) {
      const [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][index],
        isBuyer = index < buyerAmount,
        trade = trades.find(({ reqIndex, resIndex }) => [reqIndex, resIndex].includes(index))
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
        pairIndex: trade ? (trade.reqIndex === index ? trade.resIndex : trade.reqIndex) + 1 : '',
        profit: profit || ''
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
      本实验共进行R轮，每组N人。参与者会被随机分配到某一组中，担任卖家或者买家其中一种角色，实验中角色不变，双方人数对半，每轮进行1单位商品的交易；每轮实验中，每单位商品对于买家有一个货币价值，该价值是V1到V2之间的随机数，买家根据自身的货币价值进行出价（Bid
      prices），买家的出价只有低于货币价值时才会获得收益；每单位商品对于卖家有一定的成本，该成本是C1到C2之间的随机数，卖家根据商品的成本进行要价（Ask
      prices），卖家的要价只有高于商品成本时才能获得收益。卖家接受买家的出价或者买家同意卖家的要价时，交易达成。实验中可及时修改价格（降低要价、提高出价），最终收益计算：买家（Buyer）——每买进一单位商品，收益=货币价值-成交价格；卖家（Seller）——每卖出一单位商品，收益=成交价格-商品成本
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
