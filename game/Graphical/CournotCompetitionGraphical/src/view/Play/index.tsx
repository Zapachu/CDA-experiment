import * as React from 'react'
import * as style from './style.scss'
import {Core} from '@bespoke/client'
import {Lang, MaskLoading, Toast} from '@elf/component'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {
    span,
    Stage,
    Host,
    Button,
    Input,
    RoundSwitching,
} from '@bespoke-game/graphical-util'
import Players from './Players'
import Fishpond from './Fishpond'

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
        shout: ['捕鱼', 'Catch Fish'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
        invalidPrice: ['价格需在起拍价与心理价值之间', 'Price shout be between starting price and private price'],
        tradeSuccess: ['交易成功！', 'Traded successfully'],
        instruction: ['古诺竞争：两位参与成员，您选择的产量越高，市场价格越低，您选择的产量越低，市场价格越高', 'Cournot Competition: two participants, the higher you choose, the lower the price will be; the lower you choose, the higher the price will be'],
        prepare: [n => `当前鱼塘中鱼的数量为${n}，你最多可捕鱼${Math.floor(n/2)}条，捕鱼数量越多，则价格越低；捕鱼数量越少，则价格越高`, n => `The number of fish in the fishpond currently is ${n}，you can catch at most ${Math.floor(n/2)} fish，the more fish you catch, the lower the price will be; the less fish you catch, the higher the price will be`],
        conclusion: [(n, m) => `两边捕鱼完成，您的当前捕鱼数量为${n}，则剩下的产量为${m}，即每条鱼的价格为${m}`, (n, m) => `Fishing is over，you caught ${n} fish while ${m} fish are left in the fishpond，which means that price of each fish is ${m}`],
        wait: ['请等待对方捕鱼', 'Please wait for the othe participant'],
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
                playerState: {groupIndex, positionIndex, quantities, profits}
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
            {playerStatus} = rounds[roundIndex],
            curPlayerStatus = playerStatus[positionIndex]
        return <section className={style.play}>
            <Stage>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <g transform={`translate(${span(2.4)},${span(1.4)})`}>
                                <Host
                                    widthScale={1.3}
                                    msg={this.renderHostMessage()}
                                />
                            </g>
                            <Players playerStatus={curPlayerStatus} lastProfit={roundIndex > 0 ? profits[roundIndex-1] : 0} curQuantity={quantities[roundIndex] || 0} />
                            <Fishpond playerStatus={curPlayerStatus} />
                            {this.renderOperateWidget()}
                        </>
                }
            </Stage>
        </section>
    }

    renderHostMessage = () => {
        const {
            lang, props: {
                game: {params: {quota}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex, quantities}
            }
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus, unitPrices} = rounds[roundIndex],
            curPlayerStatus = playerStatus[positionIndex]
        if(curPlayerStatus === PlayerStatus.outside) {
            return lang.instruction
        }
        if(curPlayerStatus === PlayerStatus.prepared) {
            return lang.prepare(quota)
        }
        if(unitPrices[roundIndex] !== undefined) {
            return lang.conclusion(quantities[roundIndex], unitPrices[roundIndex])
        }
        return lang.wait
    }

    shout() {
        const {
                lang, props: {
                    frameEmitter,
                    game: {params: {quota}},
                },
                state
            } = this
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price < 0 || price > Math.floor(quota/2)) {
            Toast.warn(lang.invalidPrice)
        } else {
            frameEmitter.emit(MoveType.shout, {quantity: +price})
        }
    }

    renderOperateWidget() {
        const {
            lang, props: {
                frameEmitter,
                gameState: {groups},
                playerState: {groupIndex, positionIndex, quantities, profits}
            }, state: {price}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus, unitPrices} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <foreignObject {...{
                    x: span(4.7),
                    y: span(8)
                }}>
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <>
                    <foreignObject {...{
                        x: span(5.5),
                        y: span(8)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(4.7),
                        y: span(8.6)
                    }}>
                        <Button label={lang.shout} onClick={() => this.shout()}/>
                    </foreignObject>
                </>
            }
            case PlayerStatus.shouted: {
                if(unitPrices[roundIndex] === undefined) {
                    return null
                }
                return <>
                    <text fontSize={'20px'} transform={`translate(${span(3.5)},${span(8)})`}>
                        {`您的收益是：每条鱼的价格${unitPrices[roundIndex]}*鱼量${quantities[roundIndex]}=`}
                        <tspan fontSize={'24px'} fill={'#ffd466'}>{profits[roundIndex]}</tspan>
                    </text>
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
