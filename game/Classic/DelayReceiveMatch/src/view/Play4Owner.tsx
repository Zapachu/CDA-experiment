import * as React from 'react'
import { Group } from '@extend/client'
import { Table, Tabs } from 'antd'
import {
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  PushType,
  RoundMoveType
} from '../config'
import { Lang } from '@elf/component'

class GroupPlay4Owner extends Group.Group.Play4Owner<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`]
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { groupPlayerStates, groupGameState, groupParams }
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
        dataIndex: 'playerIndex'
      },
      {
        title: '心理价值',
        dataIndex: 'privatePrices'
      },
      {
        title: '偏好表达',
        dataIndex: 'sort'
      },
      {
        title: '分得物品编号',
        dataIndex: 'good'
      },
      {
        title: '分得物品价格',
        dataIndex: 'goodPrice'
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
                    const { allocation } = gameRoundState,
                      { sort } = rounds[i],
                      privatePrices = groupParams.roundsParams[i].privatePriceMatrix[index]
                    return {
                      userName: user.name,
                      stuNum: user.stuNum,
                      playerIndex: index + 1,
                      privatePrices: privatePrices.join(' , '),
                      sort: sort.map(i => i + 1).join('>'),
                      good: allocation[index] === null ? null : allocation[index] + 1,
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

export class Play4Owner extends Group.Play4Owner<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  RoundMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupPlay4Owner = GroupPlay4Owner
}
