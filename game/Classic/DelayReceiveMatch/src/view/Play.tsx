import * as React from 'react'
import { Group, Round } from '@extend/client'
import { Button } from 'antd'
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
import { FrameEmitter } from '@bespoke/share'
import { DragTable } from './component/DragTable'

function RoundPlay({
  roundParams,
  roundPlayerState,
  roundGameState,
  roundFrameEmitter,
  playerIndex
}: {
  roundParams: IRoundCreateParams
  roundPlayerState: IRoundPlayerState
  roundGameState: IRoundGameState
  roundFrameEmitter: FrameEmitter<RoundMoveType, PushType, IRoundMoveParams, IPushParams>
  playerIndex: number
}) {
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
  const { allocation } = roundGameState,
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
        <label style={{ marginBottom: '1rem' }}>
          {lang.yourSeq}
          <em style={{ padding: '.5rem', fontSize: '1.5rem' }}>{playerIndex + 1}</em>
          {lang.dragPlease}
        </label>
        <DragTable
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

class RoundPlayWrapper extends Round.Round.Play<
  IRoundCreateParams,
  IRoundGameState,
  IRoundPlayerState,
  RoundMoveType,
  PushType,
  IRoundMoveParams,
  IPushParams
> {
  render() {
    const { roundParams, roundPlayerState, roundGameState, roundFrameEmitter, playerState } = this.props
    return (
      <RoundPlay
        {...{
          roundParams,
          roundGameState,
          roundPlayerState,
          roundFrameEmitter,
          playerIndex: playerState.index
        }}
      />
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
  RoundPlay = RoundPlayWrapper
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
