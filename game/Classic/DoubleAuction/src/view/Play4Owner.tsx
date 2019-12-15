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
      props: { groupGameState, groupPlayerStates, groupParams }
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
        title: '角色',
        dataIndex: 'role'
      },
      {
        title: '心理价值',
        dataIndex: 'privatePrice'
      },
      {
        title: '报价',
        dataIndex: 'price'
      },
      {
        title: '交易成功',
        dataIndex: 'success'
      },
      {
        title: '交易对象编号',
        dataIndex: 'pairIndex'
      },
      {
        title: '利润',
        dataIndex: 'profit'
      }
    ]
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, r) => (
          <Tabs.TabPane tab={lang.roundIndex(r)} key={r.toString()}>
            <Table
              pagination={false}
              columns={columns}
              dataSource={groupPlayerStates
                .map(({ user, index, rounds }) => {
                  const { trades } = gameRoundState,
                    { price, profit } = rounds[r],
                    { buyerAmount, buyPriceMatrix, sellPriceMatrix } = groupParams.roundsParams[r],
                    isBuyer = index < buyerAmount,
                    [privatePrice] = [...buyPriceMatrix, ...sellPriceMatrix][index],
                    trade = trades.find(({ reqIndex, resIndex }) => [reqIndex, resIndex].includes(index))
                  return {
                    userName: user.name,
                    stuNum: user.stuNum,
                    playerIndex: index + 1,
                    role: isBuyer ? '买家' : '卖家',
                    privatePrice,
                    price: price || '',
                    success: trade ? 'Yes' : 'No',
                    pairIndex: trade ? (trade.reqIndex === index ? trade.resIndex : trade.reqIndex) + 1 : '',
                    profit: profit || ''
                  }
                })
                .sort(({ playerIndex: p1 }, { playerIndex: p2 }) => p1 - p2)}
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
