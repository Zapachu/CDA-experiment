import * as React from 'react'
import { Group } from '@extend/client'
import * as style from './style.scss'
import { Table } from 'antd'
import {
  ICreateParams,
  IGameState,
  IMoveParams,
  IPlayerState,
  IPushParams,
  MoveType,
  projectConfigs,
  PushType
} from '../config'

class GroupPlay4Owner extends Group.Group.Play4Owner<
  ICreateParams,
  IGameState,
  IPlayerState,
  MoveType,
  PushType,
  IMoveParams,
  IPushParams
> {
  render(): React.ReactNode {
    const {
      groupPlayerStates,
      groupGameState: { contribution }
    } = this.props
    const dataSource = Object.values(groupPlayerStates).map(({ login, index, arm, treatment, projectSort }) => ({
      key: index,
      login,
      index,
      arm,
      treatment,
      projectSort
    }))

    const columns = [
      {
        title: 'Player',
        dataIndex: 'index',
        key: 'index',
        render: i => i + 1
      },
      {
        title: 'Login',
        dataIndex: 'login',
        key: 'login'
      },
      {
        title: 'Arm',
        dataIndex: 'arm',
        key: 'arm'
      },
      {
        title: 'Treatment',
        dataIndex: 'treatment',
        key: 'treatment'
      },
      {
        title: 'Project/Contribution',
        children: projectConfigs.map((_, i) => ({
          title: `p${i + 1}`,
          render: ({ projectSort, index }) => {
            if (!projectSort) {
              return null
            }
            const p = projectSort[i]
            return (
              <div className={style.contributeCell}>
                {projectConfigs[p].name}
                <em>{contribution[index][p]}</em>
              </div>
            )
          }
        }))
      }
    ]
    return (
      <Table
        className={style.play4Owner}
        dataSource={dataSource}
        columns={columns}
        bordered
        size="small"
        pagination={false}
      />
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
