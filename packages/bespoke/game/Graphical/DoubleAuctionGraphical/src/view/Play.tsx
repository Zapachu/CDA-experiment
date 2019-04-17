import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../interface'
import {FetchType, MoveType, PushType, NEW_ROUND_TIMER, PlayerStatus} from '../config'
import {Stage, Input, Button, RoundSwitching, span} from 'bespoke-game-graphical-util'

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
                playerState: {groupIndex, positionIndex}
            }, state: {price}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <foreignObject {...{
                    x: span(5),
                    y: span(8)
                }}>
                    <Button label={lang.prepare} onClick={() => frameEmitter.emit(MoveType.prepare)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <>
                    <foreignObject {...{
                        x: span(5),
                        y: span(8)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(5),
                        y: span(8.6)
                    }}>
                        <Button label={lang.shout} onClick={this.shout.bind(this)}/>
                    </foreignObject>
                </>
            }
            default:
                return null
        }
    }

    render() {
        const {
            lang,
            props: {
                game: {params: {}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex, role}
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
            {playerStatus} = rounds[roundIndex],
            {playing} = rounds[roundIndex]

        const playerState = playerStatus[positionIndex]

        return <section className={style.play}>
            <Stage dev={true}>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <Referee playerState={playerState}/>
                            <Outside playing={playing}/>
                            <PutShadow playerState={playerState} playing={playing} role={role}/>
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

}
