import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button, InputNumber } from 'antd'
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
import { Lang, MaskLoading, Toast } from '@elf/component'

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
