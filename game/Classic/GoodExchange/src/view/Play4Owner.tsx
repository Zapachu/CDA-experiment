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
        dataIndex: 'playerIndex'
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
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, round) => (
          <Tabs.TabPane tab={lang.roundIndex(round)} key={round.toString()}>
            {gameRoundState.allocation.every(good => good !== null) ? (
              <Table
                dataSource={groupPlayerStates
                  .map(({ user, index }) => {
                    const { allocation } = gameRoundState
                    const privatePrices = groupParams.roundsParams[round].privatePriceMatrix[index]
                    return {
                      userName: user.name,
                      stuNum: user.stuNum,
                      playerIndex: index + 1,
                      initGood: index + 1,
                      initGoodPrice: privatePrices[index],
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
