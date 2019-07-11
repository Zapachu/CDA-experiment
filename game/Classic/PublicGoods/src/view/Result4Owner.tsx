import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/register'
import {Table} from 'antd'
import {ICreateParams, IGameState, IMoveParams, IPlayerState} from '../interface'
import {MoveType} from '../config'
import {Lang, Tabs} from '@elf/component'

export function Result4Owner({game: {params: {round, group, groupParams}}, travelStates}: Core.IResult4OwnerProps<ICreateParams, IGameState, IPlayerState, MoveType, IMoveParams>) {
    const lang = Lang.extractLang({
        player: ['玩家', 'Player'],
        initialMoney: ['初始资金'],
        submit: ['提交', 'Submit'],
        return: ['回报'],
        fund: ['结余'],
        round: ['轮次', 'Round'],
        K: ['回报率', 'Return Rate'],
        desc: ['实验结束，每组每轮结果如下'],
        groupIndex: [i => `第${i + 1}组`, i => `Group ${i + 1}`],
        roundIndex: [i => `第${i + 1}轮`, i => `Round ${i + 1}`]
    })
    const [activeGroupIndex, setActiveGroupIndex] = React.useState(0),
        [activeRoundIndex, setActiveRoundIndex] = React.useState(0)
    const groupIterator = Array(group).fill(null),
        roundIterator = Array(round).fill(null)
    const {gameState, playerStates} = travelStates[travelStates.length - 1]

    function renderRound(groupIndex: number, roundIndex: number) {
        const {K} = groupParams[groupIndex].roundParams[roundIndex]
        if (!gameState.groups[groupIndex]) {
            return null
        }
        const {returnMoney} = gameState.groups[groupIndex].rounds[roundIndex]
        return <Table dataSource={Object.entries(playerStates).map(([token, {rounds, user}]) => {
            const {initialMoney, submitMoney} = rounds[roundIndex]
            return {
                key: token,
                name: user.name,
                initialMoney,
                submitMoney,
                K,
                returnMoney,
                fund: initialMoney + returnMoney - submitMoney
            }
        })} columns={[
            {
                title: lang.player,
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: lang.initialMoney,
                dataIndex: 'initialMoney',
                key: 'initialMoney'
            },
            {
                title: lang.submit,
                dataIndex: 'submitMoney',
                key: 'submitMoney'
            },
            {
                title: lang.K,
                dataIndex:'K',
                key:'K'
            },
            {
                title: lang.return,
                dataIndex: 'returnMoney',
                key: 'returnMoney'
            },
            {
                title: lang.fund,
                dataIndex: 'fund',
                key: 'fund'
            }
        ]}/>
    }

    return <section className={style.result4Owner}>
        <label className={style.desc}>{lang.desc}</label>
        <Tabs labels={groupIterator.map((_, i) => lang.groupIndex(i))}
              activeTabIndex={activeGroupIndex}
              switchTab={i => setActiveGroupIndex(i)}
        >
            {
                groupIterator.map((_, i) =>
                    <Tabs key={i} labels={roundIterator.map((_, i) => lang.roundIndex(i))}
                          activeTabIndex={activeRoundIndex}
                          switchTab={i => setActiveRoundIndex(i)}
                          vertical={true}
                    >
                        {
                            roundIterator.map((_, j) => renderRound(i, j))
                        }
                    </Tabs>)
            }
        </Tabs>
    </section>
}