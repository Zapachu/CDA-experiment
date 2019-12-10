import * as React from 'react'
import { Group } from '@extend/client'
import { Table, Tabs } from 'antd'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType } from '../config'
import { Lang } from '@elf/component'

class GroupPlay4Owner extends Group.Group.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  lang = Lang.extractLang({
    roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`],
    tradeNo: ['成交订单编号'],
    buyerNo: ['买家编号'],
    sellerNo: ['卖家编号'],
    shout: ['报价']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { groupGameState }
    } = this
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, i) => (
          <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
            <Table
              pagination={false}
              columns={[
                {
                  title: lang.tradeNo,
                  dataIndex: 'tradeNo',
                  key: 'tradeNo'
                },
                {
                  title: lang.buyerNo,
                  dataIndex: 'buyer',
                  key: 'buyer'
                },
                {
                  title: `${lang.buyerNo}${lang.shout}`,
                  dataIndex: 'buyPrice',
                  key: 'buyPrice'
                },
                {
                  title: lang.sellerNo,
                  dataIndex: 'seller',
                  key: 'seller'
                },
                {
                  title: `${lang.sellerNo}${lang.shout}`,
                  dataIndex: 'sellPrice',
                  key: 'sellPrice'
                }
              ]}
              dataSource={gameRoundState.trades.map(({ buy, sell }, i) => ({
                tradeNo: i + 1,
                buyer: buy.player + 1,
                buyPrice: buy.price,
                seller: sell.player + 1,
                sellPrice: sell.price
              }))}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    )
  }
}

export class Play4Owner extends Group.Play4Owner<
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
