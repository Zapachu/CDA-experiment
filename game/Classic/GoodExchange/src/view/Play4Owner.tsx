import * as React from 'react'
import { Group } from '@extend/client'
import { Table, Tabs } from 'antd'
import {
  GroupMoveType,
  IGroupCreateParams,
  IGroupGameState,
  IGroupMoveParams,
  IGroupPlayerState,
  IPushParams,
  PushType
} from '../config'
import { Lang } from '@elf/component'

class GroupPlay4Owner extends Group.Group.Play4Owner<
  IGroupCreateParams,
  IGroupGameState,
  IGroupPlayerState,
  GroupMoveType,
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
        title: '编号',
        dataIndex: 'indexInGroup'
      },
      {
        title: '心理价值',
        dataIndex: 'privatePrices'
      },
      {
        title: '初始物品',
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
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, round) => (
          <Tabs.TabPane tab={lang.roundIndex(round)} key={round.toString()}>
            <Table
              dataSource={groupPlayerStates
                .map(({ user, index: indexInGroup, rounds }) => {
                  const { index: indexInRound } = rounds[round]
                  const { allocation } = gameRoundState
                  const privatePrices = groupParams.roundsParams[round].privatePriceMatrix[indexInGroup]
                  return {
                    userName: user.name,
                    stuNum: user.stuNum,
                    indexInGroup: indexInGroup + 1,
                    privatePrices: privatePrices.join(' , '),
                    initGood: String.fromCharCode(65 + indexInRound),
                    initGoodPrice: privatePrices[indexInRound],
                    good: allocation[indexInRound] === null ? null : String.fromCharCode(65 + allocation[indexInRound]),
                    goodPrice: privatePrices[allocation[indexInRound]]
                  }
                })
                .sort(({ indexInGroup: p1 }, { indexInGroup: p2 }) => p1 - p2)}
              columns={columns}
              pagination={false}
            />
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
  GroupMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupPlay4Owner = GroupPlay4Owner
}
