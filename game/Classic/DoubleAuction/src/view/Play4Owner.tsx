import * as React from 'react'
import { Group } from '@extend/client'
import { Table, Tabs } from 'antd'
import { ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, MoveType, PushType, Role } from '../config'
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
    playerNo: ['玩家编号'],
    role: ['角色'],
    price: ['报价'],
    buyer: ['买家'],
    seller: ['卖家'],
    traded: ['成交'],
    tradePairNo: ['成交对象编号']
  })

  render(): React.ReactNode {
    const {
      lang,
      props: { groupGameState }
    } = this
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map(({ shouts, trades }, i) => (
          <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
            <Table
              pagination={false}
              columns={[
                {
                  title: lang.playerNo,
                  dataIndex: 'playerNo',
                  key: 'playerNo'
                },
                {
                  title: lang.role,
                  dataIndex: 'role',
                  key: 'role',
                  render: role =>
                    ({
                      [Role.buyer]: lang.buyer,
                      [Role.seller]: lang.seller
                    }[role])
                },
                {
                  title: lang.price,
                  dataIndex: 'price',
                  key: 'price'
                },
                {
                  title: lang.traded,
                  dataIndex: 'tradePair',
                  key: 'tradePair',
                  render: v => (!!v).toString()
                },
                {
                  title: lang.tradePairNo,
                  dataIndex: 'tradePair',
                  key: 'tradePair'
                }
              ]}
              dataSource={shouts
                .filter(s => s)
                .map(({ price, tradePair, role }, i) => ({
                  playerNo: i + 1,
                  role,
                  price,
                  tradePair: tradePair === null ? null : tradePair + 1
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
