import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {animated, useSpring} from 'react-spring'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {
    span,
    Stage,
    ImgLoader,
    Host,
    Button,
    Input,
    Idea,
    Paint,
    RoundSwitching,
    Shadow,
    Win
} from 'bespoke-game-graphical-util'

function Player({playerStatus, direction, privatePrice}: {
    privatePrice?: number
    playerStatus: PlayerStatus
    direction?: Direction
}) {
    const {opacity} = useSpring({opacity: playerStatus == PlayerStatus.outside ? 0 : 1})
    return <ImgLoader src={[
        require('./img/playerL.svg'),
        require('./img/playerR.svg'),
        require('./img/playerL_dealed.svg'),
        require('./img/playerR_dealed.svg')
    ]} render={({images: [playerL, playerR, playerL_dealed, playerR_dealed]}) => {
        const [player_normal, player_dealed] = direction === Direction.L ? [playerR, playerR_dealed] : [playerL, playerL_dealed],
            player = playerStatus == PlayerStatus.won ? player_dealed : player_normal
        return <animated.g opacity={opacity}>
            {
                playerStatus == PlayerStatus.won ?
                    <g transform={`translate(${span(-.2)},${span(-.6)})`}>
                        <Win/>
                    </g> : null
            }
            <g transform={`translate(${player.width >> 1},${player.height * .9})`}>
                <Shadow active={!!privatePrice}/>
            </g>
            <image {...{
                href: player.src
            }}/>
            {
                privatePrice && playerStatus == PlayerStatus.prepared ?
                    <Idea msg={privatePrice}/> : null
            }
        </animated.g>
    }
    }/>
}

function Envelope({playerStatus}: { playerStatus: PlayerStatus }) {
    switch (playerStatus) {
        case PlayerStatus.prepared:
            return <image href={require('./img/envelope_open.svg')} width={span(.8)}/>
        case PlayerStatus.shouted:
            const {x, y, width} = useSpring({
                x: -2, y: -5, width: 0,
                from: {x: 0, y: 0, width: .8},
                delay: 1000,
                config: {
                    duration: 800
                }
            })
            return <animated.image {...{
                href: `${require('./img/envelope_closing.gif')}?k=${Math.random()}`,
                width: width.interpolate(span),
                x: x.interpolate(span),
                y: y.interpolate(span)
            }}/>
        default:
            return null
    }
}

//region config
export enum Direction {
    L, R
}

export enum Role {
    player,
    partner,
    other
}

const PlayersCfg: Array<{
    direction: Direction
    role: Role
}> = [
    {
        direction: Direction.R,
        role: Role.other
    },
    {
        direction: Direction.R,
        role: Role.partner
    },
    {
        direction: Direction.L,
        role: Role.player
    },
    {
        direction: Direction.L,
        role: Role.other
    }
]
//endregion

interface IPlayState {
    loading: boolean
    price: string,
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, IPlayState> {
    lang = Lang.extractLang({
        loading: ['加载中...', 'LOADING...'],
        matchPlayers: ['正在匹配玩家...', 'Matching other players...'],
        enterMarket: ['进入市场', 'Enter Market'],
        shout: ['报价', 'Shout'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
        invalidPrice: ['价格需在起拍价与心理价值之间', 'Price shout be between starting price and private price'],
        curPaintStartingPrice: [n => `当前画作起拍价：${n}`, n => `The starting price of this paint is ${n}`],
        tradeSuccess: ['交易成功！', 'Traded successfully']
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
                game: {params: {startingPrice}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
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
            {playerStatus} = rounds[roundIndex]
        const someoneWon = playerStatus.some(s => s === PlayerStatus.won)
        return <section className={style.play}>
            <Stage>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <g transform={`translate(${span(4.1)},${span(7.8)})`}>
                                <Envelope key={roundIndex} playerStatus={playerStatus[positionIndex]}/>
                            </g>
                            <g transform={`translate(${span(5)},${span(.5)})`}>
                                <Paint index={roundIndex}/>
                            </g>
                            <g transform={`translate(${span(1)},${span(1.8)})`}>
                                <Host
                                    msg={someoneWon ? lang.tradeSuccess : lang.curPaintStartingPrice(startingPrice)}/>
                            </g>
                            {
                                this.renderPlayers()
                            }
                            {
                                this.renderOperateWidget()
                            }
                        </>
                }
            </Stage>
        </section>
    }

    shout() {
        const {
                lang, props: {
                    frameEmitter,
                    game: {params: {startingPrice}},
                    gameState: {groups},
                    playerState: {groupIndex, privatePrices}
                },
                state
            } = this,
            privatePrice = privatePrices[groups[groupIndex].roundIndex]
        this.setState({price: ''})
        const price = Number(state.price)
        if (Number.isNaN(price) || price < startingPrice || price > privatePrice) {
            Toast.warn(lang.invalidPrice)
        } else {
            frameEmitter.emit(MoveType.shout, {price: +price})
        }
    }

    renderPlayers() {
        const {props: {gameState: {groups}, playerState: {groupIndex, positionIndex, privatePrices}}} = this
        const {rounds, roundIndex} = groups[groupIndex], {playerStatus} = rounds[roundIndex]
        const partnerStatus = playerStatus.some((status, i) => status === PlayerStatus.won && i !== positionIndex) ?
            PlayerStatus.won : PlayerStatus.prepared
        return <g transform={`translate(${span(1.8)},${span(4.5)})`}>
            {
                PlayersCfg.map(({direction, role}, i) =>
                    <g key={i} transform={`translate(${span(1.8 * i)},0)`}
                       opacity={role === Role.player ? 1 : role === Role.partner ? .7 : .4}>
                        <Player key={i}
                                playerStatus={role === Role.player ? playerStatus[positionIndex] :
                                    role === Role.partner ? partnerStatus : PlayerStatus.prepared
                                }
                                privatePrice={role === Role.player ? privatePrices[roundIndex] : null}
                                direction={direction}/>
                    </g>)
            }
        </g>
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
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <>
                    <foreignObject {...{
                        x: span(6),
                        y: span(8)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: span(6),
                        y: span(8.6)
                    }}>
                        <Button label={lang.shout} onClick={() => this.shout()}/>
                    </foreignObject>
                </>
            }
            default:
                return null
        }
    }
}
