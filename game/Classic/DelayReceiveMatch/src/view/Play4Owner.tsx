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
        title: '编号',
        dataIndex: 'indexInGroup'
      },
      {
        title: '优先序',
        dataIndex: 'indexInRound'
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
        title: '最终物品',
        dataIndex: 'good'
      },
      {
        title: '最终物品价格',
        dataIndex: 'goodPrice'
      }
    ]
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, i) => (
          <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
            <Table
              dataSource={groupPlayerStates
                .map(({ user, index: indexInGroup, rounds }) => {
                  const { allocation } = gameRoundState,
                    { sort, index: indexInRound } = rounds[i],
                    privatePrices = groupParams.roundsParams[i].privatePriceMatrix[indexInGroup]
                  return {
                    userName: user.name,
                    stuNum: user.stuNum,
                    indexInGroup: indexInGroup + 1,
                    indexInRound: indexInRound + 1,
                    privatePrices: privatePrices.join(' , '),
                    sort: sort.map(i => String.fromCharCode(65 + i)).join('>'),
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
  RoundMoveType,
  PushType,
  IGroupMoveParams,
  IPushParams
> {
  GroupPlay4Owner = GroupPlay4Owner
}
