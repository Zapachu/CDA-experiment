import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {
    span,
    Stage,
    Host,
    Button,
    Input,
    RoundSwitching,
} from 'bespoke-game-graphical-util'
import Players from './Players'

interface IPlayState {
    loading: boolean
    price: string,
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    lang = Lang.extractLang({
        loading: ['加载中...', 'LOADING...'],
        matchPlayers: ['正在匹配玩家...', 'Matching other players...'],
        enterMarket: ['准备好了', 'Ready'],
        shout: ['报价', 'Set price'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
        invalidPrice: ['价格需在0与100之间', 'Price shout be between 0 and 100'],
        instruction: ['伯川德竞争：每位成员代表一家公司报价，买方市场总是购买价格更低的同类产品，因此出价更高的公司会被淘汰', 'Betrand Competition: every participant represents their company to set a price, the buyer market always purchase the one at lower price, so companies that set higher prices will fail'],
        prepare: ['接下来请各位参与者开始报价吧', 'Please set a price'],
        conclusion: [(n, m) => `恭喜${n}号，成功卖出产品，最后的成交价格为${m}`, (n, m) => `Congratulations to number ${n}, you have successfully sold out your product, the strike price was ${m}`],
        next: ['下一轮', 'Next round'],
    })

    state: IPlayState = {
        loading: true,
        price: '',
        newRoundTimers: []
    }

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

    render(): React.ReactNode {
        const {
            lang, props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex, prices, profits},
            }, state: {loading, newRoundTimers}
        } = this
        if (loading) {
            return <MaskLoading label={lang.loading}/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus, playerPrice, dealerIndex} = rounds[roundIndex],
            curPlayerStatus = playerStatus[positionIndex]
        return <section className={style.play}>
            <Stage dev={false}>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <g transform={`translate(${span(2.4)},${span(1.4)})`}>
                                <Host
                                    widthScale={1.4}
                                    msg={this.renderHostMessage()}
                                />
                            </g>
                            <Players playerStatus={curPlayerStatus} 
                                lastProfit={roundIndex > 0 ? profits[roundIndex-1] : 0} 
                                playerPrice={playerPrice}
                                position={positionIndex}
                                dealerIndex={dealerIndex}
                                curPrice={prices[roundIndex] || 0} />
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

    renderHostMessage = () => {
        const {
            lang, props: {
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus, playerPrice, dealerIndex} = rounds[roundIndex],
            curPlayerStatus = playerStatus[positionIndex]
        if(curPlayerStatus === PlayerStatus.outside) {
            return lang.instruction
        }
        if(dealerIndex !== null) {
            return lang.conclusion(dealerIndex+1, playerPrice[dealerIndex])
        }
        return lang.prepare
    }

    shout() {
        const {
                lang, props: {
                    frameEmitter,
                },
                state
            } = this
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price <= 0 || price > 100) {
            Toast.warn(lang.invalidPrice)
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
            {playerStatus, dealerIndex} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <foreignObject {...{
                    x: span(4.7),
                    y: span(9)
                }}>
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <>
                    <foreignObject {...{
                        x: span(5.5),
                        y: span(8.6)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(4.7),
                        y: span(9.1)
                    }}>
                        <Button label={lang.shout} onClick={() => this.shout()}/>
                    </foreignObject>
                </>
            }
            case PlayerStatus.shouted: {
                if(dealerIndex === null) {
                    return null
                }
                return <>
                    <foreignObject {...{
                        x: span(4.7),
                        y: span(8.6)
                    }}>
                        <Button label={lang.next} onClick={() => frameEmitter.emit(MoveType.nextRound)}/>
                    </foreignObject>
                </>
            }
            default:
                return null
        }
    }
}
