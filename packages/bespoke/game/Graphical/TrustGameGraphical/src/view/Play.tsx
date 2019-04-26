import * as React from 'react'
import Cash from './coms/Cash'
import Referee from './coms/Referee'
import PutShadow from "./coms/PutShadow"
import Background from './coms/Background'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {Stage, span, Input, Button, RoundSwitching} from 'bespoke-game-graphical-util'
import {
    ICreateParams,
    IGameState,
    IMoveParams,
    IPlayerState,
    IPushParams
} from '../interface'
import {FetchType, MoveType, PlayerStatus, PushType, NEW_ROUND_TIMER} from '../config'
import * as style from './style.scss'

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

    shout = () => {
        const {
            props: {
                gameState: {groups},
                playerState: {groupIndex, balances},
                frameEmitter
            }, state
        } = this
        const {roundIndex} = groups[groupIndex]
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price > balances[roundIndex]) {
            Toast.warn('你的出价大于您拥有的资金')
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price})
        }
    }

    renderOperateWidget() {
        const {
            lang, props: {
                frameEmitter,
                gameState: {groups},
                playerState: {groupIndex, positionIndex, balances}
            }, state: {price}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <foreignObject {...{
                    x: span(4),
                    y: span(8)
                }}>
                    <Button label={lang.prepare} onClick={() => frameEmitter.emit(MoveType.prepare)}/>
                </foreignObject>
            }
            case PlayerStatus.nextRound: {
                return <>
                    <foreignObject {...{
                        x: span(5),
                        y: span(8)
                    }}>
                        <p style={{width: 300, marginLeft: '-5rem', fontSize: '1.8rem', marginBottom: '3rem'}}>
                            您的收益 {balances[roundIndex]}
                        </p>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(4.2),
                        y: span(8.6)
                    }}>
                        <Button label={lang.nextRound} onClick={() => frameEmitter.emit(MoveType.toNextRound)}/>
                    </foreignObject>
                </>
            }
            case PlayerStatus.timeToShout: {
                return <>
                    <foreignObject {...{
                        x: span(5),
                        y: span(8)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(4.15),
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
                gameState: {groups},
                playerState: {groupIndex, balances, positionIndex}
            }, state: {loading, newRoundTimers}
        } = this

        if (loading) {
            return <MaskLoading label='加载中...'/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchingPlayer}/>
        }

        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus} = rounds[roundIndex]

        const playerState = playerStatus[positionIndex]

        if (playerState === PlayerStatus.memberFull) {
            return <MaskLoading label='满员...'/>
        }

        return <section className={style.play}>
            <Stage>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <PutShadow curPlayer={rounds[roundIndex].currentPlayer}/>
                            <Background/>
                            <Cash playerState={playerState} position={positionIndex} balance={balances[roundIndex]}/>
                            <Referee playerState={playerState} position={positionIndex} balance={balances[roundIndex]}/>
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

}
