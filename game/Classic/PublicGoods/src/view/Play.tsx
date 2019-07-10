import * as React from 'react'
import * as style from './style.scss'
import {Input, Lang, MaskLoading, Request} from '@elf/component'
import {Core} from '@bespoke/register'
import Affix from 'antd/es/affix'
import Button from 'antd/es/button'
import Modal from 'antd/es/modal'
import Table from 'antd/es/table'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchRoute, MoveType, namespace, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../config'

export function Play({game: {id: gameId, params: {round}}, playerState, gameState, frameEmitter}: Core.IPlayProps<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams>) {
    const lang = Lang.extractLang({
        getPosition: ['匹配中...', 'Matching...'],
        roundInfo1: ['第', 'Round '],
        roundInfo2: ['轮，共', '  of'],
        roundInfo3: ['轮', ''],
        playerStatus: ['玩家状态', 'Player Status'],
        initialMoney: ['初始资金'],
        inputTips: [', 本回合您愿意投资多少实验币到本组的公共资金池中?'],
        submit: ['提交', 'Submit'],
        waiting4input: ['等待其它玩家提交...', 'Waiting for other players to submit'],
        roundResult: ['本轮结果', 'Round Result'],
        round:['轮次','Round'],
        input: ['投入'],
        return: ['回报'],
        fund: ['结余'],
        toNewRound1: ['实验将在'],
        toNewRound2: ['秒后进入下一轮'],
        gameOver: ['实验结束，等待老师关闭实验'],
        history: ['成交记录']
    })
    const [money, setMoney] = React.useState(''),
        [newRoundTimers, setNewRoundTimers] = React.useState([] as number[]),
        [showHistory, setShowHistory] = React.useState(false)
    React.useEffect(() => {
        Request.get(namespace, FetchRoute.getUserInfo, {gameId}, playerState.actor)
        frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
            const t = newRoundTimers.slice()
            t[roundIndex] = newRoundTimer
            setNewRoundTimers(t)
        })
        frameEmitter.emit(MoveType.getPosition)
    }, [])
    const {groupIndex, positionIndex, rounds: playerRounds} = playerState
    if (groupIndex === undefined) {
        return <MaskLoading label={lang.getPosition}/>
    }
    const {roundIndex, rounds: gameRounds} = gameState.groups[groupIndex]
    const {returnMoney, playerStatus} = gameRounds[roundIndex]
    const {initialMoney, submitMoney} = playerRounds[roundIndex]

    function renderPlay() {
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.prepared:
                return <div className={style.input}>
                    <p className={style.inputTips}>{lang.initialMoney}<em>{initialMoney}</em>{lang.inputTips}</p>
                    <Input value={money} onChange={({target: {value}}) => setMoney(value)}/>
                    <br/>
                    <Button type='primary' onClick={() => {
                        frameEmitter.emit(MoveType.submit, {money: +money})
                        setMoney('')
                    }}>{lang.submit}</Button>
                </div>
            case PlayerStatus.result:
                return <div className={style.result}>
                    <div className={style.resultTitle}>{lang.roundResult}</div>
                    <table>
                        <tbody>
                        <tr>
                            <td>{lang.initialMoney}</td>
                            <td>{lang.input}</td>
                            <td>{lang.return}</td>
                            <td>{lang.fund}</td>
                        </tr>
                        <tr>
                            <td>{initialMoney}</td>
                            <td>{submitMoney}</td>
                            <td>{returnMoney}</td>
                            <td>{initialMoney - submitMoney + returnMoney}</td>
                        </tr>
                        </tbody>
                    </table>
                    {
                        roundIndex === round - 1 ?
                            <p className={style.roundOverInfo}>{lang.gameOver}</p> :
                            <p className={style.roundOverInfo}>{lang.toNewRound1}<em>{NEW_ROUND_TIMER - (newRoundTimers[roundIndex] || 0)}</em>{lang.toNewRound2}</p>
                    }
                </div>
            case PlayerStatus.submitted:
                return <MaskLoading label={lang.waiting4input}/>
        }
    }

    return <section className={style.play}>
        <section className={style.gameDesc}>
            <h2>{'PublicGoods（公共物品）'}</h2>
            <p>{'本实验是关于公共物品的实验，实验分为G组，每组N人，共进行R轮，每位参与者将会被随机的分配到某个组中。在本次实验中，每位参与者有M实验币的初始禀赋，每轮实验参与者均可以选择拿出一部分实验币x出来作为该组公共资金投资。每组的公共资金总和将会翻K倍，然后平均返还给该组的N人。'}</p>
        </section>
        <p className={style.roundInfo}>{lang.roundInfo1}<em>{roundIndex + 1}</em>{lang.roundInfo2}<em>{round}</em>{lang.roundInfo3}
        </p>
        {
            renderPlay()
        }
        <Affix style={{position: 'fixed', right: '5', top: '30%'}}>
            <Button size='small' onClick={() => setShowHistory(true)}>{lang.history}</Button>
        </Affix>
        <Modal visible={showHistory}
               onOk={() => setShowHistory(false)}
               onCancel={() => setShowHistory(false)}
        >
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
        </Modal>
    </section>
}