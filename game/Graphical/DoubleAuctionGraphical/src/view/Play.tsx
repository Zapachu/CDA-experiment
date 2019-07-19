import * as React from 'react'
import * as style from './style.scss'
import {Lang, MaskLoading, Toast} from '@elf/component'
import {Core} from '@bespoke/client'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../config'
import {Button, Input, RoundSwitching, span, Stage} from '@bespoke-game/graphical-util'

import Tip from './coms/Tip'
import Role from './coms/Role'
import Board from './coms/Board'
import Dialog from './coms/Dialog'
import Dealed from './coms/Dealed'
import Referee from './coms/Referee'
import Outside from './coms/Outside'
import PutShadow from './coms/PutShadow'

interface IPlayState {
    price: string
    loading: boolean
    dealDialog: boolean
    dealObj: { price: number, position: number }
    countdowns: Array<number>
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    state = {
        price: '',
        loading: true,
        dealDialog: false,
        dealObj: {price: 0, position: 0},
        countdowns: [],
        newRoundTimers: []
    }

    lang = Lang.extractLang({
        hello: ['你好', 'Hello'],
        shout: ['出价', 'Shout'],
        prepare: ['准备好了', 'Prepared'],
        nextRound: ['下一轮', 'Next Round'],
        matchingPlayer: ['正在匹配玩家', 'Matching Players...'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`]
    })

    async componentDidMount() {
        const {props: {frameEmitter}} = this
        frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
            this.setState(state => {
                const newRoundTimers = state.newRoundTimers.slice()
                newRoundTimers[roundIndex] = newRoundTimer
                return {newRoundTimers, dealDialog: false}
            })
        })
        frameEmitter.on(PushType.countdown, ({roundIndex, countdown}) => {
            this.setState(state => {
                const countdowns = state.countdowns.slice()
                countdowns[roundIndex] = countdown
                return {countdowns: countdowns}
            })
        })
        frameEmitter.emit(MoveType.getPosition)
        this.setState({loading: false})
    }

    setVal = (e) => this.setState({price: e.target.value})

    shout = () => {
        const {
            props: {
                frameEmitter,
                gameState: {groups},
                playerState: {groupIndex, privatePrices}
            }, state
        } = this
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price > privatePrices[groups[groupIndex].roundIndex]) {
            Toast.warn('输入的值无效')
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price})
        }
    }

    renderOperateWidget() {
        const {
            lang, props: {
                frameEmitter,
                gameState: {groups},
                playerState: {groupIndex, positionIndex, role}
            }, state: {price}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <>
                    <foreignObject {...{
                        x: span(2),
                        y: span(8)
                    }}>
                        <div style={{width: 100}}>
                            <h2>卖方</h2>
                        </div>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(7.6),
                        y: span(8)
                    }}>
                        <div style={{width: 100}}>
                            <h2>买方</h2>
                        </div>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(4.7),
                        y: span(9)
                    }}>
                        <Button label={lang.prepare} onClick={() => frameEmitter.emit(MoveType.prepare)}/>
                    </foreignObject>
                </>
            }
            case PlayerStatus.shouted:
            case PlayerStatus.prepared: {
                switch (role) {
                    case 0:
                        return <>
                            <foreignObject {...{
                                x: span(3),
                                y: span(7)
                            }}>
                                <Input value={price} onChange={price => this.setState({price})}/>
                            </foreignObject>
                            <foreignObject {...{
                                x: span(2.2),
                                y: span(7.7)
                            }}>
                                <Button label={lang.shout} onClick={this.shout.bind(this)}/>
                            </foreignObject>
                        </>
                    case 1:
                        return <>
                            <foreignObject {...{
                                x: span(7),
                                y: span(7)
                            }}>
                                <Input value={price} onChange={price => this.setState({price})}/>
                            </foreignObject>
                            <foreignObject {...{
                                x: span(6.2),
                                y: span(7.7)
                            }}>
                                <Button label={lang.shout} onClick={this.shout.bind(this)}/>
                            </foreignObject>
                        </>
                }
            }
        }
        return null
    }

    dealIt = (position, price) => {
        console.log(position, price)
        this.setState({
            dealDialog: true,
            dealObj: {
                price,
                position
            }
        })
    }

    dealDone = (position, price, status) => {
        if (status) {
            const {
                props: {
                    frameEmitter
                }
            } = this
            frameEmitter.emit(MoveType.deal, {position, price})
        }
        this.setState({dealDialog: false})
    }

    render() {
        const {
            lang,
            props: {
                game: {params: {countdown: roundTime}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex, role, privatePrices}
            }, state: {loading, newRoundTimers, countdowns, dealDialog, dealObj}
        } = this
        if (loading) {
            return <MaskLoading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label='正在匹配玩家...'/>
        }

        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            countdown = countdowns[roundIndex],
            {playerStatus, board} = rounds[roundIndex]

        const playerState = playerStatus[positionIndex]
        return <section className={style.play}>
            <Stage>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <PutShadow playerState={playerState} role={role}/>
                            <Referee playerState={playerState}/>
                            <Outside playerState={playerState}/>
                            <Role playerState={playerState} role={role} privatePrice={privatePrices[roundIndex]}/>
                            <Board playerState={playerState} role={role} board={board} positionIndex={positionIndex}
                                   dealIt={this.dealIt.bind(this)}/>
                            <Tip playerState={playerState} role={role} countdown={countdown} roundTime={roundTime}/>
                            <Dealed playerState={playerState} role={role}/>
                            <Dialog dealDialog={dealDialog} position={dealObj.position} price={dealObj.price}
                                    dealDone={this.dealDone.bind(this)} role={role}/>
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

}
