import * as React from 'react'
import * as Extend from '@extend/client'
import { Button, Table, Tag } from 'antd'
import * as style from './style.scss'
import {
  GoodStatus,
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
  PushType
} from '../config'
import { Lang, MaskLoading } from '@elf/component'
import { FrameEmitter } from '@bespoke/share'
import { DragTable } from '../../../DelayReceiveMatch/src/view/component/DragTable'

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
    dragPlease: ['请拖拽下方物品列表进行偏好表达'],
    goodNo: ['物品', 'Good'],
    privateValue: ['心理价值', 'Private Value'],
    goodStatus: ['物品状态', 'Good Status'],
    leftMarket: ['已离开市场', 'Left market'],
    beingOwned: ['被持有', 'Being owned'],
    beingOwnedByYou: ['被你持有', 'Being owned by you'],
    wait4OldPlayers: ['等待老参与者决定是否参与交换......'],
    wait4Others: ['等待其它玩家提交......'],
    join: ['参与'],
    leave: ['不参与'],
    submit: ['提交', 'Submit'],
    roundOver1: ['您已完成本轮实验'],
    roundOver2: ['初始分配到的物品为'],
    roundOver3: ['其价值为'],
    roundOver4: ['最终分配到的物品为'],
    toNextRound: ['即将进入下一轮...'],
    preference: ['偏好'],
    preferNo: [n => `第${n}喜欢`]
  })
  const { goodStatus, initAllocation, allocation } = gameRoundState,
    { privatePrices, status } = playerRoundState
  const [sort, setSort] = React.useState(privatePrices.map((_, i) => i))
  switch (status) {
    case PlayerRoundStatus.prePlay:
      return <PrePlay />
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

  function PrePlay() {
    const colStyle: React.CSSProperties = {
      minWidth: '6rem',
      maxWidth: '12rem'
    }
    return (
      <section className={style.roundPlay}>
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
          dataSource={sort.map(i => ({
            key: i,
            price: privatePrices[i],
            goodStatus: goodStatus[i],
            isYou: i === initAllocation[playerIndex]
          }))}
        />
        <div className={style.btnsWrapper}>
          {initAllocation[playerIndex] === null ? (
            lang.wait4OldPlayers
          ) : (
            <>
              <Button onClick={() => frameEmitter.emit(MoveType.oldPlayerDecide, { join: false })}>{lang.leave}</Button>
              <Button onClick={() => frameEmitter.emit(MoveType.oldPlayerDecide, { join: true })} type={'primary'}>
                {lang.join}
              </Button>
            </>
          )}
        </div>
      </section>
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
            isYou: i === initAllocation[playerIndex],
            preferNo: j
          }))}
          setData={data => setSort(data.map(({ key }) => key))}
        />
        <div className={style.btnsWrapper}>
          {initAllocation[playerIndex] === null ? null : (
            <Button onClick={() => frameEmitter.emit(MoveType.submit, { sort: [] })}>{lang.leave}</Button>
          )}
          <Button type={'primary'} onClick={() => frameEmitter.emit(MoveType.submit, { sort })}>
            {lang.submit}
          </Button>
        </div>
      </section>
    )
  }
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
