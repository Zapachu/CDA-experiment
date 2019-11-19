import * as React from 'react'
import * as Extend from '@extend/client'
import { Button, Table, Tag } from 'antd'
import * as style from './style.scss'
import {
  ExchangeStatus,
  ICreateParams,
  IGameRoundState,
  IGameState,
  IMoveParams,
  IPlayerRoundState,
  IPlayerState,
  IPushParams,
  MoveType,
  PlayerStatus,
  PushType
} from '../config'
import { Lang, MaskLoading } from '@elf/component'
import { FrameEmitter } from '@bespoke/share'

function RoundPlay({
  playerRoundState,
  gameRoundState,
  frameEmitter,
  playerIndex
}: {
  playerRoundState: IPlayerRoundState
  gameRoundState: IGameRoundState
  frameEmitter: FrameEmitter<MoveType, PushType, IMoveParams, IPushParams>
  playerIndex: number
}) {
  const lang = Lang.extractLang({
    goodNo: ['物品编号', 'Good No.'],
    privateValue: ['心理价值', 'Private Value'],
    goodStatus: ['物品状态', 'Good Status'],
    operate: ['操作', 'Operate'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    reqExchange: ['请求交换', 'Request Exchange'],
    resExchange: ['响应交换', 'Response Exchange'],
    exchanged: ['已交换', 'Exchanged'],
    waitRes: ['等待响应...', 'Waiting for response...'],
    exchanging: ['交换中...', 'Exchanging...'],
    timeLeft: ['剩余时间', 'Time Left'],
    resultInfo1: ['您已完成本轮交换，您的初始物品编号为'],
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
  const { allocation, exchangeMatrix, timeLeft } = gameRoundState,
    { privatePrices } = playerRoundState
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
              render: v => <div style={colStyle}>{v + 1}</div>
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
                      onClick: () => frameEmitter.emit(MoveType.exchange, { good })
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
              <em>{playerIndex + 1}</em>&nbsp;,&nbsp;
              {lang.resultInfo2}
              <em>{privatePrices[playerIndex]}</em>&nbsp;,&nbsp;
              {lang.resultInfo3}
              <em>{allocation[playerIndex] + 1}</em>&nbsp;,&nbsp;
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

class GroupPlay extends Extend.Group.Play<
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
      props: { playerState, groupGameState, groupFrameEmitter }
    } = this
    if (playerState.status === PlayerStatus.guide) {
      return (
        <section className={style.groupGuide}>
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
            playerRoundState,
            gameRoundState,
            frameEmitter: groupFrameEmitter,
            playerIndex: playerState.index
          }}
        />
      </section>
    )
  }
}

export class Play extends Extend.Play<
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
