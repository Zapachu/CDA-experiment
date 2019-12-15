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
      props: { groupGameState, groupPlayerStates }
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
        dataIndex: 'playerIndex'
      },
      {
        title: '投入',
        dataIndex: 'x'
      },
      {
        title: '回报',
        dataIndex: 'reward'
      },
      {
        title: '奖惩成本',
        dataIndex: 'd'
      },
      {
        title: '奖/惩',
        dataIndex: 'extra'
      },
      {
        title: '最终收益',
        dataIndex: 'result'
      }
    ]
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map(({ players, reward }, i) => {
          return (
            <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
              <Table
                pagination={false}
                columns={columns}
                dataSource={groupPlayerStates
                  .map(({ user, index }) => {
                    const { x, extra, d } = players[index]
                    return {
                      userName: user.name,
                      stuNum: user.stuNum,
                      playerIndex: index + 1,
                      x,
                      d,
                      extra,
                      reward,
                      result: reward ? x + reward - d + extra : ''
                    }
                  })
                  .sort(({ playerIndex: p1 }, { playerIndex: p2 }) => p1 - p2)}
              />
            </Tabs.TabPane>
          )
        })}
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
