import * as React from 'react'
import * as style from './style.scss'
import * as dateFormat from 'dateformat'
import {Core} from '@bespoke/register'
import {Lang} from '@elf/component'
import Tabs from 'antd/es/tabs'
import Table from 'antd/es/table'
import 'antd/es/tabs/style'
import 'antd/es/table/style'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, PushType} from '../config'

export function Play4Owner({game: {}, playerStates, gameState: {logs, groups}}: Core.IPlay4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        player: ['玩家', 'Player'],
        mobile: ['手机号', 'Mobile Number'],
        group: ['组', 'Group'],
        round: ['轮', 'Round'],
        members: ['实验成员', 'Members'],
        logs: ['操作记录', 'Logs'],
        money: ['金额', 'Money'],
        time: ['时间', 'Time']
    })
    const [activeTabKey, setActiveTabKey] = React.useState(lang.members)
    const playerNames = []
    Object.values(playerStates).forEach(({positionIndex, userInfo}) => playerNames[positionIndex] = userInfo.name)
    return <section className={style.play4owner}>
        <div className={style.tabsWrapper}>
            <Tabs defaultActiveKey={activeTabKey} onChange={setActiveTabKey}>
                <Tabs.TabPane tab={lang.members} key={lang.members}>
                    <Table dataSource={Object.entries(playerStates).map(([token, {groupIndex, userInfo}]) =>
                        ({
                            key: token,
                            name: userInfo.name,
                            mobile: userInfo.mobile,
                            group: groupIndex + 1,
                            round: groups[groupIndex]? groups[groupIndex].roundIndex : null
                        })
                    )} columns={[
                        {
                            title: lang.player,
                            dataIndex: 'name',
                            key: 'name'
                        },
                        {
                            title: lang.mobile,
                            dataIndex: 'mobile',
                            key: 'mobile'
                        },
                        {
                            title: lang.group,
                            dataIndex: 'group',
                            key: 'group'
                        },
                        {
                            title: lang.round,
                            dataIndex: 'round',
                            key: 'round'
                        }
                    ]}/>
                </Tabs.TabPane>
                <Tabs.TabPane tab={lang.logs} key={lang.logs}>
                    <Table dataSource={logs.reverse().map(([group, round, position, money, time]) =>
                        ({
                            key: time,
                            group: group + 1,
                            round: round + 1,
                            player: playerNames[position],
                            money,
                            time: dateFormat(time, 'HH:MM:ss')
                        }))} columns={[
                        {
                            title: lang.group,
                            dataIndex: 'group',
                            key: 'group'
                        },
                        {
                            title: lang.round,
                            dataIndex: 'round',
                            key: 'round'
                        },
                        {
                            title: lang.player,
                            dataIndex: 'name',
                            key: 'name'
                        },
                        {
                            title: lang.money,
                            dataIndex: 'money',
                            key: 'money'
                        },
                        {
                            title: lang.time,
                            dataIndex: 'time',
                            key: 'time'
                        }
                    ]}/>
                </Tabs.TabPane>
            </Tabs>
        </div>
    </section>
}