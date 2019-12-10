import * as React from 'react'
import { Group } from '@extend/client'
import { Button, InputNumber } from 'antd'
import * as style from './style.scss'
import {
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerRoundStatus,
  PlayerStatus,
  PushType,
  Role
} from '../config'
import { Lang, MaskLoading, Toast } from '@elf/component'
import { FrameEmitter } from '@bespoke/share'

function RoundPlay({
  playerRoundState,
  gameRoundState,
  frameEmitter,
  role,
  playerIndex
}: {
  groupParams: ICreateParams
  playerRoundState: IPlayerRoundState
  gameRoundState: IGameRoundState
  frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
  playerIndex: number
  role: Role
}) {
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
  const roleLabel = {
    [Role.buyer]: lang.buyer,
    [Role.seller]: lang.seller
  }[role]
  const { privatePrice, status } = playerRoundState
  const { timeLeft } = gameRoundState
  switch (status) {
    case PlayerRoundStatus.play:
      return (
        <section className={style.roundPlay}>
          <p className={style.playTips}>
            {lang.tips1}&nbsp;:&nbsp;{roleLabel}&nbsp;,&nbsp;{lang.tips2}
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
              if (role === Role.buyer && price > privatePrice) {
                return Toast.warn(lang.invalidBuyPrice)
              }
              if (role === Role.seller && price < privatePrice) {
                return Toast.warn(lang.invalidSellPrice)
              }
              frameEmitter.emit(MoveType.shout, { price: price })
            }}
          >
            {lang.shout}
          </Button>
        </section>
      )
    case PlayerRoundStatus.wait:
      return <MaskLoading label={lang.waiting} />
    case PlayerRoundStatus.result:
      const { shouts } = gameRoundState,
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
                <em>{playerRoundState.profit}</em>
              </>
            ) : (
              lang.noTrade
            )}
          </p>
        </section>
      )
  }
}

class GroupPlay extends Group.Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    round1: ['第', 'Round'],
    round2: ['轮', ''],
    wait4OtherPlayers: ['等待其它玩家加入......'],
    gameOver: ['所有轮次结束，等待老师关闭实验']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { playerState, groupGameState, groupFrameEmitter, groupParams }
    } = this
    if (playerState.status === PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
          <p>
            本实验共进行R轮，每组N人。参与者会被随机分配到某一组中，担任卖家或者买家其中一种角色，实验中角色不变，双方人数对半，每轮进行1单位商品的交易；每轮实验中，每单位商品对于买家有一个货币价值，该价值是V1到V2之间的随机数，买家根据自身的货币价值进行出价（Bid
            prices），买家的出价只有低于货币价值时才会获得收益；每单位商品对于卖家有一定的成本，该成本是C1到C2之间的随机数，卖家根据商品的成本进行要价（Ask
            prices），卖家的要价只有高于商品成本时才能获得收益。卖家接受买家的出价或者买家同意卖家的要价时，交易达成。实验中可及时修改价格（降低要价、提高出价），最终收益计算：买家（Buyer）——每买进一单位商品，收益=货币价值-成交价格；卖家（Seller）——每卖出一单位商品，收益=成交价格-商品成本
          </p>
          <Button type="primary" onClick={() => groupFrameEmitter.emit(MoveType.guideDone)}>
            Start
          </Button>
        </section>
      )
    }
    if (playerState.status === PlayerStatus.result) {
      return <section className={style.groupResult}>{lang.gameOver}</section>
    }
    const playerRoundState = playerState.rounds[groupGameState.round],
      gameRoundState = groupGameState.rounds[groupGameState.round]
    if (!playerRoundState) {
      return <MaskLoading label={lang.wait4OtherPlayers} />
    }
    return (
      <section className={style.groupPlay}>
        <h2 className={style.title}>
          {lang.round1}
          {groupGameState.round + 1}
          {lang.round2}
        </h2>
        <RoundPlay
          {...{
            groupParams,
            playerRoundState,
            gameRoundState,
            frameEmitter: groupFrameEmitter,
            playerIndex: playerState.index,
            role: playerState.role
          }}
        />
      </section>
    )
  }
}

export class Play extends Group.Play<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupPlay = GroupPlay
}
