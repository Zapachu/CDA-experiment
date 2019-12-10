import * as React from 'react'
import { Group } from '@extend/client'
import {
  Choice,
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  PushType
} from '../config'
import { Table, Tabs } from 'antd'
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
        title: '编号',
        dataIndex: 'playerIndex',
        key: 'playerIndex'
      },
      {
        title: '题目数量',
        dataIndex: 'T',
        key: 'T'
      },
      {
        title: '偏好选择',
        dataIndex: 'preference',
        key: 'preference'
      },
      {
        title: '结果题号',
        dataIndex: 'caseIndex',
        key: 'caseIndex'
      },
      {
        title: '是否选中',
        dataIndex: 'success',
        key: 'success'
      },
      {
        title: '收益',
        dataIndex: 'award',
        key: 'award'
      }
    ]
    return (
      <Tabs tabPosition={'left'}>
        {groupGameState.rounds.map((gameRoundState, i) => (
          <Tabs.TabPane tab={lang.roundIndex(i)} key={i.toString()}>
            <Table
              dataSource={groupPlayerStates
                .map(({ user, index, rounds }) => {
                  const {
                    T,
                    preference,
                    result = {
                      caseIndex: undefined,
                      success: false,
                      award: 0
                    }
                  } = rounds[i]
                  const { caseIndex, success, award } = result
                  return {
                    userName: user.name,
                    stuNum: user.stuNum,
                    playerIndex: index + 1,
                    T,
                    preference: (preference ? preference.map(c => (c === Choice.A ? 'A' : 'B')) : []).join('>'),
                    caseIndex: caseIndex === undefined ? '' : +caseIndex + 1,
                    success: success.toString(),
                    award
                  }
                })
                .sort(({ playerIndex: p1 }, { playerIndex: p2 }) => p1 - p2)}
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
