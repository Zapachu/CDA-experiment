import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from 'bespoke-client-util'
import throttle = require('lodash/throttle')
import {Keyframes, config, SpringProps} from 'react-spring/renderprops'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {gameData, Role, Direction} from './gameData'
import {loadImgGroup} from '../util/imgGroup'

//region Button
const Button: React.FunctionComponent<{
    label: string,
    onClick: () => void
}> = ({label, onClick}) => {
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
        fontSize: button.height / 3
    }} onClick={throttle(onClick, 500)}>{label}</button>
}
//endregion

//region Host
import {DEAL_TIMER} from '../../config'

enum HostStatus {
    normal = 'normal',
    dealTimer = 'dealTimer',
    deal = 'deal',
    dealed = 'dealed'
}

export const Host: React.FunctionComponent<{ dealTimer: number, newRoundTimer: number }> = ({dealTimer = 0, newRoundTimer}) => {
    const lang = Lang.extractLang({
        dealed: ['成交！', 'Dealed !']
    })
    const {imageGroup: {host}} = gameData
    const SpringKeyframes = Keyframes.Spring<null, { rotate: number }>({
        [HostStatus.normal]: {rotate: 10},
        [HostStatus.dealTimer]: [
            {rotate: 0, config: {duration: 100}},
            {rotate: 30, config: config.wobbly}
        ],
        [HostStatus.deal]: [
            {rotate: 0, config: {duration: 100}},
            {rotate: 80, config: config.wobbly}
        ],
        [HostStatus.dealed]: {rotate: 80}
    }) as any

    return <SpringKeyframes state={
        newRoundTimer ? HostStatus.dealed :
            dealTimer === DEAL_TIMER ? HostStatus.deal :
                dealTimer ? HostStatus.dealTimer : HostStatus.normal}>
        {
            () => <g>
                <text x={-10}>{dealTimer === DEAL_TIMER ? lang.dealed : ''}</text>
                <image {...{
                    href: host.src
                }}/>
            </g>
        }
    </SpringKeyframes>
}
//endregion

//region Input
const padding = .15

export const Input: React.SFC<{
    value: string
    onChange: (value: string) => void
}> = ({value = '', onChange}) => {
    const {imageGroup: {input}} = gameData,
        width = (1 - 2 * padding) * input.width, height = (1 - 2 * padding) * input.height
    return <input {...{
        style: {
            width,
            height,
            padding: `${padding * input.height}px ${padding * input.width}px`,
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
//endregion

//region Player
interface KeyFrameState extends SpringProps {
    opacity: number
    x: number
    y: number
    rotateL: number
    rotateR: number
}

export class Player extends React.Component<{
    privatePrice?: number
    position: { x: number, y: number }
    playerStatus: PlayerStatus
    direction?: Direction
}> {
    SpringKeyframes

    constructor(props) {
        super(props)
        const normalState: KeyFrameState = {
            ...props.position,
            opacity: 1,
            rotateL: 0,
            rotateR: 0,
            config: {duration: 200}
        }
        this.SpringKeyframes = Keyframes.Spring<null, KeyFrameState>({
            [PlayerStatus.outside.toString()]: {...normalState, opacity: 0, x: 0},
            [PlayerStatus.prepared.toString()]: normalState,
            [PlayerStatus.shouted.toString()]: [
                {...normalState, rotateL: 30},
                normalState
            ],
            [PlayerStatus.won.toString()]: async next => {
                // noinspection InfiniteLoopJS
                while (true) {
                    await next({...normalState, rotateL: 85, rotateR: 85, y: -20, config: {duration: 300}})
                    await next({...normalState, rotateL: 60, rotateR: 60})
                }
            }
        })
    }

    render(): React.ReactNode {
        const {SpringKeyframes, props: {playerStatus, privatePrice, direction}} = this
        const {imageGroup: {playerL, playerR, playerL_dealed, playerR_dealed, shadow, shadow_player, idea, winner}} = gameData
        const [player_normal, player_dealed] = direction === Direction.L ? [playerR, playerR_dealed] : [playerL, playerL_dealed],
            player = playerStatus == PlayerStatus.won ? player_dealed : player_normal
        return <SpringKeyframes state={playerStatus.toString()}>
            {
                ({opacity, x, y}: KeyFrameState) => <g
                    opacity={opacity}
                    transform={`translate(${x},${y})`}>
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
                    {
                        playerStatus == PlayerStatus.won ?
                            <image transform={`translate(0,${-winner.height})`}
                                   href={winner.src}/> : null
                    }
                </g>
            }
        </SpringKeyframes>
    }
}

//endregion

interface IPlayState {
    loading: boolean
    price: string,
    dealTimers: Array<number>,
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    lang = Lang.extractLang({
        loading: ['加载中...', 'LOADING...'],
        matchPlayers: ['正在匹配玩家...', 'Matching other players...'],
        enterMarket: ['进入市场', 'Enter Market'],
        shout: ['报价', 'Shout'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
        startingPrice: ['起拍价', 'Starting Price'],
        invalidPrice: ['价格需在起拍价与心理价值之间', 'Price shout be between starting price and private price']
    })

    state: IPlayState = {
        loading: true,
        price: '',
        dealTimers: [],
        newRoundTimers: []
    }

    async componentDidMount() {
        const {props: {frameEmitter}} = this
        frameEmitter.on(PushType.dealTimer, ({roundIndex, dealTimer}) => {
            this.setState(state => {
                const dealTimers = state.dealTimers.slice()
                dealTimers[roundIndex] = dealTimer
                return {dealTimers}
            })
        })
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
                playerState: {groupIndex,positionIndex, privatePrices}
            }, state: {loading, dealTimers, newRoundTimers}
        } = this
        if (loading) {
            return <MaskLoading label={lang.loading}/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const {imageGroup: {paintFrame, roundSwitching, painting1, painting2, painting3, painting4, painting5}} = gameData
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex],
            newRoundTimer = newRoundTimers[roundIndex]
        const paintings = [painting1, painting2, painting3, painting4, painting5],
            paint = paintings[roundIndex % paintings.length]
        return <section className={style.play}>
            <svg viewBox={`0 0 ${gameData.stageSize} ${gameData.stageSize}`}>
                <g className={style.auxiliaryLine}>
                    {
                        Array(gameData.col).fill(null).map((_, i) => <React.Fragment key={i}>
                            <line {...{
                                x1: 0, y1: gameData.span(i),
                                x2: gameData.stageSize, y2: gameData.span(i)
                            }}/>
                            <line {...{
                                x1: gameData.span(i), y1: 0,
                                x2: gameData.span(i), y2: gameData.stageSize
                            }}/>
                        </React.Fragment>)
                    }
                </g>
                {
                    newRoundTimer ?
                        <>
                            <image {...{
                                href: roundSwitching.src,
                                x: gameData.span(5) - (roundSwitching.width>>1),
                                y: gameData.span(1.5),
                            }}/>
                            <text {...{
                                fontSize: gameData.span(.3),
                                x: gameData.span(5),
                                y: gameData.span(7),
                                textAnchor: 'middle'
                            }}>{lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}</text>
                        </> :
                        <>
                            <image {...{
                                href: paintFrame.src,
                                x: gameData.span(4),
                                y: gameData.span(.5),
                                width: gameData.span(3.5),
                                height: gameData.span(2)
                            }}/>
                            <image {...{
                                href: paint.src,
                                x: gameData.span(4.5),
                                y: gameData.span(.7),
                                width: gameData.span(2.4),
                                height: gameData.span(1.6)
                            }}/>
                            <text {...{
                                x: gameData.span(8),
                                y: gameData.span(2.1),
                                fontSize: 25
                            }}>{lang.startingPrice}:{startingPrice}</text>
                            <g transform={`translate(${gameData.span(2.2)},${gameData.span(1.8)})`}>
                                <Host {...{
                                    dealTimer: dealTimers[roundIndex],
                                    newRoundTimer: newRoundTimers[roundIndex]
                                }}/>
                            </g>
                            <g transform={`translate(${gameData.span(1)},${gameData.span(4.5)})`}>
                                {
                                    gameData.players.map(({direction, role}, i) =>
                                        <Player key={i}
                                                position={{x: gameData.span(1.8 * i + .8), y: 0}}
                                                playerStatus={role === Role.player ? playerStatus[positionIndex] : PlayerStatus.prepared}
                                                privatePrice={role === Role.player ? privatePrices[positionIndex] : null}
                                                direction={direction}/>)
                                }
                            </g>
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
                    x: gameData.span(5),
                    y: gameData.span(8)
                }}>
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <>
                    <image {...{
                        href: gameData.imageGroup.envelope.src,
                        width: gameData.span(.9),
                        x: gameData.span(4),
                        y: gameData.span(8)
                    }}/>
                    <foreignObject {...{
                        x: gameData.span(6),
                        y: gameData.span(8)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: gameData.span(6),
                        y: gameData.span(8.6)
                    }}>
                        <Button label={lang.shout} onClick={() => this.shout()}/>
                    </foreignObject>
                </>
            }
            default: {
                return null
            }
        }
    }

}
