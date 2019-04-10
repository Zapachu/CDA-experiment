import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import {animated, useSpring} from 'react-spring'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {Direction, gameData, Role, span} from './gameData'
import {loadImgGroup} from '../util/imgGroup'
import throttle = require('lodash/throttle')

function Button({label, onClick}: {
    label: string,
    onClick: () => void
}) {
    const {imageGroup: {button}} = gameData
    return <button style={{
        width: button.width,
        height: button.height,
        position: 'relative',
        left: -button.width >> 1,
        top: -button.height >> 1,
        background: `url(${button.src}) no-repeat`,
        border: 'none',
        outline: 'none',
        fontSize: button.height / 2
    }} onClick={throttle(onClick, 500)}>{label}</button>
}

function Host({msg = ''}: { msg?: string }) {
    const {imageGroup: {host, dialog}} = gameData
    const {opacity} = useSpring(({opacity: msg ? .95 : 0, from: {opacity: 0}}))
    return <g>
        <animated.g {...{
            transform: `translate(${span(1.8)},${span(-.5)})`,
            opacity
        }}>
            <image href={dialog.src} width={span(3.2)}/>
            <foreignObject transform={`translate(${span(.15)},${span(.15)})`}>
                <animated.p style={{width: `${span(3)}px`, fontSize: '1.8rem'}}>{msg}</animated.p>
            </foreignObject>
        </animated.g>
        <image {...{
            href: host.src
        }}/>
    </g>
}

function Input({value = '', onChange}: {
    value: string
    onChange: (value: string) => void
}) {
    const PADDING = .15
    const {imageGroup: {input}} = gameData,
        width = (1 - 2 * PADDING) * input.width, height = (1 - 2 * PADDING) * input.height
    return <input {...{
        style: {
            width,
            height,
            padding: `${PADDING * input.height}px ${PADDING * input.width}px`,
            position: 'relative',
            left: -input.width >> 1,
            top: -input.height >> 1,
            background: `url(${input.src}) no-repeat`,
            border: 'none',
            outline: 'none',
            fontSize: input.height / 3
        },
        value,
        onChange: ({target: {value}}) => onChange(value)
    }}/>
}

function Player({playerStatus, direction, privatePrice}: {
    privatePrice?: number
    playerStatus: PlayerStatus
    direction?: Direction
}) {
    const {imageGroup: {playerL, playerR, playerL_dealed, playerR_dealed, shadow, shadow_player, idea, winner}} = gameData
    const [player_normal, player_dealed] = direction === Direction.L ? [playerR, playerR_dealed] : [playerL, playerL_dealed],
        player = playerStatus == PlayerStatus.won ? player_dealed : player_normal
    const {opacity} = useSpring({opacity: playerStatus == PlayerStatus.outside ? 0 : 1})
    return <animated.g opacity={opacity}>
        {
            playerStatus == PlayerStatus.won ?
                <image
                    transform={`translate(${span(-.2)},${span(-.6)})`}
                    width={span(1.5)}
                    href={winner.src}/> : null
        }
        <image width={shadow.width}
               transform={`translate(${player.width - shadow.width >> 1},${player.height * .9})`}
               href={privatePrice ? shadow_player.src : shadow.src}/>
        <image {...{
            href: player.src
        }}/>
        {
            privatePrice && playerStatus == PlayerStatus.prepared ?
                <g transform={`translate(${idea.width >> 1},${-idea.height})`}>
                    <image href={idea.src}/>
                    <text {...{
                        fontSize: idea.height / 3,
                        y: idea.height * .6,
                        x: idea.width * .3
                    }}>{privatePrice}</text>
                </g> : null
        }
    </animated.g>
}

function Paint({roundIndex}: { roundIndex: number }) {
    const {imageGroup: {painting1, painting2, painting3, painting4, painting5}} = gameData
    const paintings = [painting1, painting2, painting3, painting4, painting5],
        paint = paintings[roundIndex % paintings.length]
    return <image {...{
        href: paint.src,
        width: span(3)
    }}/>
}

function Envelope({playerStatus}: { playerStatus: PlayerStatus }) {
    const {imageGroup: {envelope_open, envelope_closing}} = gameData
    switch (playerStatus) {
        case PlayerStatus.prepared:
            return <image href={envelope_open.src} width={span(.8)}/>
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
                href: `${envelope_closing.src}?k=${Math.random()}`,
                width: width.interpolate(span),
                x: x.interpolate(span),
                y: y.interpolate(span)
            }}/>
        default:
            return null
    }
}

interface IPlayState {
    loading: boolean
    price: string,
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
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
        gameData.imageGroup = await loadImgGroup()
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
        const {imageGroup: {roundSwitching}} = gameData
        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus} = rounds[roundIndex]
        const someoneWon = playerStatus.some(s => s === PlayerStatus.won)
        return <section className={style.play}>
            <svg viewBox={`0 0 ${gameData.stageSize} ${gameData.stageSize}`}>
                <g className={style.auxiliaryLine}>
                    {
                        Array(gameData.col).fill(null).map((_, i) => <React.Fragment key={i}>
                            <line {...{
                                x1: 0, y1: span(i),
                                x2: gameData.stageSize, y2: span(i)
                            }}/>
                            <line {...{
                                x1: span(i), y1: 0,
                                x2: span(i), y2: gameData.stageSize
                            }}/>
                        </React.Fragment>)
                    }
                </g>
                {
                    newRoundTimer ?
                        <>
                            <image {...{
                                href: roundSwitching.src,
                                x: span(5) - (roundSwitching.width >> 1),
                                y: span(1.5)
                            }}/>
                            <text {...{
                                fontSize: span(.3),
                                x: span(5),
                                y: span(7),
                                textAnchor: 'middle'
                            }}>{lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}</text>
                        </> :
                        <>
                            <g transform={`translate(${span(4.1)},${span(7.8)})`}>
                                <Envelope key={roundIndex} playerStatus={playerStatus[positionIndex]}/>
                            </g>
                            <g transform={`translate(${span(5)},${span(.5)})`}>
                                <Paint roundIndex={roundIndex}/>
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
            </svg>
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
        console.log(startingPrice, price, privatePrice)
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
                gameData.players.map(({direction, role}, i) =>
                    <g transform={`translate(${span(1.8 * i)},0)`}
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
