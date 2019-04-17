import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'
import {Stage, Input, Button, RoundSwitching, span} from 'bespoke-game-graphical-util'

import Role from './coms/Role'
import Board from './coms/Board'
import Referee from './coms/Referee'
import Outside from './coms/Outside'
import PutShadow from './coms/PutShadow'

interface IPlayState {
    price: string
    loading: boolean
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    state = {
        price: '',
        loading: true,
        newRoundTimers: []
    }

    lang = Lang.extractLang({
        hello: ['你好', 'Hello'],
        shout: ['出价', 'Shout',],
        prepare: ['准备好了', 'Prepared'],
        nextRound: ['下一轮', 'Next Round'],
        matchingPlayer: ['正在匹配玩家', 'Matching Players...'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
    })

    async componentDidMount() {
        const {props: {frameEmitter}} = this
        frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
            this.setState(state => {
                const newRoundTimers = state.newRoundTimers.slice()
                newRoundTimers[roundIndex] = newRoundTimer
                return {newRoundTimers}
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
                        x: span(5),
                        y: span(9)
                    }}>
                        <Button label={lang.prepare} onClick={() => frameEmitter.emit(MoveType.prepare)}/>
                    </foreignObject>
                </>
            }
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
                                x: span(3),
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
                                x: span(7),
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

    render() {
        const {
            lang,
            props: {
                game: {params: {}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex, role, privatePrices},
            }, state: {loading, newRoundTimers}
        } = this
        if (loading) {
            return <MaskLoading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label='正在匹配玩家...'/>
        }

        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus, board} = rounds[roundIndex]

        const playerState = playerStatus[positionIndex]

        return <section className={style.play}>
            <Stage dev={true}>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <PutShadow playerState={playerState} role={role}/>
                            <Referee playerState={playerState}/>
                            <Outside playerState={playerState}/>
                            <Role playerState={playerState} role={role} privatePrice={privatePrices[roundIndex]}/>
                            <Board playerState={playerState} role={role} board={board}/>
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

}
