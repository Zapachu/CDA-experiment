import * as React from 'react'
import * as Extend from '@extend/client'
import { Table, Tabs } from 'antd'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from '../config'
import { Lang } from '@elf/component'

class GroupPlay4Owner extends Extend.Group.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`]
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { groupPlayerStates, groupGameState }
    } = this
    const columns = [
      {
        title: '玩家',
        dataIndex: 'userName'
      },
      {
        title: '学号',
        dataIndex: 'stuNum'
      },
      {
        title: '优先序',
        dataIndex: 'playerIndex',
        key: 'playerIndex'
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
        title: '参与分配',
        dataIndex: 'join',
        key: 'join'
      },
      {
        title: '偏好表达',
        dataIndex: 'sort',
        key: 'sort'
      },
      {
        title: '分得物品编号',
        dataIndex: 'good',
        key: 'good'
      },
      {
        title: '分得物品价格',
        dataIndex: 'goodPrice',
        key: 'goodPrice'
      }
    ]
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, i) => (
          <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
            {gameRoundState.allocation.length ? (
              <Table
                dataSource={groupPlayerStates
                  .map(({ user, index, rounds }) => {
                    const { initAllocation, allocation } = gameRoundState
                    const { privatePrices, sort } = rounds[i]
                    return {
                      userName: user.name,
                      stuNum: user.stuNum,
                      playerIndex: index + 1,
                      initGood: initAllocation[index] === null ? null : initAllocation[index] + 1,
                      initGoodPrice: privatePrices[initAllocation[index]],
                      join: sort.length === 0 ? 'No' : 'Yes',
                      sort: sort.map(i => i + 1).join('>'),
                      good: allocation[index] + 1,
                      goodPrice: privatePrices[allocation[index]]
                    }
                  })
                  .sort(({ playerIndex: p1 }, { playerIndex: p2 }) => p1 - p2)}
                columns={columns}
                pagination={false}
              />
            ) : null}
          </Tabs.TabPane>
        ))}
      </Tabs>
    )
  }
}

export class Play4Owner extends Extend.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  GroupPlay4Owner = GroupPlay4Owner
}
