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
  const playerIndex = playerState.index,
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
      title: '初始物品编号',
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
        initGood: i + 1,
        initGoodPrice: privatePrices[i],
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
