import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/register'
import 'antd/es/table/style'
import Table from 'antd/es/table'
import {ICreateParams, IGameState, IPlayerState} from '../interface'
import {Lang} from '@elf/component'

export function Result({playerState, gameState}: Core.IResult4PlayerProps<ICreateParams, IGameState, IPlayerState>) {
    const lang = Lang.extractLang({
        initialMoney: ['初始资金'],
        submit: ['提交', 'Submit'],
        return: ['回报'],
        fund: ['结余'],
        round:['轮次','Round'],
        desc:['实验结束，每轮结果如下']
    })
    const {rounds: gameRounds} = gameState.groups[playerState.groupIndex]
    return <section className={style.result}>
        <label className={style.desc}>{lang.desc}</label>
        <Table dataSource={playerState.rounds.map(({initialMoney, submitMoney}, i) =>
            ({
                key: i,
                round: i+1,
                initialMoney,
                submitMoney,
                returnMoney: gameRounds[i].returnMoney,
                fund: gameRounds[i].returnMoney ? initialMoney + gameRounds[i].returnMoney - submitMoney : null
            }))} columns={[
            {
                title: lang.round,
                dataIndex: 'round',
                key: 'round'
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
    </section>
}