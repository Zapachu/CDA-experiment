import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading} from 'bespoke-client-util'
import {Button, Host, ImgLoader, RoundSwitching, Shadow, span, Stage} from 'bespoke-game-graphical-util'
import {ICreateParams, IGameState, IMoveParams, IPlayerState, IPushParams, GameState} from '../../interface'
import {FetchType, MoveType, PlayerStatus, PushType, NEW_ROUND_TIMER} from '../../config'

function Player({active, showBack, matched}: {
    active: boolean
    showBack?: boolean
    matched?: {
        index: number
        price: number
    }
}) {
    return <ImgLoader src={[
        require('./img/body1.svg'),
        require('./img/body2.svg'),
        require('./img/body3.svg'),
        require('./img/body4.svg'),
        require('./img/face1.svg'),
        require('./img/face2.svg'),
        require('./img/face3.svg'),
        require('./img/face4.svg'),
        require('./img/hair1.svg'),
        require('./img/hair2.svg'),
        require('./img/hair3.svg'),
        require('./img/hair4.svg'),
        require('./img/playerBack.svg')

    ]} render={
        ({images: [body1, body2, body3, body4, face1, face2, face3, face4, hair1, hair2, hair3, hair4, playerBack]}) => {
            const bodyResources = [body1, body2, body3, body4],
                body = bodyResources[~~(Math.random() * bodyResources.length)]
            const faceResources = [face1, face2, face3, face4],
                face = faceResources[~~(Math.random() * faceResources.length)]
            const hairResources = [hair1, hair2, hair3, hair4],
                hair = hairResources[~~(Math.random() * hairResources.length)]
            return <g>
                <g transform={`translate(0,${span(3)})`}>
                    <Shadow active={active}/>
                </g>
                {
                    showBack ?
                        <image href={playerBack.src} x={-playerBack.width >> 1} y={span(.5)}/> :
                        <>
                            <image href={body.src} x={-body.width >> 1} y={span(.75)}/>
                            <image href={face.src} x={-face.width >> 1} y={span(.15)}/>
                            <image href={hair.src} x={-hair.width >> 1}/>
                            {
                                matched ? <g transform={`translate(0,${span(1.5)})`}>
                                    <Good {...matched}/>
                                </g> : null
                            }
                        </>
                }
            </g>
        }
    }/>
}

function Good({index, price, scale = 1}: { index: number, price: number, scale?: number }) {
    const lang = Lang.extractLang({
        good: ['物品', 'Good'],
        privatePrice: ['心理价格', 'Private Price']
    })

    const [dragging, setDragging] = React.useState(false)
    const [{offsetX, offsetY}, setOffsetXY] = React.useState({offsetX: 0, offsetY: 0})

    return <ImgLoader src={require('./img/box.svg')} render={({images: [box]}) =>
        <g
            onMouseDown={() => setDragging(true)}
            onMouseMove={event => {
                const {movementX, movementY} = event
                if (!dragging) {
                    return
                }
                setOffsetXY({
                    offsetX: offsetX > span(1) ? span(1.8) : offsetX + movementX,
                    offsetY: offsetY + movementY
                })
            }}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            transform={`translate(${(-box.width >> 1) + offsetX},${offsetY}),scale(${scale})`}>
            <image href={box.src}/>
            <g transform={`translate(${box.width >> 1},${span(.5)})`} style={{
                userSelect: 'none',
                textAnchor: 'middle',
                fontSize: 18
            }}>
                <text>{lang.good}{index}</text>
                <text y={span(.2)}>{lang.privatePrice}{price}</text>
            </g>
        </g>
    }/>
}

function GoodBorder({width, height}: { width: number, height: number }) {
    return <rect {...{
        width,
        height,
        rx: 10,
        ry: 10,
        strokeWidth: 4,
        stroke: '#333',
        fill: 'transparent'
    }}/>
}

const ROW_SIZE = 4, PLAYER_POSITION = 0

interface IPlayState {
    preferences: Array<number>
    newRoundTimers: Array<number>
}

export class Play extends Core.Play<ICreateParams, IGameState, IPlayerState, MoveType, PushType, IMoveParams, IPushParams, FetchType, IPlayState> {
    lang = Lang.extractLang({
        desc: ['延迟接受匹配机制: 参与者依据自己对于物品的心理价值对物品进行偏好表达，系统将自动为您匹配'],
        operateTips: ['请将物品按照偏好拖入右边排序'],
        wait4Others: ['等待其它玩家操作...'],
        matchSuccess: ['匹配成功，结果如下'],
        matchPlayers: ['正在匹配玩家...', 'Matching other players...'],
        enterMarket: ['进入市场', 'Enter Market'],
        submit: ['提交', 'Submit'],
        toNewRound: [n => `${n} 秒后进入下一轮`, n => `Market will enter into next round in ${n}s`]
    })

    state: IPlayState = {
        preferences: [],
        newRoundTimers: []
    }

    componentDidMount(): void {
        const {props: {frameEmitter}} = this
        frameEmitter.on(PushType.newRoundTimer, ({roundIndex, newRoundTimer}) => {
            this.setState(state => {
                const newRoundTimers = state.newRoundTimers.slice()
                newRoundTimers[roundIndex] = newRoundTimer
                return {newRoundTimers}
            })
        })
        frameEmitter.emit(MoveType.getPosition)
    }

    submit() {
        const {props: {frameEmitter}, state: {preferences}} = this
        console.log(preferences)
        frameEmitter.emit(MoveType.submit, {preferences: [1, 3, 4, 6, 7, 2, 5, 0]})
    }

    render(): React.ReactNode {
        const {lang, props: {gameState: {groups}, playerState: {groupIndex, positionIndex}}, state: {newRoundTimers}} = this
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const {rounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus} = rounds[roundIndex]
        return <section className={style.play}>
            <Stage dev={true}>
                {
                    newRoundTimer ?
                        <RoundSwitching msg={lang.toNewRound(NEW_ROUND_TIMER - newRoundTimer)}/> :
                        <>
                            <g transform={`translate(${span(1)},${span(1)})`}>
                                <Host widthScale={1.3}
                                      msg={{
                                          [PlayerStatus.outside]: lang.desc,
                                          [PlayerStatus.prepared]: lang.operateTips,
                                          [PlayerStatus.submitted]: lang.wait4Others,
                                          [PlayerStatus.matched]: lang.matchSuccess
                                      }[playerStatus[positionIndex]]}/>
                            </g>
                            {
                                {
                                    [PlayerStatus.outside]: () => this.renderPlayers(true),
                                    [PlayerStatus.prepared]: () => this.renderPlay(),
                                    [PlayerStatus.submitted]: () => () => <RoundSwitching msg={lang.wait4Others}/>,
                                    [PlayerStatus.matched]: () => this.renderPlayers()
                                }[playerStatus[positionIndex]]()
                            }
                            <g transform={`translate(0,${span(8)})`}>
                                {
                                    this.renderOperateWidget()
                                }
                            </g>
                        </>
                }
            </Stage>
        </section>
    }

    renderPlay() {
        const BOX_SCALE = .8
        const {props: {gameState: {groups}, playerState: {groupIndex, rounds}}} = this
        const {roundIndex} = groups[groupIndex],
            {privatePrices} = rounds[roundIndex]
        return <g transform={`translate(${span(1.2)},${span(3.5)})`}>
            <image href={require('./img/playerSide.svg')}/>
            <g transform={`translate(${span(6)},${span(-1.5)})`}>
                {
                    privatePrices.map((price, index) =>
                        <g transform={`translate(0,${span(index - .05)})`}>
                            <GoodBorder width={span(1.5)} height={span(BOX_SCALE)}/>
                        </g>
                    )
                }
            </g>
            <g transform={`translate(${span(5)},${span(-1.5)})`}>
                {
                    privatePrices.map((price, index) =>
                        <g transform={`translate(0,${span(index)})`}>
                            <Good {...{index, price, scale: BOX_SCALE}}/>
                        </g>
                    )
                }
            </g>
            <g transform={`translate(${span(6)},${span(-1.5)})`}>
                <foreignObject>
                    <div style={{position: 'fixed'}}>
                    </div>
                </foreignObject>
            </g>
        </g>
    }

    renderPlayers(showBack?: boolean) {
        const {props: {game: {params: {groupSize}}, gameState: {groups}, playerState: {groupIndex, positionIndex}}} = this
        const {rounds, roundIndex} = groups[groupIndex],
            {matchResults} = rounds[roundIndex]
        return <g transform={`translate(${span(1.2)},${span(3.5)})`}>
            {
                Array(groupSize).fill(null)
                    .map((_, i) => ({
                        i,
                        j: (groupSize - 1) - (i === PLAYER_POSITION ? positionIndex : i === positionIndex ? PLAYER_POSITION : i)
                    }))
                    .sort(({j: j1}, {j: j2}) => j1 - j2)
                    .map(({i, j}) =>
                        <g transform={`translate(${span(2.1 * (j % ROW_SIZE) + ~~(j / ROW_SIZE))},${span(~~(j / ROW_SIZE) * 1.5)})`}>
                            <Player key={j} active={i === positionIndex}
                                    showBack={showBack}
                                    matched={matchResults[i] as Required<GameState.Group.Round.IMatchResult>}/>
                        </g>
                    )
            }
        </g>
    }

    renderOperateWidget() {
        const {
            lang, props: {
                frameEmitter,
                gameState: {groups},
                playerState: {groupIndex, positionIndex}
            }, state: {}
        } = this
        const {rounds, roundIndex} = groups[groupIndex],
            {playerStatus} = rounds[roundIndex]
        switch (playerStatus[positionIndex]) {
            case PlayerStatus.outside: {
                return <g transform={`translate(${span(5)},${span(1)})`}>
                    <Button label={lang.enterMarket} onClick={() => frameEmitter.emit(MoveType.enterMarket)}/>
                </g>
            }
            case PlayerStatus.prepared: {
                return <g transform={`translate(${span(4)},${span(1)})`}>
                    <Button label={lang.submit} onClick={() => this.submit()}/>
                </g>
            }
            default:
                return null
        }
    }
}
