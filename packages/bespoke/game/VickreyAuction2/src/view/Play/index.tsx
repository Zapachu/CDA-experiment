import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading, Toast} from '@dev/client'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams} from '../../interface'
import {FetchType, MoveType, NEW_ROUND_TIMER, PlayerStatus, PushType} from '../../config'
import {gameData} from './gameData'
import {loadImgGroup} from '../util/imgGroup'
import {Button, Envelope, Input, Player, Host} from './component'

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
        toNewRound: [n => `${n}秒后进入下一轮`, n => `Market will enter into next round in ${n}s`],
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
                game: {params: {groupSize, startingPrice}},
                gameState: {groups},
                playerState: {groupIndex, positionIndex, privatePrices}
            }, state: {loading, dealTimers, newRoundTimers}
        } = this
        if (loading) {
            return <MaskLoading label={lang.loading}/>
        }
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const {imageGroup: {background, background2, desk, painting1, painting2, painting3, painting4, painting5}} = gameData
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex],
            newRoundTimer = newRoundTimers[roundIndex]
        const paintings = [painting1, painting2, painting3, painting4, painting5],
            paint = paintings[roundIndex % paintings.length]
        return <section className={style.play}>
            <svg viewBox={`0 0 ${gameData.stageSize} ${gameData.stageSize}`}>
                {
                    newRoundTimer ? <text {...{
                        fontSize: gameData.span(.3),
                        x: gameData.span(5),
                        y: gameData.span(.5),
                        textAnchor: 'middle'
                    }}>{lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}</text> : null
                }
                <image {...{
                    href: background.src,
                    height: gameData.span(7),
                    width: gameData.stageSize
                }}/>
                <image {...{
                    href: background2.src,
                    x: gameData.span(.7),
                    y: gameData.span(1),
                    width: gameData.span(8.6)
                }}/>
                <image {...{
                    href: paint.src,
                    x: gameData.span(4),
                    y: gameData.span(1.35),
                    width: gameData.span(2.4),
                    height: gameData.span(1.6)
                }}/>
                <text {...{
                    x: gameData.span(7.2),
                    y: gameData.span(2.1),
                    fontSize: 25
                }}>{lang.startingPrice}:{startingPrice}</text>
                <g transform={`translate(${gameData.span(2.2)},${gameData.span(1.8)})`}>
                    <Host {...{
                        dealTimer: dealTimers[roundIndex],
                        newRoundTimer: newRoundTimers[roundIndex]
                    }}/>
                </g>
                <image {...{
                    href: desk.src,
                    x: gameData.span(2),
                    y: gameData.span(2.5)
                }}/>
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
                <g transform={`translate(${gameData.span(1)},${gameData.span(4.5)})`}>
                    {
                        Array(groupSize).fill(null).map((_, i) =>
                            <React.Fragment key={i}>
                                <Player {...{
                                    playerStatus: playerStatus[i],
                                    position: {x: gameData.span(1.2 * i + 1), y: 0}
                                }} {...positionIndex === i ? {
                                    privatePrice: privatePrices[roundIndex]
                                } : {}}/>
                                <Envelope {...{
                                    playerStatus: playerStatus[i],
                                    beforeShout: {x: gameData.span(1.2 * i + .8), y: gameData.span(.6), scale: .3},
                                    afterShout: {x: gameData.span(.1 * i + 1.4), y: gameData.span(-2.15), scale: .5}
                                }}/>
                            </React.Fragment>
                        )
                    }
                </g>
                {
                    this.renderOperateWidget()
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
                    x: gameData.span(4),
                    y: gameData.span(8)
                }}>
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </foreignObject>
            }
            case PlayerStatus.prepared: {
                return <React.Fragment>
                    <foreignObject {...{
                        x: gameData.span(5),
                        y: gameData.span(7.5)
                    }}>
                        <Input value={price} onChange={price => this.setState({price})}/>
                    </foreignObject>
                    <foreignObject {...{
                        x: gameData.span(4),
                        y: gameData.span(8)
                    }}>
                        <Button label={lang.shout} onClick={() => this.shout()}/>
                    </foreignObject>
                </React.Fragment>
            }
            default: {
                return null
            }
        }
    }

}