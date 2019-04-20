import * as React from 'react'
import * as style from './style.scss'
import {Core, Lang, MaskLoading} from 'bespoke-client-util'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd'
import {Button, Host, ImgLoader, RoundSwitching, Shadow, span, Stage, spanDom} from 'bespoke-game-graphical-util'
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
        frameEmitter.emit(MoveType.submit, {preferences})
    }

    render(): React.ReactNode {
        const {lang, props: {gameState: {groups}, playerState: {groupIndex, positionIndex, rounds: playerRounds}}, state: {newRoundTimers}} = this
        if (groupIndex === undefined) {
            return <MaskLoading label={lang.matchPlayers}/>
        }
        const {rounds: groupRounds, roundIndex} = groups[groupIndex],
            newRoundTimer = newRoundTimers[roundIndex],
            {playerStatus} = groupRounds[roundIndex],
            {privatePrices} = playerRounds[roundIndex]
        return <section className={style.play}>
            <Stage>
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
            {
                playerStatus[positionIndex] === PlayerStatus.prepared ?
                    <section style={{
                        position: 'absolute',
                        display: 'flex',
                        top: spanDom(2),
                        left: spanDom(5.5)
                    }}>
                        <Preference.ByDrag privatePrices={privatePrices}
                                           setPreferences={preferences => this.setState({preferences})}/>
                    </section> : null
            }
        </section>
    }

    renderPlay() {
        return <g transform={`translate(${span(1.2)},${span(3.5)})`}>
            <image href={require('./img/playerSide.svg')}/>
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

namespace Preference {
    interface IPreferItem {
        id: string
        content: string
    }

    const Container = {
        from: 'from',
        to: 'to'
    }
    type TContainerId = keyof typeof Container | string

    interface IPreferenceProps {
        privatePrices: Array<number>
        setPreferences: (preferences: Array<number>) => void
    }

    interface IDragTarget {
        index: number
        droppableId: TContainerId
    }

    export function ByDrag(props: IPreferenceProps) {
        const initialItems = props.privatePrices.map((price, i) => ({id: i.toString(), content: price.toString()}))
        const [from, setFrom] = React.useState<Array<IPreferItem>>(initialItems),
            [to, setTo] = React.useState<Array<IPreferItem>>([])

        function setData(container: TContainerId, data: Array<IPreferItem>) {
            switch (container) {
                case Container.from:
                    setFrom(data)
                    break
                case Container.to:
                    setTo(data)
                    props.setPreferences(data.map(({id}) => +id))
                    break
            }
        }

        function handleDragEnd({source, destination}: {
            source: IDragTarget,
            destination?: IDragTarget
        }) {
            const getList = (id: TContainerId) => ({
                [Container.from]: from,
                [Container.to]: to
            }[id])
            if (!destination) {
                return
            }
            if (source.droppableId === destination.droppableId) {
                const sourceClone = Array.from(getList(source.droppableId))
                const [removed] = sourceClone.splice(source.index, 1)
                sourceClone.splice(destination.index, 0, removed)
                setData(source.droppableId, sourceClone)
            } else {
                const sourceClone = Array.from(getList(source.droppableId)),
                    destClone = Array.from(getList(destination.droppableId))
                const [removed] = sourceClone.splice(source.index, 1)
                destClone.splice(destination.index, 0, removed)
                setData(source.droppableId, sourceClone)
                setData(destination.droppableId, destClone)
            }
        }

        return <DragDropContext onDragEnd={result => handleDragEnd(result)}>
            <List id={Container.from} items={from}/>
            <div style={{
                marginLeft: spanDom(.2),
                border: '2px solid #333',
                borderRadius: '.5rem'
            }}>
                <List id={Container.to} items={to}/>
            </div>
        </DragDropContext>
    }

    const listStyle: React.CSSProperties = {
        padding: spanDom(.1),
        width: spanDom(1),
        height: spanDom(7.2)
    }
    const itemStyle: React.CSSProperties = {
        userSelect: 'none',
        background: `url(${require('./img/box.svg')}) no-repeat`,
        backgroundSize: 'contain',
        height: spanDom(.8),
        marginTop: spanDom(.1),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: spanDom(.35)
    }

    function List({id, items}: { id: TContainerId, items: Array<IPreferItem> }) {
        return <Droppable droppableId={id}>
            {
                ({innerRef, placeholder}) =>
                    <div ref={innerRef} style={listStyle}>
                        {
                            items.map(({id, content}, index) =>
                                <Draggable key={id} draggableId={id} index={index}>
                                    {
                                        ({innerRef, draggableProps, dragHandleProps}) =>
                                            <div ref={innerRef} {...draggableProps} {...dragHandleProps}
                                                 style={{...itemStyle, ...draggableProps.style}}>
                                                {content}
                                            </div>
                                    }
                                </Draggable>)
                        }
                        {placeholder}
                    </div>}
        </Droppable>
    }
}
